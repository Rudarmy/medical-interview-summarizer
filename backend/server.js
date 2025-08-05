const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://goodtimesstudio.com',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// System instruction for medical summaries
const systemInstruction = `
You are an expert AI medical assistant. Your primary function is to process the transcribed text from a pre-consultation patient interview and transform it into a structured, concise, and clinically relevant summary for a pain management specialist. The goal is to save the physician time and provide them with the key information needed for the patient encounter.

INSTRUCTIONS:
Analyze the Input: Carefully read the full text of the patient's transcribed responses.
Extract Key Information: Identify and extract clinically significant details related to the patient's chronic pain, including: Chief Complaint (the main reason for the visit), History of Present Illness (location, duration, quality, severity, timing, context, modifying factors), Past Medical History mentioned, Current Medications mentioned, and Impact on Daily Life (sleep, work, mood, activities).
Format the Output: Structure the extracted information into the JSON schema provided. Do not add any information that is not present in the patient's transcript. Use neutral, objective, and professional medical language. Be concise and avoid conversational filler.
`;

// Response schema
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Summarize transcript endpoint
app.post('/api/summarize-transcript', async (req, res) => {
  try {
    const { transcript, language } = req.body;

    if (!transcript || !language) {
      return res.status(400).json({ 
        error: 'Missing required fields: transcript and language are required' 
      });
    }

    const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction + languageInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    // Retry logic for overloaded servers
    let retries = 3;
    let result;
    
    while (retries > 0) {
      try {
        result = await model.generateContent(transcript);
        break; // Success, exit retry loop
      } catch (retryError) {
        retries--;
        if (retryError.status === 503 && retries > 0) {
          console.log(`Server overloaded, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          continue;
        }
        throw retryError; // Re-throw if not a 503 or no retries left
      }
    }

    const response = await result.response;
    const text = response.text();
    
    // Clean up the JSON response
    const cleanedText = text.replace(/^```json\n?/, '').replace(/```$/, '');
    const summary = JSON.parse(cleanedText);

    res.json({ success: true, summary });

  } catch (error) {
    console.error('Error summarizing transcript:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
    });
    
    if (error.status === 503) {
      return res.status(503).json({ 
        error: 'The AI service is temporarily overloaded. Please try again in a few minutes.' 
      });
    }
    
    if (error.message && error.message.includes('JSON')) {
      return res.status(500).json({ 
        error: 'Failed to get a valid summary from the AI. The response was not in the expected format.' 
      });
    }
    
    res.status(500).json({ 
      error: 'An error occurred while communicating with the AI. Please try again later.' 
    });
  }
});

// Summarize audio file endpoint
app.post('/api/summarize-audio', upload.single('audio'), async (req, res) => {
  try {
    const { language } = req.body;
    const audioFile = req.file;

    if (!audioFile || !language) {
      return res.status(400).json({ 
        error: 'Missing required fields: audio file and language are required' 
      });
    }

    // Convert file to the format expected by Gemini
    const audioPart = {
      inlineData: {
        data: audioFile.buffer.toString('base64'),
        mimeType: audioFile.mimetype
      }
    };

    const textPart = { 
      text: "First, transcribe the attached audio of a patient interview. Then, using the transcript, generate a clinical summary." 
    };

    const languageInstruction = `\n\nIMPORTANT: The final summary output MUST be in ${language}.`;
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
    
    // Clean up the JSON response
    const cleanedText = text.replace(/^```json\n?/, '').replace(/```$/, '');
    const summary = JSON.parse(cleanedText);

    res.json({ success: true, summary });

  } catch (error) {
    console.error('Error summarizing audio file:', error);
    
    if (error.message && error.message.includes('JSON')) {
      return res.status(500).json({ 
        error: 'Failed to get a valid summary from the AI. The response was not in the expected format.' 
      });
    }
    
    res.status(500).json({ 
      error: 'An error occurred while communicating with the AI. Please try again later.' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Medical Interview Summarizer Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});
