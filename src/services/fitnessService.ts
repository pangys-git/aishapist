import { GoogleGenAI, Type } from "@google/genai";
import { EverythingFitnessResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const fitnessService = {
  analyzeEnvironment: async (imageSrc: string): Promise<EverythingFitnessResult> => {
    try {
      const base64Data = imageSrc.split(',')[1];
      const mimeType = imageSrc.split(',')[0].split(':')[1].split(';')[0];

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
                description: "簡述你看到的環境（例如：典型辦公室，有辦公桌與書櫃）",
              },
              fitness_suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item_name: {
                      type: Type.STRING,
                      description: "物品名稱（例如：掃帚）",
                    },
                    target_muscle: {
                      type: Type.STRING,
                      description: "目標肌肉群（例如：肩膀與核心）",
                    },
                    exercise_name: {
                      type: Type.STRING,
                      description: "運動名稱（例如：掃帚肩推）",
                    },
                    difficulty_level: {
                      type: Type.STRING,
                      description: "難度（低/中/高）",
                    },
                    safety_warning: {
                      type: Type.STRING,
                      description: "該物品的安全注意事項（例如：請確保周圍空間足夠，避免打到燈具）",
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING,
                      },
                      description: "步驟說明",
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

      const text = response.text;
      if (!text) {
        throw new Error("No response text from Gemini");
      }

      const result: EverythingFitnessResult = JSON.parse(text);
      return result;
    } catch (error) {
      console.error("Error analyzing environment:", error);
      throw error;
    }
  }
};
