import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ClipboardCheck, Timer, ChevronRight, AlertCircle, CheckCircle2, Play, Square, RefreshCw, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SarcopeniaScreeningResult } from '../types';

interface SarcopeniaScreeningViewProps {
  onBack: () => void;
  onComplete: (result: SarcopeniaScreeningResult) => void;
}

export const SarcopeniaScreeningView: React.FC<SarcopeniaScreeningViewProps> = ({ onBack, onComplete }) => {
  const { t } = useLanguage();
  const data = (t as any).sarcopeniaScreening;
  
  const [activeTab, setActiveTab] = useState<'SARCF' | 'CHAIR_STAND'>('SARCF');
  
  // SARC-F State
  const [sarcfAnswers, setSarcfAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [showSarcfResult, setShowSarcfResult] = useState(false);
  
  // Chair Stand State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleComplete = () => {
    onComplete({
      sarcfScore: sarcfTotalScore,
      sarcfAnswers: sarcfAnswers,
      chairStandTime: finalTime,
      date: new Date().toISOString()
    });
  };

  const handleSarcfAnswer = (index: number, score: number) => {
    const newAnswers = [...sarcfAnswers];
    newAnswers[index] = score;
    setSarcfAnswers(newAnswers);
  };

  const sarcfTotalScore = sarcfAnswers.reduce((acc, curr) => acc + (curr === -1 ? 0 : curr), 0);
  const isSarcfComplete = sarcfAnswers.every(a => a !== -1);

  const startTimer = () => {
    setIsTimerRunning(true);
    setStartTime(Date.now());
    setFinalTime(null);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (startTime) {
      const duration = (Date.now() - startTime) / 1000;
      setFinalTime(duration);
      setIsTimerRunning(false);
      setStartTime(null);
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        if (startTime) {
          setElapsedTime((Date.now() - startTime) / 1000);
        }
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, startTime]);

  const getChairStandInterpretation = (time: number) => {
    if (time < 10) return data.chairStand.interpretation.excellent;
    if (time < 15) return data.chairStand.interpretation.normal;
    return data.chairStand.interpretation.slow;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            {data.tagline}
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">{data.title}</h2>
          <p className="text-zinc-500">{data.desc}</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors flex items-center text-zinc-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-100 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab('SARCF')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
            activeTab === 'SARCF' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <ClipboardCheck className="w-5 h-5 mr-2" /> {data.sarcf.title}
        </button>
        <button
          onClick={() => setActiveTab('CHAIR_STAND')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
            activeTab === 'CHAIR_STAND' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <Timer className="w-5 h-5 mr-2" /> {data.chairStand.title}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'SARCF' ? (
          <motion.div
            key="sarcf"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">{data.sarcf.title}</h3>
              <p className="text-zinc-500 mb-8">{data.sarcf.desc}</p>

              <div className="space-y-8">
                {data.sarcf.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="space-y-4">
                    <p className="font-bold text-zinc-800 text-lg">{qIdx + 1}. {q.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {q.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSarcfAnswer(qIdx, optIdx)}
                          className={`p-4 rounded-2xl text-sm font-medium transition-all border-2 ${
                            sarcfAnswers[qIdx] === optIdx
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-zinc-50 border-transparent text-zinc-600 hover:bg-zinc-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-100">
                {!showSarcfResult ? (
                  <button
                    disabled={!isSarcfComplete}
                    onClick={() => setShowSarcfResult(true)}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center ${
                      isSarcfComplete 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    查看評估結果 <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl flex items-start space-x-4 ${
                      sarcfTotalScore >= 4 ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${sarcfTotalScore >= 4 ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                      {sarcfTotalScore >= 4 ? (
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider mb-1 opacity-60">
                        {data.sarcf.result}: <span className="text-lg">{sarcfTotalScore} / 10</span>
                      </div>
                      <p className={`text-lg font-bold ${sarcfTotalScore >= 4 ? 'text-amber-900' : 'text-emerald-900'}`}>
                        {sarcfTotalScore >= 4 ? data.sarcf.interpretation.high : data.sarcf.interpretation.low}
                      </p>
                      <button 
                        onClick={() => {
                          setSarcfAnswers(new Array(5).fill(-1));
                          setShowSarcfResult(false);
                        }}
                        className="mt-4 text-sm font-bold underline opacity-60 hover:opacity-100 transition-opacity"
                      >
                        重新測試
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {isSarcfComplete && (
                  <div className="mt-8">
                    <button
                      onClick={handleComplete}
                      className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-zinc-800 transition-all"
                    >
                      <Save className="w-5 h-5 mr-2" /> 儲存並結合體態分析
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chair-stand"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">{data.chairStand.title}</h3>
              <p className="text-zinc-500 mb-8">{data.chairStand.desc}</p>

              <div className="bg-zinc-900 rounded-3xl p-12 text-center mb-8 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">
                    {isTimerRunning ? '測試進行中...' : finalTime ? '測試結果' : '準備就緒'}
                  </div>
                  <div className="text-7xl font-black text-white mb-2 tabular-nums">
                    {(finalTime || elapsedTime).toFixed(2)}
                    <span className="text-2xl ml-2 opacity-50">{data.chairStand.seconds}</span>
                  </div>
                </div>
                {/* Visual pulse when running */}
                {isTimerRunning && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
                  />
                )}
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                <p className="text-blue-900 font-medium leading-relaxed">
                  <strong>測試說明：</strong> {data.chairStand.instructions}
                </p>
              </div>

              <div className="flex space-x-4">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <Play className="w-5 h-5 mr-2" /> {data.chairStand.start}
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-rose-500/30"
                  >
                    <Square className="w-5 h-5 mr-2" /> {data.chairStand.stop}
                  </button>
                )}
                {finalTime && !isTimerRunning && (
                  <button
                    onClick={() => setFinalTime(null)}
                    className="p-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-2xl transition-all"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                )}
              </div>

              {finalTime && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-start space-x-4"
                  >
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider mb-1 opacity-60">評估結果</div>
                      <p className="text-lg font-bold text-emerald-900">
                        {getChairStandInterpretation(finalTime)}
                      </p>
                    </div>
                  </motion.div>

                  <button
                    onClick={handleComplete}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-zinc-800 transition-all"
                  >
                    <Save className="w-5 h-5 mr-2" /> 儲存並結合體態分析
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
