
import { GoogleGenAI, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateNexusResponse = async (prompt: string, systemInstruction?: string) => {
  const ai = getAIClient();
  const defaultInstruction = "You are Nexus IA, a helpful and highly intelligent assistant. When providing code or scripts, ALWAYS use markdown code blocks and ALWAYS specify the language name (e.g., ```python, ```javascript, ```java).";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || defaultInstruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });
  return response.text;
};

export const generateNexusImage = async (prompt: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image generation failed");
};

export const generateNexusSpeech = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const analyzeImage = async (imageB64: string, prompt: string) => {
  const ai = getAIClient();
  const pureBase64 = imageB64.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: pureBase64, mimeType: 'image/png' } },
        { text: prompt || "Describe this image in detail." }
      ]
    },
  });
  return response.text;
};
