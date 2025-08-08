import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { InputMode } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { UploadIcon } from './icons/UploadIcon';
import { FileAudioIcon } from './icons/FileAudioIcon';


// Add types for the SpeechRecognition API to prevent TypeScript errors, as it's
// not yet part of standard DOM type definitions.
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang?: string;
    onresult: (event: any) => void;
    onstart: () => void;
    onend: () => void;
    onerror: (event: any) => void;
    start: () => void;
    stop: () => void;
    abort: () => void;
}

interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

const SpeechRecognitionAPI = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as SpeechRecognitionStatic | undefined;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

interface TranscriptInputProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  audioFile: File | null;
  onAudioFileChange: (file: File | null) => void;
  onLoadExample: () => void;
  disabled: boolean;
  language: string;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode, disabled: boolean }> = ({ active, onClick, children, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out disabled:opacity-50
            ${active 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`
        }
    >
        {children}
    </button>
);


const RecordView: React.FC<{ onTranscriptChange: (value: string) => void; disabled: boolean; language: string }> = ({ onTranscriptChange, disabled, language }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const accumulatedTranscriptRef = useRef<string>('');
    const shouldContinueRef = useRef<boolean>(false);
    const finalizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const languageLoggedRef = useRef<string>(''); // Track logged language to prevent duplicates

    // Map language names to speech recognition language codes
    const getLanguageCode = (language: string): string => {
        const languageMap: { [key: string]: string } = {
            'English': 'en-US',
            'Spanish': 'es-ES',
            'French': 'fr-FR',
            'German': 'de-DE',
            'Italian': 'it-IT',
            'Portuguese': 'pt-PT',
            'Dutch': 'nl-NL',
            'Chinese': 'zh-CN',
            'Japanese': 'ja-JP',
            'Korean': 'ko-KR',
            'Russian': 'ru-RU',
            'Arabic': 'ar-SA',
            'Hindi': 'hi-IN',
            'Turkish': 'tr-TR',
            'Polish': 'pl-PL',
            'Swedish': 'sv-SE',
            'Norwegian': 'nb-NO',
            'Danish': 'da-DK',
            'Finnish': 'fi-FI',
            'Greek': 'el-GR',
            'Hebrew': 'he-IL',
            'Thai': 'th-TH',
            'Vietnamese': 'vi-VN',
            'Indonesian': 'id-ID',
            'Malay': 'ms-MY',
            'Tamil': 'ta-IN',
            'Bengali': 'bn-IN',
            'Gujarati': 'gu-IN',
            'Kannada': 'kn-IN',
            'Malayalam': 'ml-IN',
            'Marathi': 'mr-IN',
            'Telugu': 'te-IN',
            'Urdu': 'ur-PK'
        };
        
        return languageMap[language] || 'en-US'; // Default to English if language not found
    };

    const startRecording = () => {
        if (!isSpeechRecognitionSupported || !SpeechRecognitionAPI) {
            setError("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        shouldContinueRef.current = true;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Set language based on user selection
        if ('lang' in recognition) {
            const languageCode = getLanguageCode(language);
            (recognition as any).lang = languageCode;
            
            // Only log if language changed
            if (languageLoggedRef.current !== languageCode) {
                console.log(`Speech recognition language set to: ${languageCode} for ${language}`);
                languageLoggedRef.current = languageCode;
            }
        }

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            

            
            // Process all results from the current event
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update accumulated transcript with final results
            if (finalTranscript) {
                accumulatedTranscriptRef.current += finalTranscript;


            }
            
            // If we have interim results, set a timeout to finalize them
            if (interimTranscript && !finalTranscript) {
                // Clear any existing timeout
                if (finalizeTimeoutRef.current) {
                    clearTimeout(finalizeTimeoutRef.current);
                }
                
                // Set a new timeout to finalize interim results after 2 seconds of silence
                finalizeTimeoutRef.current = setTimeout(() => {

                    accumulatedTranscriptRef.current += interimTranscript + ' ';
                    const finalizedTranscript = accumulatedTranscriptRef.current;

                    onTranscriptChange(finalizedTranscript);
                }, 2000);
            }
            
            // Always send the current state (accumulated + interim) to show real-time feedback
            const displayTranscript = accumulatedTranscriptRef.current + interimTranscript;

            onTranscriptChange(displayTranscript);
        };
        
        recognition.onstart = () => {
            setIsRecording(true);
            setError(null);

        };
        
        recognition.onend = () => {

            // Only restart if we should continue and haven't been manually stopped
            if (shouldContinueRef.current && recognitionRef.current) {
                setTimeout(() => {
                    if (shouldContinueRef.current && recognitionRef.current) {
                        try {

                            recognitionRef.current.start();
                        } catch (e) {

                            setIsRecording(false);
                        }
                    }
                }, 100);
            } else {
                setIsRecording(false);
            }
        };
        
        // Add additional event handlers for debugging (cast to any for TypeScript)
        (recognition as any).onaudiostart = () => {

        };
        
        (recognition as any).onaudioend = () => {

        };
        
        (recognition as any).onspeechstart = () => {

        };
        
        (recognition as any).onspeechend = () => {

        };
        
        (recognition as any).onsoundstart = () => {

        };
        
        (recognition as any).onsoundend = () => {

        };
        
        recognition.onerror = (event) => {

            
            // Handle different error types
            if (event.error === 'no-speech') {
                // Continue recording despite no speech
                return;
            }
            
            if (event.error === 'audio-capture') {
                setError('Microphone access denied. Please allow microphone permissions.');
                stopRecording();
            } else if (event.error === 'not-allowed') {
                setError('Microphone permission denied. Please refresh and allow microphone access.');
                stopRecording();
            } else if (event.error === 'aborted') {
                // Expected when stopping manually
                return;
            } else {
                setError(`Speech recognition error: ${event.error}`);
                stopRecording();
            }
        };

        try {
            recognition.start();
        } catch (e) {
            setError('Failed to start recording. Please try again.');
            console.error('Start recording error:', e);
        }
    };

    const stopRecording = () => {
        shouldContinueRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        // Clear any pending finalization timeout
        if (finalizeTimeoutRef.current) {
            clearTimeout(finalizeTimeoutRef.current);
            finalizeTimeoutRef.current = null;
        }
        setIsRecording(false);
    };

    const handleRecord = () => {
        if (isRecording) {
            stopRecording();
        } else {
            // Reset accumulated transcript when starting new recording
            accumulatedTranscriptRef.current = '';
            onTranscriptChange('');
            startRecording();
        }
    };
    
    useEffect(() => {
        return () => {
            shouldContinueRef.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (finalizeTimeoutRef.current) {
                clearTimeout(finalizeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="text-center p-8 border-t border-slate-200">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
                onClick={handleRecord}
                disabled={disabled}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 mx-auto
                    ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}
                    text-white shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed
                `}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                <MicrophoneIcon className="w-10 h-10" />
                {isRecording && <span className="absolute inset-0 rounded-full bg-white/30 animate-ping"></span>}
            </button>
            <p className="mt-4 font-semibold text-slate-700">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
                {isRecording 
                    ? "Speak clearly into your microphone. The recording will continue until you click stop." 
                    : "Click the button and speak your patient interview. Recording will continue until you stop it."
                }
            </p>
        </div>
    );
};

