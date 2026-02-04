import React, { useState } from 'react';
import { createClient } from '../services/gemini';
import { Box, Send, Loader } from 'lucide-react';

export const GeneralTask: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<'flash' | 'pro'>('pro');

  const handleSubmit = async () => {
    if (!input) return;
    setLoading(true);
    
    try {
      const ai = createClient();
      const model = modelType === 'pro' ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
      
      const config: any = {};
      if (modelType === 'pro') {
          // Add thinking for complex tasks
          config.thinkingConfig = { thinkingBudget: 1024 };
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: input,
        config: config
      });
      
      setOutput(response.text || "No response.");
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
       <h2 className="text-3xl font-serif text-lux-gold mb-6">OMNI TASK</h2>
       
       <div className="flex-1 bg-lux-black border border-lux-gold/20 rounded-lg p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50 rounded border border-slate-800">
             {loading && <div className="flex items-center gap-2 text-lux-gold"><Loader className="animate-spin w-4 h-4"/> Processing...</div>}
             {!loading && output && <div className="prose prose-invert max-w-none whitespace-pre-wrap">{output}</div>}
             {!loading && !output && <div className="text-gray-600 text-center mt-20 italic">Awaiting instruction...</div>}
          </div>
          
          <div className="flex gap-4 items-end">
             <div className="flex-1">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything (Reasoning, Code, Writing)..."
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-lux-gold outline-none resize-none h-24"
                />
             </div>
             <div className="flex flex-col gap-2">
                <select 
                  value={modelType} 
                  onChange={(e) => setModelType(e.target.value as any)}
                  className="bg-slate-800 text-xs text-white p-2 rounded border border-slate-700"
                >
                  <option value="pro">Gemini 3 Pro (Complex)</option>
                  <option value="flash">Gemini 2.5 Flash (Fast)</option>
                </select>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !input}
                  className="bg-lux-gold text-black p-3 rounded hover:bg-white transition-colors disabled:opacity-50"
                >
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};