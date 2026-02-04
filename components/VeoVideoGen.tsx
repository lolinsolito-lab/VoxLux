import React, { useState } from 'react';
import { createClient, ensureApiKeySelected, fileToGenerativePart } from '../services/gemini';
import { Video, Loader, Upload } from 'lucide-react';

export const VeoVideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

  const generateVideo = async () => {
    if (!prompt && !imageFile) return;
    
    setLoading(true);
    setVideoUrl(null);
    setProgress('Checking credentials...');

    try {
      const hasKey = await ensureApiKeySelected();
      if (!hasKey) {
        setLoading(false);
        setProgress('API Key selection cancelled.');
        return;
      }

      // Re-initialize client after key selection to ensure it picks up the key
      const ai = createClient();
      
      setProgress('Initializing Veo generation...');
      
      let payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio,
        }
      };

      if (prompt) payload.prompt = prompt;

      if (imageFile) {
         const imgPart = await fileToGenerativePart(imageFile);
         payload.image = {
             imageBytes: imgPart.inlineData.data,
             mimeType: imgPart.inlineData.mimeType
         };
      }

      let operation = await ai.models.generateVideos(payload);

      setProgress('Dreaming... (This may take a moment)');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setProgress('Rendering frames...');
      }

      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        // Append key for fetching
        const fetchUrl = `${uri}&key=${process.env.API_KEY}`;
        const vidResponse = await fetch(fetchUrl);
        const vidBlob = await vidResponse.blob();
        setVideoUrl(URL.createObjectURL(vidBlob));
        setProgress('Complete.');
      } else {
        setProgress('Failed to generate video.');
      }

    } catch (e: any) {
      console.error(e);
      setProgress(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
       <h2 className="text-3xl font-serif text-lux-gold mb-6">VEO CINEMA</h2>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="bg-lux-black border border-lux-gold/20 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Creative Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-lux-gold outline-none h-32"
                  placeholder="A cinematic drone shot of a golden city..."
                />

                <label className="block text-sm font-medium text-gray-400 mt-4 mb-2">Reference Image (Optional)</label>
                <div className="relative border border-dashed border-slate-600 rounded p-4 text-center hover:border-lux-gold transition-colors">
                   <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                   <div className="flex flex-col items-center justify-center text-gray-400">
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-xs">{imageFile ? imageFile.name : "Upload Image"}</span>
                   </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                     <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Aspect</label>
                     <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full bg-slate-900 text-white p-2 text-sm border border-slate-700 rounded">
                        <option value="16:9">Landscape (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                     </select>
                  </div>
                  <div className="flex-1">
                     <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Resolution</label>
                     <select value={resolution} onChange={(e) => setResolution(e.target.value as any)} className="w-full bg-slate-900 text-white p-2 text-sm border border-slate-700 rounded">
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                     </select>
                  </div>
                </div>

                <button 
                  onClick={generateVideo}
                  disabled={loading || (!prompt && !imageFile)}
                  className="w-full mt-6 bg-lux-gold text-lux-black font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                   {loading ? <Loader className="animate-spin w-4 h-4" /> : <Video className="w-4 h-4" />}
                   GENERATE
                </button>
                {loading && <p className="text-xs text-center mt-2 text-lux-gold animate-pulse">{progress}</p>}
             </div>
          </div>

          <div className="bg-black/50 border border-slate-800 rounded-lg flex items-center justify-center min-h-[400px]">
             {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[600px] rounded shadow-2xl border border-lux-gold/10" />
             ) : (
                <div className="text-center text-gray-600">
                   <Video className="w-12 h-12 mx-auto mb-2 opacity-20" />
                   <p className="text-sm">Output will materialize here</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};