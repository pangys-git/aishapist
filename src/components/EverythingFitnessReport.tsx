import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Activity, Info, AlertTriangle, CheckCircle2, Dumbbell } from 'lucide-react';
import { EverythingFitnessResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EverythingFitnessReportProps {
  result: EverythingFitnessResult;
  onClose: () => void;
}

export const EverythingFitnessReport: React.FC<EverythingFitnessReportProps> = ({ result, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
            {t.backToHome}
          </button>
          <div className="font-bold text-zinc-900">{t.everythingFitness}</div>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Environment Detected */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">{t.environmentDetected}</h2>
          </div>
          <p className="text-lg text-zinc-700 leading-relaxed">
            {result.environment_detected}
          </p>
        </motion.div>

        {/* Fitness Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center">
            <Dumbbell className="w-6 h-6 mr-2 text-emerald-500" />
            {t.fitnessSuggestions}
          </h2>

          <div className="space-y-6">
            {result.fitness_suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {suggestion.exercise_name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {suggestion.item_name}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                        <Activity className="w-4 h-4 mr-1" />
                        {t.targetMuscle}: {suggestion.target_muscle}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                        {t.difficulty}: {suggestion.difficulty_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">{t.safetyWarning}</h4>
                    <p className="text-amber-800 text-sm">{suggestion.safety_warning}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 mb-4">{t.instructions}</h4>
                  <ul className="space-y-3">
                    {suggestion.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-zinc-700 leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
