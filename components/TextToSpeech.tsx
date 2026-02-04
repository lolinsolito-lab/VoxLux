import React, { useState } from 'react';
import { createClient } from '../services/gemini';
import { Modality } from '@google/genai';
import { FileAudio, Play, Loader } from 'lucide-react';
import { base64ToUint8Array, decodeAudioData } from '../services/audioUtils';

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSpeak = async () => {
    if (!text) return;
    setLoading(true);

    try {
      const ai = createClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: { parts: [{ text }] },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error(e);
      alert('Error generating speech');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full">
      <h2 className="text-3xl font-serif text-lux-gold mb-6">ORATOR</h2>
      <div className="max-w-2xl mx-auto bg-lux-black border border-lux-gold/20 p-6 rounded-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
          className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-white h-48 focus:border-lux-gold outline-none mb-4"
        />
        <button
          onClick={handleSpeak}
          disabled={loading || !text}
          className="w-full bg-lux-gold text-lux-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
          Speak
        </button>
      </div>
    </div>
  );
};