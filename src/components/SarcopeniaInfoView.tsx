import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Info, Activity, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SarcopeniaInfoViewProps {
  onBack: () => void;
}

export const SarcopeniaInfoView: React.FC<SarcopeniaInfoViewProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const data = (t as any).sarcopeniaInfo;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            {data.title}
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">{data.title}</h2>
          <p className="text-zinc-500">{data.desc}</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors flex items-center text-zinc-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </button>
      </div>

      <div className="space-y-8">
        {/* Definition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mr-4">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">{data.sections.definition.title}</h3>
          </div>
          <p className="text-zinc-600 leading-relaxed text-lg">
            {data.sections.definition.content}
          </p>
        </motion.div>

        {/* Symptoms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mr-4">
              <Activity className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">{data.sections.symptoms.title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sections.symptoms.items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start p-4 bg-zinc-50 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 mr-3 shrink-0" />
                <p className="text-zinc-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Causes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">{data.sections.causes.title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sections.causes.items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 shrink-0" />
                <p className="text-amber-900 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-4">
              <Search className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">{data.sections.detection.title}</h3>
          </div>
          <p className="text-zinc-600 leading-relaxed text-lg">
            {data.sections.detection.content}
          </p>
        </motion.div>

        {/* Prevention */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-lg text-white"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{data.sections.prevention.title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sections.prevention.items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 shrink-0" />
                <p className="text-emerald-50 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
