import { EverythingFitnessResult } from "../types";

export const fitnessService = {
  analyzeEnvironment: async (imageSrc: string): Promise<EverythingFitnessResult> => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageSrc }),
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
