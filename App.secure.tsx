import React, { useState } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { TranscriptInput } from './components/TranscriptInput';
import { SummaryOutput } from './components/SummaryOutput';
import { summarizeTranscript, summarizeAudioFromFile } from './services/geminiService';
import { Summary } from './types';

const App: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState('English');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleSummarize = async (transcript: string) => {
    if (!apiKey.trim()) {
      setError('Please enter your Google Gemini API key first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary(null);
    
    try {
      const result = await summarizeTranscript(transcript, language, apiKey);
      setSummary(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!apiKey.trim()) {
      setError('Please enter your Google Gemini API key first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary(null);
    
    try {
      const result = await summarizeAudioFromFile(file, language, apiKey);
      setSummary(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                API Key Required
              </h2>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  To use this application, you need your own Google Gemini API key. This ensures your data stays secure and you have full control over usage.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">How to get your API key:</h3>
                  <ol className="list-decimal list-inside text-blue-700 space-y-1">
                    <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the generated key and paste it below</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowApiKeyInput(false)}
                    disabled={!apiKey.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  🔒 Your API key is stored only in your browser session and never sent to any server except Google's AI service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Change API Key
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TranscriptInput 
            onSummarize={handleSummarize} 
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
          />
          <SummaryOutput 
            summary={summary} 
            isLoading={isLoading} 
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
