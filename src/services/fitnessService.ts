import { GoogleGenAI, Type } from "@google/genai";
import { EverythingFitnessResult, AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const compressImage = async (base64Str: string, maxWidth = 600, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Image compression timed out")), 10000);
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      clearTimeout(timeout);
      // Use a small delay to avoid blocking the main thread immediately
      setTimeout(() => {
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
      }, 0);
    };
    img.onerror = (err) => {
      clearTimeout(timeout);
      reject(err);
    };
  });
};

export const fitnessService = {
  analyzeEnvironment: async (imageSrc: string, postureResult?: AnalysisResult | null, aiShapistContext?: string): Promise<EverythingFitnessResult> => {
    console.log("fitnessService: Starting environment analysis...");
    try {
      // Compress image to ensure it's well under Vercel's 4.5MB payload limit
      const compressedImageSrc = await compressImage(imageSrc);
      console.log("fitnessService: Image compressed");

      const ai = getAIClient();
      const base64Data = compressedImageSrc.split(',')[1];
      const mimeType = compressedImageSrc.split(',')[0].split(':')[1].split(';')[0];

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      let contextPrompt = "";
      if (postureResult) {
        const issues = postureResult.metrics
          .filter(m => m.severity !== 'Normal')
          .map(m => `${m.name} (${m.severity})`)
          .join(', ');
        
        if (issues) {
          contextPrompt += `\n\n使用者目前的體態檢測結果顯示有以下問題：${issues}。`;
        }
      }

      if (aiShapistContext) {
        contextPrompt += `\n\n「AI 形養師」模組提供的專業建議如下：\n${aiShapistContext}\n請優先參考這些建議，並結合影像中的物品來設計動作。`;
      }

      if (contextPrompt) {
        contextPrompt += `\n請優先挑選能改善上述問題或符合上述建議的家居運動，並利用影像中的物品來進行。例如：如果有圓肩問題，請尋找能進行擴胸或背部訓練的物品。`;
      }

      const textPart = {
        text: `你是一位世界級的「長者體能教練」與「家居環境安全專家」。你擅長觀察長者的生活環境，並將日常用品轉化為安全、有效的預防肌肉流失（肌少症）健身器材。
請分析使用者上傳的影像，找出 1 到 3 個適合長者用來運動的物品，並為每個物品建議一個鍛鍊特定肌肉群（特別是下肢與核心）的動作。${contextPrompt}
Constraints:
1. 安全性第一：絕對禁止選擇易碎品（如玻璃、花瓶）、尖銳物（如刀剪）、過重/難以抓握的物品、或是不穩定的傢俱（如附輪子的辦公椅）。
2. 長者友善：動作設計必須溫和且符合長者生理特點，避免過度負重或劇烈跳躍，重點在於維持肌肉量與關節活動度。
3. 實用性：動作設計必須符合人體工學，避免造成關節損傷。
4. 清晰度：步驟說明必須簡潔易懂，適合無健身基礎的長者。
5. 語言：請以繁體中文（zh-TW）回覆。`,
      };

      console.log("fitnessService: Sending to Gemini...");
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
      console.log("fitnessService: Received response from Gemini");
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

