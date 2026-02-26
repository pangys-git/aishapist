import React from 'react';
import { motion } from 'motion/react';
import { Camera, History, ShieldCheck, Activity, ChevronRight, Dumbbell, Sparkles, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  onStart: () => void;
  onViewHistory: () => void;
  onEverythingFitness: () => void;
  onMoMo: () => void;
  onMuscleMaster: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onViewHistory, onEverythingFitness, onMoMo, onMuscleMaster }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-6">
          {t.tagline}
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
          {t.appName}
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          {t.description}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative overflow-hidden p-8 rounded-3xl bg-zinc-900 text-white text-left transition-all"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.newAnalysis}</h3>
            <p className="text-zinc-400 mb-6">{t.newAnalysisDesc}</p>
            <div className="flex items-center text-emerald-500 font-semibold">
              {t.getStarted} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMoMo}
          className="group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-left transition-all"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{(t as any).momo.title}</h3>
            <p className="text-emerald-100 mb-6 line-clamp-2">{(t as any).momo.desc}</p>
            <div className="flex items-center text-white font-semibold">
              {t.getStarted} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEverythingFitness}
          className="group relative overflow-hidden p-8 rounded-3xl bg-emerald-600 text-white text-left transition-all"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.everythingFitness}</h3>
            <p className="text-emerald-100 mb-6">{t.everythingFitnessDesc}</p>
            <div className="flex items-center text-white font-semibold">
              {t.getStarted} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMuscleMaster}
          className="group relative overflow-hidden p-8 rounded-3xl bg-rose-600 text-white text-left transition-all"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{(t as any).muscleMaster.title}</h3>
            <p className="text-rose-100 mb-6 line-clamp-2">{(t as any).muscleMaster.desc}</p>
            <div className="flex items-center text-white font-semibold">
              {t.getStarted} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewHistory}
          className="group p-8 rounded-3xl bg-white border border-zinc-200 text-left transition-all hover:border-zinc-300 md:col-span-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-6">
            <History className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">{t.history}</h3>
          <p className="text-zinc-500 mb-6">{t.historyDesc}</p>
          <div className="flex items-center text-zinc-900 font-semibold">
            {t.viewRecords} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-zinc-100">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-emerald-50">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-1">{t.privacyFirst}</h4>
            <p className="text-sm text-zinc-500">{t.privacyFirstDesc}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-blue-50">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-1">{t.medicalGrade}</h4>
            <p className="text-sm text-zinc-500">{t.medicalGradeDesc}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-purple-50">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-1">{t.smartGuidance}</h4>
            <p className="text-sm text-zinc-500">{t.smartGuidanceDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
