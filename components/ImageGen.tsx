import React, { useState } from 'react';
import { createClient, ensureApiKeySelected } from '../services/gemini';
import { Image as ImageIcon, Loader } from 'lucide-react';

const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const hasKey = await ensureApiKeySelected();
      if (!hasKey) {
        setLoading(false);
        return;
      }
      
      const ai = createClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: ratio,
            imageSize: "1K"
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Generation failed. Ensure you are using a paid project for this model.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-serif text-lux-gold mb-6">LUX IMAGERY</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-lux-black border border-lux-gold/20 p-6 rounded-lg">
             <label className="block text-sm text-gray-400 mb-2">Vision Prompt</label>
             <textarea 
               className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white h-32 focus:border-lux-gold outline-none"
               placeholder="A baroque palace made of crystal..."
               value={prompt}
               onChange={e => setPrompt(e.target.value)}
             />
             
             <label className="block text-sm text-gray-400 mt-4 mb-2">Aspect Ratio</label>
             <div className="grid grid-cols-3 gap-2">
               {ASPECT_RATIOS.map(r => (
                 <button 
                   key={r}
                   onClick={() => setRatio(r)}
                   className={`p-2 text-xs border rounded ${ratio === r ? 'bg-lux-gold text-black border-lux-gold' : 'border-slate-700 text-gray-400 hover:border-slate-500'}`}
                 >
                   {r}
                 </button>
               ))}
             </div>

             <button
               onClick={handleGenerate}
               disabled={loading || !prompt}
               className="w-full mt-6 bg-lux-gold text-lux-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
             >
               {loading ? <Loader className="animate-spin w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
               Materialize
             </button>
          </div>
        </div>
        <div className="w-full lg:w-2/3 bg-black/40 border border-slate-800 rounded-lg flex items-center justify-center min-h-[500px]">
           {imageUrl ? (
             <img src={imageUrl} alt="Generated" className="max-w-full max-h-[80vh] shadow-2xl rounded border border-lux-gold/10" />
           ) : (
             <div className="text-gray-600 text-sm">Output Canvas</div>
           )}
        </div>
      </div>
    </div>
  );
};