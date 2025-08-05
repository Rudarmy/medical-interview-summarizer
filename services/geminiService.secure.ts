import { GoogleGenAI, Type } from "@google/genai";
import { Summary } from '../types';

const systemInstruction = `
You are an expert AI medical assistant. Your primary function is to process the transcribed text from a pre-consultation patient interview and transform it into a structured, concise, and clinically relevant summary for a pain management specialist. The goal is to save the physician time and provide them with the key information needed for the patient encounter.

INSTRUCTIONS:
Analyze the Input: Carefully read the full text of the patient's transcribed responses.
Extract Key Information: Identify and extract clinically significant details related to the patient's chronic pain, including: Chief Complaint (the main reason for the visit), History of Present Illness (location, duration, quality, severity, timing, context, modifying factors), Past Medical History mentioned, Current Medications mentioned, and Impact on Daily Life (sleep, work, mood, activities).
Format the Output: Structure the extracted information into the JSON schema provided. Do not add any information that is not present in the patient's transcript. Use neutral, objective, and professional medical language. Be concise and avoid conversational filler.
`;

const schema = {
  type: Type.OBJECT,
  properties: {
    chiefComplaint: { 
      type: Type.STRING, 
      description: "The main reason for the visit, e.g., 'Chronic lower back pain'." 
    },
    historyOfPresentIllness: { 
      type: Type.STRING, 
      description: "A detailed paragraph summarizing the history of the pain, including location, duration, quality, severity, timing, context, and modifying factors." 
    },
    currentMedications: { 
      type: Type.STRING, 
      description: "A list of current medications the patient mentioned, including dosage and frequency if available. If none mentioned, state 'None mentioned'." 
    },
    impactOnDailyLife: { 
      type: Type.STRING, 
      description: "How the pain affects the patient's daily life, such as sleep, work, mood, and activities. If none mentioned, state 'None mentioned'."
    },
  },
  required: ["chiefComplaint", "historyOfPresentIllness", "currentMedications", "impactOnDailyLife"]
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const summarizeTranscript = async (transcript: string, language: string, apiKey: string): Promise<Summary> => {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: transcript,
      config: {
        systemInstruction: systemInstruction + languageInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      },
    });
    
    const jsonText = response.text.trim();
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    
    const parsedSummary: Summary = JSON.parse(cleanedJsonText);
    return parsedSummary;

  } catch (error) {
    console.error("Error summarizing transcript:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to get a valid summary from the AI. The response was not in the expected format.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
};

export const summarizeAudioFromFile = async (file: File, language: string, apiKey: string): Promise<Summary> => {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
  
  try {
    const audioPart = await fileToGenerativePart(file);
    const textPart = { text: "First, transcribe the attached audio of a patient interview. Then, using the transcript, generate a clinical summary." };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [audioPart, textPart] },
      config: {
        systemInstruction: systemInstruction + languageInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    
    const parsedSummary: Summary = JSON.parse(cleanedJsonText);
    return parsedSummary;
  } catch (error) {
    console.error("Error summarizing audio file:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error("Failed to get a valid summary from the AI. The response was not in the expected format.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
};