const UploadView: React.FC<{ audioFile: File | null; onAudioFileChange: (file: File | null) => void; disabled: boolean }> = ({ audioFile, onAudioFileChange, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null) => {
        if (file && file.type === 'audio/mpeg') {
            onAudioFileChange(file);
        } else if (file) {
            alert("Please upload a valid MP3 file.");
        }
    };

    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    if (audioFile) {
        return (
            <div className="p-4 border-t border-slate-200 text-center">
                 <div className="flex items-center justify-center bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
                    <FileAudioIcon className="w-6 h-6 mr-3"/>
                    <span className="font-medium truncate">{audioFile.name}</span>
                    <button onClick={() => onAudioFileChange(null)} disabled={disabled} className="ml-4 text-sm font-bold text-green-800 hover:text-green-900">&times;</button>
                 </div>
            </div>
        )
    }

    return (
        <div 
            className={`p-8 border-t border-dashed border-slate-300 text-center transition-colors ${isDragging ? 'bg-blue-50' : 'bg-slate-50'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input type="file" accept="audio/mp3" ref={inputRef} className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            <div className="flex justify-center items-center text-slate-400 mb-2">
                <UploadIcon className="w-10 h-10"/>
            </div>
            <p className="text-slate-600 font-medium">Drag & drop an MP3 file</p>
            <p className="text-sm text-slate-500">or</p>
            <button onClick={() => inputRef.current?.click()} disabled={disabled} className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-slate-400 transition-colors">
                Browse file
            </button>
        </div>
    );
};


const TranscriptInput: React.FC<TranscriptInputProps> = ({ transcript, onTranscriptChange, audioFile, onAudioFileChange, onLoadExample, disabled, language }) => {
  const [mode, setMode] = useState<InputMode>('text');

  const handleModeChange = (newMode: InputMode) => {
    if (disabled) return;
    setMode(newMode);
  };

  const handleLocalTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTranscriptChange(e.target.value);
  }

  const handleRecordingTranscript = (value: string) => {

    onTranscriptChange(value);
    // Don't switch tabs - stay on record tab while recording
  }

  return (
    <div>
        <div className="border-b border-slate-200 flex">
            <TabButton active={mode === 'text'} onClick={() => handleModeChange('text')} disabled={disabled}>
                <ClipboardIcon className="w-5 h-5 mr-2" /> Text
            </TabButton>
            <TabButton active={mode === 'record'} onClick={() => handleModeChange('record')} disabled={disabled}>
                <MicrophoneIcon className="w-5 h-5 mr-2" /> Record
            </TabButton>
            <TabButton active={mode === 'upload'} onClick={() => handleModeChange('upload')} disabled={disabled}>
                <UploadIcon className="w-5 h-5 mr-2" /> Upload
            </TabButton>
        </div>
        
        {mode === 'text' && (
             <div className="pt-6">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="transcript" className="flex items-center text-lg font-semibold text-slate-700">
                        Patient Interview Transcript
                    </label>
                    <button
                        onClick={onLoadExample}
                        disabled={disabled}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-slate-400 transition-colors"
                    >
                        Load Example
                    </button>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                    Paste the transcript, record audio, or upload an MP3 file.
                </p>
                <textarea
                    id="transcript"
                    rows={10}
                    className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-slate-100"
                    placeholder="e.g., 'Okay, so... it's my lower back, mainly on the right side...'"
                    value={transcript}
                    onChange={handleLocalTranscriptChange}
                    disabled={disabled}
                />
            </div>
        )}

        {mode === 'record' && <RecordView onTranscriptChange={handleRecordingTranscript} disabled={disabled} language={language} />}
        
        {mode === 'upload' && <UploadView audioFile={audioFile} onAudioFileChange={onAudioFileChange} disabled={disabled} />}
    </div>
  );
};

export default TranscriptInput;
