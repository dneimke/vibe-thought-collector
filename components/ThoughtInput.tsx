

import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Changed LiveSession to Session as it is not an exported member of the package.
import { GoogleGenAI, Session, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicrophoneIcon, StopIcon, PaperAirplaneIcon } from './icons';

// Audio helper functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

interface ThoughtInputProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

const ThoughtInput: React.FC<ThoughtInputProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // FIX: Changed LiveSession to Session to match the type from ai.live.connect.
  const sessionPromiseRef = useRef<Promise<Session> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
        if (!process.env.API_KEY) throw new Error("API key not found");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        setIsRecording(true);
        setContent(''); // Clear previous text
        
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => console.log('Live session opened.'),
                onmessage: (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        setContent(prev => prev + text);
                    }
                    // FIX: Per Gemini API guidelines, audio output must be handled when using transcription.
                    // This component is for transcription only, so we will ignore audio output.
                    if (message.serverContent?.modelTurn?.parts[0]?.inlineData.data) {
                        // Audio output is received but intentionally ignored to prevent unintended playback.
                    }
                },
                onerror: (e: ErrorEvent) => console.error('Live session error:', e),
                onclose: (e: CloseEvent) => console.log('Live session closed.'),
            },
            config: {
                inputAudioTranscription: {},
                // FIX: Per Gemini API guidelines, responseModalities must be set for transcription.
                responseModalities: [Modality.AUDIO],
            },
        });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            }
        };

        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(audioContextRef.current.destination);

    } catch (err) {
      console.error("Failed to start recording:", err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }

    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }

    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
        if(isRecording) {
            stopRecording();
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isRecording ? "Listening..." : "Capture a thought..."}
        className="w-full h-32 p-4 pr-28 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-200 resize-none"
        disabled={isLoading}
      />
      <div className="absolute top-3 right-3 flex flex-col space-y-2">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-cyan-500 hover:bg-cyan-600'
          }`}
        >
          {isRecording ? <StopIcon className="w-6 h-6 text-white" /> : <MicrophoneIcon className="w-6 h-6 text-white" />}
        </button>
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <PaperAirplaneIcon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ThoughtInput;