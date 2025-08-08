import { Summary } from '../types';

// API base URL: prefer Vite env, fallback to production backend
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'https://medical-interview-summarizer-production.up.railway.app/api';

export const summarizeTranscript = async (transcript: string, language: string): Promise<Summary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        language
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.summary) {
      throw new Error('Invalid response format from server');
    }

    return data.summary;

  } catch (error) {
    console.error("Error summarizing transcript:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
};

export const summarizeAudioFromFile = async (file: File, language: string): Promise<Summary> => {
  try {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', language);

    const response = await fetch(`${API_BASE_URL}/summarize-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.summary) {
      throw new Error('Invalid response format from server');
    }

    return data.summary;

  } catch (error) {
    console.error("Error summarizing audio file:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An error occurred while communicating with the AI. Please try again later.");
  }
};
