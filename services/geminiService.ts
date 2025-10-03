
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { ReferenceImage } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume it's always available.
  console.warn("API_KEY is not set in environment variables.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY as string });

export const generateImageWithNanoBanana = async (
  prompt: string,
  referenceImage: ReferenceImage | null
): Promise<string> => {
  try {
    const parts: Part[] = [];

    if (referenceImage) {
      parts.push({
        inlineData: {
          data: referenceImage.data,
          mimeType: referenceImage.mimeType,
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the first image part in the response
    for (const candidate of response.candidates) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("API 응답에 이미지가 포함되지 않았습니다.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
