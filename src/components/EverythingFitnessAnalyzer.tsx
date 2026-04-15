import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fitnessService } from '../services/fitnessService';
import { EverythingFitnessResult, AnalysisResult } from '../types';

interface EverythingFitnessAnalyzerProps {
  imageSrc: string;
  postureResult?: AnalysisResult | null;
  aiShapistContext?: string;
  onAnalysisComplete: (result: EverythingFitnessResult) => void;
  onCancel: () => void;
}

export const EverythingFitnessAnalyzer: React.FC<EverythingFitnessAnalyzerProps> = ({ 
  imageSrc, 
  postureResult,
  aiShapistContext,
  onAnalysisComplete,
  onCancel
}) => {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && !error) {
        setError("Analysis timed out. Please try again with a clearer photo.");
      }
    }, 45000); // 45 second timeout

    const analyze = async () => {
      console.log("EverythingFitnessAnalyzer: Starting analysis...");
      // Small delay to let UI animations finish and prevent initial lag
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const result = await fitnessService.analyzeEnvironment(imageSrc, postureResult, aiShapistContext);
        console.log("EverythingFitnessAnalyzer: Analysis complete");
        clearTimeout(timeoutId);
        if (isMounted) {
          // Use requestAnimationFrame to ensure state update doesn't block UI
          requestAnimationFrame(() => {
            onAnalysisComplete(result);
          });
        }
      } catch (error: any) {
        console.error("EverythingFitnessAnalyzer: Analysis failed:", error);
        clearTimeout(timeoutId);
        if (isMounted) {
          setError(error.message || "Failed to analyze environment");
        }
      }
    };

    analyze();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [imageSrc, onAnalysisComplete, onCancel, t]);

  if (error) {
    return (
      <div className="text-center p-8 space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">分析失敗</h3>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">{error}</p>
        </div>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> 重試
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6"
      >
        <Loader2 className="w-12 h-12 text-emerald-500" />
      </motion.div>
      <h3 className="text-2xl font-bold text-zinc-900 mb-2">{t.analyzingEnvironment}</h3>
      <p className="text-zinc-500">{t.initEngine}</p>
    </div>
  );
};
