import React, { useState } from 'react';
import { createClient, fileToGenerativePart } from '../services/gemini';
import { Activity, Upload, Loader } from 'lucide-react';

export const VideoAnalyze: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis('');

    try {
      const ai = createClient();
      const videoPart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            videoPart,
            { text: "Analyze this video in detail. Describe key events, visual style, and any detected text or objects." }
          ]
        },
        config: {
          thinkingConfig: { thinkingBudget: 1024 } // Use thinking for deeper analysis
        }
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (e: any) {
      setAnalysis(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-serif text-lux-gold mb-6">VISION CORE</h2>
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="bg-lux-black border border-lux-gold/20 p-8 rounded-lg text-center">
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lux-gold file:text-black hover:file:bg-white mb-4"
            />
            {file && <p className="text-sm text-gray-300 mb-4">{file.name}</p>}
            
            <button 
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="bg-lux-gold/10 border border-lux-gold text-lux-gold px-8 py-2 rounded-full hover:bg-lux-gold hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin inline w-4 h-4" /> : "Initiate Analysis"}
            </button>
         </div>

         {analysis && (
           <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
             <h3 className="text-lux-gold font-serif mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> Analysis Report</h3>
             <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-light">
               {analysis}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};