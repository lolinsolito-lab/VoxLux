import { GoogleGenAI } from "@google/genai";

export const createClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to check for API Key selection (required for Veo/Pro Image)
export const ensureApiKeySelected = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      const selected = await (window as any).aistudio.openSelectKey();
      return selected;
    }
    return true;
  }
  return true; // Fallback for environments without the specific wrapper, assuming env var
};

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};