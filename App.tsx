import React, { useState, useCallback } from 'react';
import { Summary } from './types';
import { summarizeTranscript, summarizeAudioFromFile } from './services/geminiService';
import Header from './components/Header';
import TranscriptInput from './components/TranscriptInput';
import SummaryOutput from './components/SummaryOutput';
import { SparklesIcon } from './components/icons/SparklesIcon';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('Spanish');

  const exampleTranscripts = {
    Spanish: "Bueno, entonces... es mi espalda baja, principalmente en el lado derecho. Ha estado pasando por, no sé, tal vez seis meses ahora? Es solo este dolor constante y sordo. A veces, si me siento demasiado tiempo, se vuelve realmente agudo, como una sensación punzante. En una escala del uno al diez, generalmente es un 4, pero cuando se vuelve agudo es más como un 7 u 8. Es peor por la mañana y después de conducir. Caminar un poco ayuda. He estado tomando ibuprofeno, tal vez dos o tres veces al día, pero ya no hace mucho. Realmente está afectando mi sueño... me despierto varias veces por la noche. Y ya no puedo jugar fútbol con mis hijos, lo cual es difícil.",
    English: "Okay, so... it's my lower back, mainly on the right side. It's been going on for, I don't know, maybe six months now? It's just this constant, dull ache. Sometimes, if I sit too long, it gets really sharp, like a stabbing feeling. On a scale of one to ten, it's usually a 4, but when it gets sharp it's more like a 7 or 8. It's worse in the morning and after driving. Walking around helps a bit. I've been taking ibuprofen, maybe two or three times a day, but it doesn't do much anymore. It's really affecting my sleep... I wake up a few times a night. And I can't really play soccer with my kids anymore, which is tough."
  };

  const handleSummarize = useCallback(async () => {
    if ((!transcript.trim() && !audioFile) || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      let result: Summary;
      if (audioFile) {
        result = await summarizeAudioFromFile(audioFile, language);
      } else {
        result = await summarizeTranscript(transcript, language);
      }
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, audioFile, isLoading, language]);

  const handleLoadExample = () => {
    setTranscript(exampleTranscripts[language as keyof typeof exampleTranscripts]);
    setAudioFile(null);
    setSummary(null);
    setError(null);
  };
  
  const handleTranscriptChange = (value: string) => {

    setTranscript(value);
    if(value) {
      setAudioFile(null);
    }
  }

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      setTranscript('');
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <TranscriptInput
              transcript={transcript}
              onTranscriptChange={handleTranscriptChange}
              audioFile={audioFile}
              onAudioFileChange={handleAudioFileChange}
              onLoadExample={handleLoadExample}
              disabled={isLoading}
              language={language}
            />
            <div className="mt-6 flex items-center justify-end gap-4">
              <LanguageSelector
                language={language}
                onLanguageChange={setLanguage}
                disabled={isLoading}
              />
              <button
                onClick={handleSummarize}
                disabled={(!transcript.trim() && !audioFile) || isLoading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Summarize
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 min-h-[400px]">
            <SummaryOutput summary={summary} isLoading={isLoading} error={error} />
          </div>
        </div>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by Google Gemini. This tool is for demonstration purposes only and is not a substitute for professional medical advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
