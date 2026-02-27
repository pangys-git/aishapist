import { GoogleGenAI, Type } from "@google/genai";
import { EverythingFitnessResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const compressImage = async (base64Str: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (err) => reject(err);
  });
};

export const fitnessService = {
  analyzeEnvironment: async (imageSrc: string): Promise<EverythingFitnessResult> => {
    try {
      // Compress image to ensure it's well under Vercel's 4.5MB payload limit
      const compressedImageSrc = await compressImage(imageSrc);

      const ai = getAIClient();
      const base64Data = compressedImageSrc.split(',')[1];
      const mimeType = compressedImageSrc.split(',')[0].split(':')[1].split(';')[0];

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      const textPart = {
        text: `你是一位世界級的「多模態體能教練」與「環境安全辨識專家」。你擅長觀察使用者的生活或辦公環境，並將日常用品轉化為安全、有效的健身器材。
請分析使用者上傳的影像，找出 1 到 3 個適合用來運動的物品，並為每個物品建議一個鍛鍊特定肌肉群的動作。
Constraints:
1. 安全性第一：絕對禁止選擇易碎品（如玻璃、花瓶）、尖銳物（如刀剪）、過重/難以抓握的物品、或是不穩定的傢俱（如附輪子的辦公椅）。
2. 實用性：動作設計必須符合人體工學，避免造成關節損傷。
3. 清晰度：步驟說明必須簡潔易懂，適合無健身基礎的新手。
4. 語言：請以繁體中文（zh-TW）回覆。`,
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              environment_detected: {
                type: Type.STRING,
                description: "A brief description of the environment detected in the image.",
              },
              fitness_suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item_name: {
                      type: Type.STRING,
                      description: "The name of the item found in the environment.",
                    },
                    target_muscle: {
                      type: Type.STRING,
                      description: "The muscle group targeted by the exercise.",
                    },
                    exercise_name: {
                      type: Type.STRING,
                      description: "The name of the exercise.",
                    },
                    difficulty_level: {
                      type: Type.STRING,
                      description: "The difficulty level of the exercise (e.g., Beginner, Intermediate, Advanced).",
                    },
                    safety_warning: {
                      type: Type.STRING,
                      description: "Any safety warnings or precautions for using this item.",
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING,
                      },
                      description: "Step-by-step instructions for the exercise.",
                    },
                  },
                  required: ["item_name", "target_muscle", "exercise_name", "difficulty_level", "safety_warning", "instructions"],
                },
              },
            },
            required: ["environment_detected", "fitness_suggestions"],
          },
        },
      });

      let text = response.text;
      if (!text) {
        throw new Error("No response text from Gemini");
      }
      
      // Remove markdown code blocks if present
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

      const result: EverythingFitnessResult = JSON.parse(text);
      return result;
    } catch (error: any) {
      console.error("Error analyzing environment:", error);
      throw new Error(error.message || "Failed to analyze environment");
    }
  }
};
