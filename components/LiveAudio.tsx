import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '../services/gemini';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';
import { Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Power, Activity } from 'lucide-react';

export const LiveAudio: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [volume, setVolume] = useState(0);

  // Audio Context Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<Promise<any> | null>(null); // Storing the promise itself
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stop = useCallback(() => {
    setIsActive(false);
    setStatus('disconnected');

    // Close media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close contexts
    if (inputContextRef.current) inputContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();

    // Stop all playing sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    sourcesRef.current.clear();

    // We can't explicitly close the session object easily in this SDK version without keeping the resolved session,
    // but disconnecting the stream effectively stops the flow.
    // Ideally, if we had the resolved session object stored, we would call session.close().
    
    inputContextRef.current = null;
    outputContextRef.current = null;
    nextStartTimeRef.current = 0;
  }, []);

  const start = async () => {
    try {
      setStatus('connecting');
      const ai = createClient();
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "You are Vox Lux, a sophisticated and elegant AI assistant. Speak concisely and with a refined tone.",
        },
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setStatus('connected');
            setIsActive(true);

            // Setup Microphone Stream
            if (!inputContextRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length));

              const pcmBlob = createPcmBlob(inputData);
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
               const ctx = outputContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               
               try {
                 const buffer = await decodeAudioData(
                   base64ToUint8Array(audioData),
                   ctx,
                   24000,
                   1
                 );
                 
                 const source = ctx.createBufferSource();
                 source.buffer = buffer;
                 source.connect(ctx.destination);
                 
                 source.addEventListener('ended', () => sourcesRef.current.delete(source));
                 sourcesRef.current.add(source);
                 
                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += buffer.duration;
               } catch (e) {
                 console.error("Error decoding audio", e);
               }
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              if (outputContextRef.current) nextStartTimeRef.current = outputContextRef.current.currentTime;
            }
          },
          onclose: () => {
            console.log('Session closed');
            stop();
          },
          onerror: (err) => {
            console.error('Session error', err);
            stop();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to start session:", error);
      setStatus('disconnected');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-lux-black to-lux-deepBlue">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-3xl font-serif text-lux-gold mb-8 tracking-wider">VOX LIVE</h2>
        
        <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
          {/* Visualizer Circles */}
          {isActive && (
            <>
               <div className="absolute inset-0 rounded-full border border-lux-gold/30 animate-ping" style={{ animationDuration: '3s' }}></div>
               <div className="absolute inset-4 rounded-full border border-lux-gold/20 animate-ping" style={{ animationDuration: '2s' }}></div>
               <div className="absolute inset-8 rounded-full border border-lux-gold/10 animate-ping" style={{ animationDuration: '1.5s' }}></div>
            </>
          )}
          
          <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === 'connected' 
              ? 'bg-lux-gold shadow-[0_0_50px_rgba(212,175,55,0.4)] scale-110' 
              : 'bg-slate-800 border border-slate-700'
          }`}
            style={{ transform: isActive ? `scale(${1 + volume * 2})` : 'scale(1)' }}
          >
             {status === 'connected' ? <Activity className="text-black w-12 h-12" /> : <MicOff className="text-gray-500 w-12 h-12" />}
          </div>
        </div>

        <p className="text-gray-400 mb-8 font-light italic">
          {status === 'disconnected' && "Tap the orb to ascend to the conversational plane."}
          {status === 'connecting' && "Establishing connection..."}
          {status === 'connected' && "Listening..."}
        </p>

        <button
          onClick={isActive ? stop : start}
          className={`px-8 py-3 rounded-full uppercase tracking-widest font-semibold text-sm transition-all duration-300 flex items-center gap-2 mx-auto ${
            isActive 
              ? 'bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40' 
              : 'bg-lux-gold text-lux-black hover:bg-lux-goldDim hover:text-white'
          }`}
        >
          {isActive ? <><Power className="w-4 h-4" /> Disconnect</> : <><Mic className="w-4 h-4" /> Initiate Session</>}
        </button>
      </div>
    </div>
  );
};