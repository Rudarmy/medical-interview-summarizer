import { Summary } from '../types';
import { GoogleGenAI } from '@google/generative-ai';

// For client-side usage where users provide their own API key
let genAI: GoogleGenAI | null = null;

const systemInstruction = `
You are an expert AI medical assistant. Your primary function is to process the transcribed text from a pre-consultation patient interview and transform it into a structured, concise, and clinically relevant summary for a pain management specialist. The goal is to save the physician time and provide them with the key information needed for the patient encounter.

INSTRUCTIONS:
Analyze the Input: Carefully read the full text of the patient's transcribed responses.
Extract Key Information: Identify and extract clinically significant details related to the patient's chronic pain, including: Chief Complaint (the main reason for the visit), History of Present Illness (location, duration, quality, severity, timing, context, modifying factors), Past Medical History mentioned, Current Medications mentioned, and Impact on Daily Life (sleep, work, mood, activities).
Format the Output: Structure the extracted information into the JSON schema provided. Do not add any information that is not present in the patient's transcript. Use neutral, objective, and professional medical language. Be concise and avoid conversational filler.
`;

const responseSchema = {
  type: "object",
  properties: {
    chiefComplaint: { 
      type: "string", 
      description: "The main reason for the visit, e.g., 'Chronic lower back pain'." 
    },
    historyOfPresentIllness: { 
      type: "string", 
      description: "A detailed paragraph summarizing the history of the pain, including location, duration, quality, severity, timing, context, and modifying factors." 
    },
    currentMedications: { 
      type: "string", 
      description: "A list of current medications the patient mentioned, including dosage and frequency if available. If none mentioned, state 'None mentioned'." 
    },
    impactOnDailyLife: { 
      type: "string", 
      description: "How the pain affects the patient's daily life, such as sleep, work, mood, and activities. If none mentioned, state 'None mentioned'."
    },
  },
  required: ["chiefComplaint", "historyOfPresentIllness", "currentMedications", "impactOnDailyLife"]
};

export const initializeAPI = (apiKey: string) => {
  genAI = new GoogleGenAI(apiKey);
};

export const summarizeTranscript = async (transcript: string, language: string, apiKey?: string): Promise<Summary> => {
  if (apiKey) {
    genAI = new GoogleGenAI(apiKey);
  }
  
  if (!genAI) {
    throw new Error('API key not provided. Please initialize with your Google Gemini API key.');
  }

  const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction + languageInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    const result = await model.generateContent(transcript);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/^```json\n?/, '').replace(/```$/, '');
    const summary = JSON.parse(cleanedText);

    return summary;

  } catch (error) {
    console.error("Error summarizing transcript:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error("Failed to get a valid summary from the AI. The response was not in the expected format.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
};

export const summarizeAudioFromFile = async (file: File, language: string, apiKey?: string): Promise<Summary> => {
  if (apiKey) {
    genAI = new GoogleGenAI(apiKey);
  }
  
  if (!genAI) {
    throw new Error('API key not provided. Please initialize with your Google Gemini API key.');
  }

  const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
  
  try {
    const audioPart = await fileToGenerativePart(file);
    const textPart = { text: "First, transcribe the attached audio of a patient interview. Then, using the transcript, generate a clinical summary." };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction + languageInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    const result = await model.generateContent([audioPart, textPart]);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/^```json\n?/, '').replace(/```$/, '');
    const summary = JSON.parse(cleanedText);

    return summary;

  } catch (error) {
    console.error("Error summarizing audio file:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error("Failed to get a valid summary from the AI. The response was not in the expected format.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
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
