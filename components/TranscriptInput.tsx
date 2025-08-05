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


const RecordView: React.FC<{ onTranscriptChange: (value: string) => void; disabled: boolean }> = ({ onTranscriptChange, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleRecord = () => {
        if (!isSpeechRecognitionSupported || !SpeechRecognitionAPI) {
            setError("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                 finalTranscript += event.results[i][0].transcript;
            }
            onTranscriptChange(finalTranscript);
        };
        
        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsRecording(false);
        };

        recognition.start();
    };
    
    useEffect(() => {
        return () => {
            recognitionRef.current?.abort();
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
            <p className="mt-4 font-semibold text-slate-700">{isRecording ? "Recording..." : "Start Recording"}</p>
            <p className="mt-1 text-sm text-slate-500">{isRecording ? "Click to stop" : "Click the button to start recording"}</p>
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


const TranscriptInput: React.FC<TranscriptInputProps> = ({ transcript, onTranscriptChange, audioFile, onAudioFileChange, onLoadExample, disabled }) => {
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
    setMode('text');
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

        {mode === 'record' && <RecordView onTranscriptChange={handleRecordingTranscript} disabled={disabled} />}
        
        {mode === 'upload' && <UploadView audioFile={audioFile} onAudioFileChange={onAudioFileChange} disabled={disabled} />}
    </div>
  );
};

export default TranscriptInput;