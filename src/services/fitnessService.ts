import { EverythingFitnessResult } from "../types";

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

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageSrc: compressedImageSrc }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result: EverythingFitnessResult = await response.json();
      return result;
    } catch (error) {
      console.error("Error analyzing environment:", error);
      throw error;
    }
  }
};
