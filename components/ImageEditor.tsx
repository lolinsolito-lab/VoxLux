import React, { useState } from 'react';
import { createClient, fileToGenerativePart } from '../services/gemini';
import { Aperture, Loader, Upload } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setResult(null);
    }
  };

  const handleEdit = async () => {
    if (!imageFile || !prompt) return;
    setLoading(true);
    
    try {
      const ai = createClient();
      const imgPart = await fileToGenerativePart(imageFile);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            imgPart,
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-serif text-lux-gold mb-6">NANO EDIT</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
           <div className="bg-lux-black border border-lux-gold/20 p-6 rounded-lg">
              <label className="block text-sm text-gray-400 mb-2">Source Image</label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-lux-gold rounded-lg h-48 flex items-center justify-center cursor-pointer transition-colors overflow-hidden group">
                 <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                 {preview ? (
                   <img src={preview} className="h-full w-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" alt="Preview" />
                 ) : (
                   <div className="text-center text-gray-500">
                     <Upload className="w-8 h-8 mx-auto mb-2" />
                     <span className="text-xs">Upload to Edit</span>
                   </div>
                 )}
              </div>

              <label className="block text-sm text-gray-400 mt-4 mb-2">Instruction</label>
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Make it look like a sketch..."
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-lux-gold outline-none"
              />

              <button 
                onClick={handleEdit}
                disabled={loading || !imageFile || !prompt}
                className="w-full mt-6 bg-lux-gold text-lux-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin w-4 h-4" /> : <Aperture className="w-4 h-4" />}
                EXECUTE EDIT
              </button>
           </div>
         </div>
         <div className="bg-black/40 border border-slate-800 rounded-lg flex items-center justify-center min-h-[400px]">
            {result ? (
               <img src={result} alt="Edited" className="max-w-full max-h-[500px] rounded shadow-2xl" />
            ) : (
               <div className="text-gray-600 text-sm">Result Canvas</div>
            )}
         </div>
      </div>
    </div>
  );
};