/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home } from './components/Home';
import { CameraView } from './components/CameraView';
import { PoseAnalyzer } from './components/PoseAnalyzer';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { EverythingFitnessCamera } from './components/EverythingFitnessCamera';
import { EverythingFitnessAnalyzer } from './components/EverythingFitnessAnalyzer';
import { EverythingFitnessReport } from './components/EverythingFitnessReport';
import { MoMoView } from './components/MoMoView';
import { MuscleMasterView } from './components/MuscleMasterView';
import { AIShapistChat } from './components/AIShapistChat';
import { AnalysisResult, EverythingFitnessResult, UserInfo } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Languages } from 'lucide-react';

import { storageService } from './services/storage';
import { useLanguage } from './context/LanguageContext';

type AppState = 'HOME' | 'CAPTURE' | 'ANALYZING' | 'REPORT' | 'HISTORY' | 'EVERYTHING_FITNESS_CAPTURE' | 'EVERYTHING_FITNESS_ANALYZING' | 'EVERYTHING_FITNESS_REPORT' | 'MOMO' | 'MUSCLE_MASTER' | 'AI_SHAPIST_CHAT';

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  const [state, setState] = useState<AppState>('HOME');
  const [currentImages, setCurrentImages] = useState<{ Front?: string; Side?: string; Back?: string } | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [everythingFitnessResult, setEverythingFitnessResult] = useState<EverythingFitnessResult | null>(null);
  const [initialChatMessage, setInitialChatMessage] = useState<string>('');

  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | undefined>(undefined);

  const handleAnalyze = (images: { Front?: string; Side?: string; Back?: string }, userInfo?: UserInfo) => {
    setCurrentImages(images);
    setCurrentUserInfo(userInfo);
    setState('ANALYZING');
  };

  const handleEverythingFitnessCapture = (imageSrc: string) => {
    setCurrentImages({ Front: imageSrc }); // Reuse state for simplicity, though not strictly needed
    setState('EVERYTHING_FITNESS_ANALYZING');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setState('REPORT');
  };

  const handleEverythingFitnessAnalysisComplete = (result: EverythingFitnessResult) => {
    setEverythingFitnessResult(result);
    setState('EVERYTHING_FITNESS_REPORT');
  };

  const saveResult = async () => {
    if (!currentResult) return;
    const success = await storageService.saveResult(currentResult);
    if (success) {
      alert(t.reportSaved);
    } else {
      alert(t.reportSaveFailed);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Header with Language Toggle */}
      <header className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center border-b border-zinc-50">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setState('HOME')}
        >
          <span className="font-bold text-zinc-900">{t.appName}</span>
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors text-xs font-bold"
        >
          <Languages className="w-4 h-4" />
          <span>{language === 'en' ? '繁體中文' : 'English'}</span>
        </button>
      </header>

      <AnimatePresence mode="wait">
        {state === 'HOME' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Home 
              onStart={() => setState('CAPTURE')} 
              onViewHistory={() => setState('HISTORY')} 
              onEverythingFitness={() => setState('EVERYTHING_FITNESS_CAPTURE')}
              onMoMo={() => setState('MOMO')}
              onMuscleMaster={() => setState('MUSCLE_MASTER')}
              onAIShapistChat={() => setState('AI_SHAPIST_CHAT')}
            />
          </motion.div>
        )}

        {state === 'CAPTURE' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CameraView 
              onAnalyze={handleAnalyze} 
              onCancel={() => setState('HOME')} 
            />
          </motion.div>
        )}

        {state === 'EVERYTHING_FITNESS_CAPTURE' && (
          <motion.div
            key="everything-fitness-capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EverythingFitnessCamera 
              onCapture={handleEverythingFitnessCapture} 
              onCancel={() => setState('HOME')} 
            />
          </motion.div>
        )}

        {state === 'ANALYZING' && currentImages && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <PoseAnalyzer 
              images={currentImages} 
              userInfo={currentUserInfo}
              onAnalysisComplete={handleAnalysisComplete} 
            />
          </motion.div>
        )}

        {state === 'EVERYTHING_FITNESS_ANALYZING' && currentImages?.Front && (
          <motion.div
            key="everything-fitness-analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <EverythingFitnessAnalyzer 
              imageSrc={currentImages.Front} 
              onAnalysisComplete={handleEverythingFitnessAnalysisComplete} 
              onCancel={() => setState('HOME')}
            />
          </motion.div>
        )}

        {state === 'REPORT' && currentResult && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ReportView 
              result={currentResult} 
              onClose={() => setState('HOME')} 
              onSave={saveResult}
              onConsultAIShapist={(msg) => {
                setInitialChatMessage(msg);
                setState('AI_SHAPIST_CHAT');
              }}
            />
          </motion.div>
        )}

        {state === 'EVERYTHING_FITNESS_REPORT' && everythingFitnessResult && (
          <motion.div
            key="everything-fitness-report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <EverythingFitnessReport 
              result={everythingFitnessResult} 
              onClose={() => setState('HOME')} 
            />
          </motion.div>
        )}

        {state === 'HISTORY' && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HistoryView 
              onSelect={(result) => {
                setCurrentResult(result);
                setState('REPORT');
              }}
              onBack={() => setState('HOME')}
            />
          </motion.div>
        )}

        {state === 'MOMO' && (
          <motion.div
            key="momo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MoMoView onBack={() => setState('HOME')} />
          </motion.div>
        )}

        {state === 'MUSCLE_MASTER' && (
          <motion.div
            key="muscle_master"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MuscleMasterView onBack={() => setState('HOME')} />
          </motion.div>
        )}

        {state === 'AI_SHAPIST_CHAT' && (
          <motion.div
            key="ai_shapist_chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AIShapistChat 
              onBack={() => {
                setState('HOME');
                setInitialChatMessage('');
              }} 
              initialMessage={initialChatMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-zinc-100">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-900">{t.appName}</span>
          </div>
          <p className="text-sm text-zinc-400">
            {t.educational}
          </p>
          <div className="flex space-x-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">{t.privacy}</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">{t.terms}</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">{t.support}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
