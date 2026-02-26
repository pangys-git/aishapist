import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fitnessService } from '../services/fitnessService';
import { EverythingFitnessResult } from '../types';

interface EverythingFitnessAnalyzerProps {
  imageSrc: string;
  onAnalysisComplete: (result: EverythingFitnessResult) => void;
  onCancel: () => void;
}

export const EverythingFitnessAnalyzer: React.FC<EverythingFitnessAnalyzerProps> = ({ 
  imageSrc, 
  onAnalysisComplete,
  onCancel
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const analyze = async () => {
      try {
        const result = await fitnessService.analyzeEnvironment(imageSrc);
        if (isMounted) {
          onAnalysisComplete(result);
        }
      } catch (error) {
        console.error("Analysis failed:", error);
        if (isMounted) {
          alert(t.failAnalyze);
          onCancel();
        }
      }
    };

    analyze();

    return () => {
      isMounted = false;
    };
  }, [imageSrc, onAnalysisComplete, onCancel, t]);

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
