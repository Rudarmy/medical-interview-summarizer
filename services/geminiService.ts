import { Summary } from '../types';

// Use environment variable or fallback to localhost for development
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

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
      const errorData = await response.json().catch(() => ({}));
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