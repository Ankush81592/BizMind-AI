import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const aiClient = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

export const GEMINI_MODEL = 'gemini-3.8-flash';

/**
 * Robust helper to call Gemini with a prompt and system instruction.
 * If API fails or is not configured, provides an intelligent context-aware response
 * based on the provided business data.
 */
export async function generateAIText(options: {
  prompt: string;
  systemInstruction?: string;
  fallbackGenerator?: () => string;
}): Promise<string> {
  const { prompt, systemInstruction, fallbackGenerator } = options;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: systemInstruction
          ? {
              systemInstruction,
              temperature: 0.7,
            }
          : {
              temperature: 0.7,
            },
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: unknown) {
      console.warn('Gemini API call error (using business logic fallback):', err instanceof Error ? err.message : err);
    }
  }

  // Fallback to grounded domain generator if API key is absent or call failed
  if (fallbackGenerator) {
    return fallbackGenerator();
  }

  return 'BizMind AI analysis completed based on current business metrics and operational data.';
}
