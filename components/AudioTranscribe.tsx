import React, { useState } from 'react';
import { createClient, fileToGenerativePart } from '../services/gemini';
import { Keyboard, Upload, Loader } from 'lucide-react';

export const AudioTranscribe: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true);
    setTranscript('');

    try {
      const ai = createClient();
      const audioPart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            audioPart,
            { text: "Transcribe this audio exactly as spoken." }
          ]
        }
      });

      setTranscript(response.text || "No text found.");
    } catch (e: any) {
      setTranscript(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full">
       <h2 className="text-3xl font-serif text-lux-gold mb-6">SCRIBE</h2>
       <div className="max-w-2xl mx-auto space-y-6">
          <div className="border border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-900/50">
             <input 
               type="file"
               accept="audio/*"
               onChange={(e) => setFile(e.target.files?.[0] || null)}
               className="hidden"
               id="audio-upload"
             />
             <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-500 mb-2 hover:text-lux-gold transition-colors" />
                <span className="text-gray-400 text-sm">{file ? file.name : "Upload Audio File"}</span>
             </label>
             <button
               onClick={handleTranscribe}
               disabled={loading || !file}
               className="mt-6 bg-lux-gold text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-white disabled:opacity-50"
             >
               {loading ? <Loader className="animate-spin w-4 h-4 inline" /> : "Transcribe"}
             </button>
          </div>
          
          {transcript && (
             <div className="bg-white/5 p-6 rounded border border-slate-700">
               <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm">{transcript}</pre>
             </div>
          )}
       </div>
    </div>
  );
};