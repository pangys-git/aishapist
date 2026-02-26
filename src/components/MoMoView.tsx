import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Activity, EyeOff, Target, Sparkles, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MoMoViewProps {
  onBack: () => void;
}

export const MoMoView: React.FC<MoMoViewProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [activeScenario, setActiveScenario] = useState(0);

  const momoData = (t as any).momo;
  const scenarios = momoData.scenarios;
  const currentScenario = scenarios[activeScenario];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">{momoData.title}</h2>
          <p className="text-zinc-500">{momoData.tagline}</p>
        </div>
        <button onClick={onBack} className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </button>
      </div>

      <div className="p-6 bg-emerald-50 rounded-3xl mb-8 border border-emerald-100">
        <p className="text-emerald-800 leading-relaxed">{momoData.desc}</p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 hide-scrollbar">
        {scenarios.map((s: any, idx: number) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(idx)}
            className={`whitespace-nowrap px-5 py-3 rounded-2xl font-bold transition-all ${
              activeScenario === idx 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">{currentScenario.name}</h3>
            <p className="text-zinc-500 mb-6">{currentScenario.desc}</p>
            
            <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white mb-8 shadow-lg">
              <div className="flex items-center mb-2">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-100" />
                <h4 className="font-bold">{momoData.combo}</h4>
              </div>
              <p className="text-emerald-50 font-medium">{currentScenario.combo}</p>
            </div>

            <div className="space-y-6">
              {currentScenario.exercises.map((ex: any, idx: number) => (
                <div key={idx} className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                    <h4 className="text-xl font-bold text-zinc-900 mb-4 md:mb-0">{ex.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                        <Target className="w-4 h-4 mr-1.5" />
                        {ex.target}
                      </div>
                      <div className="flex items-center px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-bold">
                        <EyeOff className="w-4 h-4 mr-1.5" />
                        {momoData.stealth}: {ex.stealth}/5
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Step-by-Step</h5>
                      <ol className="space-y-3">
                        {ex.steps.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                              {stepIdx + 1}
                            </span>
                            <span className="text-zinc-700 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 h-fit">
                      <h5 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center">
                        <Activity className="w-4 h-4 mr-1.5" />
                        {momoData.benefit}
                      </h5>
                      <p className="text-emerald-800 leading-relaxed">{ex.benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
