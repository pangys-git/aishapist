import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Trash2, Activity, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { storageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface HistoryViewProps {
  onSelect: (result: AnalysisResult) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelect, onBack }) => {
  const { t } = useLanguage();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await storageService.getResults();
    setResults(data);
    setLoading(false);
  };

  const deleteResult = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t.deleteConfirm)) {
      const success = await storageService.deleteResult(id);
      if (success) {
        setResults(results.filter(r => r.id !== id));
      }
    }
  };

  const chartData = [...results].reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString(),
    score: r.score
  }));

  const getViewLabel = (v: string) => {
    switch(v) {
      case 'Front': return t.front;
      case 'Side': return t.side;
      case 'Back': return t.backView;
      case 'Combined': return (t as any).combined || 'Combined';
      default: return v;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">{t.analysisHistory}</h2>
          <p className="text-zinc-500">{t.trackProgress}</p>
        </div>
        <button onClick={onBack} className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors">
          {t.back}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mb-12 p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-zinc-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" /> {t.scoreTrend}
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
          <Activity className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">{t.noRecords}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelect(result)}
              className="group flex items-center p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-16 h-20 rounded-xl bg-zinc-100 overflow-hidden mr-6">
                <img src={result.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-zinc-900">{getViewLabel(result.view)}</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {new Date(result.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${result.score > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                  <span className="text-lg font-bold text-zinc-900">{t.overallScore}: {result.score}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={(e) => deleteResult(result.id, e)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
