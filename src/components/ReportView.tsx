import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Share2, Download, ChevronRight, Activity, Info, Copy, Check, Search } from 'lucide-react';
import { AnalysisResult, PostureMetric } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ReportViewProps {
  result: AnalysisResult;
  onClose: () => void;
  onSave: () => void;
  onConsultAIShapist?: (initialMessage: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ result, onClose, onSave, onConsultAIShapist }) => {
  const { t, language } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Determine available views
  const availableViews = result.images ? Object.keys(result.images).filter(k => result.images![k as keyof typeof result.images]) : [result.view];
  const [selectedView, setSelectedView] = useState<string>(availableViews[0] || result.view);

  const currentImageUrl = result.images ? result.images[selectedView as keyof typeof result.images] : result.imageUrl;
  const currentLandmarks = result.allLandmarks ? result.allLandmarks[selectedView as keyof typeof result.allLandmarks] : result.landmarks;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Normal': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Mild': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Moderate': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'Severe': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-zinc-500 bg-zinc-50 border-zinc-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Normal': return <CheckCircle2 className="w-5 h-5" />;
      case 'Mild': return <Info className="w-5 h-5" />;
      case 'Moderate': return <AlertTriangle className="w-5 h-5" />;
      case 'Severe': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
          {t.backToHome}
        </button>
        <div className="flex space-x-3">
          <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <Share2 className="w-5 h-5 text-zinc-500" />
          </button>
          <button onClick={onSave} className="flex items-center px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
            <Download className="w-4 h-4 mr-2" /> {t.saveReport}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Score */}
        <div className="lg:col-span-5 space-y-6">
          {availableViews.length > 1 && (
            <div className="flex bg-zinc-100 p-1 rounded-xl mb-4">
              {availableViews.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedView(v)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedView === v ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                  }`}
                >
                  {(t as any)[v.toLowerCase() === 'back' ? 'backView' : v.toLowerCase()] || v}
                </button>
              ))}
            </div>
          )}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-100 aspect-[3/4] shadow-2xl shadow-zinc-200">
            <img src={currentImageUrl} alt="Analysis" className="w-full h-full object-cover" />
            {/* Simple Skeleton Overlay (SVG) */}
            <svg viewBox="0 0 1 1" className="absolute inset-0 w-full h-full pointer-events-none">
              {currentLandmarks?.map((l, i) => (
                <circle key={i} cx={l.x} cy={l.y} r="0.01" fill="#10b981" />
              ))}
            </svg>
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.overallScore}</span>
                <span className={`text-2xl font-black ${result.score > 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {result.score}/100
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  className={`h-full ${result.score > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                />
              </div>
            </div>
          </div>

          {result.potentialConditions && result.potentialConditions.length > 0 && (
            <div className="p-6 rounded-3xl bg-red-50 border border-red-100">
              <h4 className="font-bold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> {(t as any).potentialConditions || 'Potential Conditions'}
              </h4>
              <ul className="space-y-2">
                {result.potentialConditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start text-sm text-red-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2 flex-shrink-0" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
            <h4 className="font-bold text-zinc-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-500" /> {t.analysisSummary}
            </h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {t.analysisSummary} - {(t as any)[result.view.toLowerCase() === 'back' ? 'backView' : result.view.toLowerCase()] || result.view} {t.viewLabel}: {result.score}/100.
              <br />
              {result.score > 80 ? t.excellentAlignment : t.needsImprovement}
            </p>
          </div>
        </div>

        {/* Right Column: Metrics & Recommendations */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-6">{t.detailedMetrics}</h3>
            <div className="space-y-4">
              {result.metrics.map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h5 className="font-bold text-zinc-900">{metric.name}</h5>
                      <p className="text-sm text-zinc-500">{metric.description}</p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold ${getSeverityColor(metric.severity)}`}>
                      {getSeverityIcon(metric.severity)}
                      <span className="ml-1">{(t.severityLabels as any)[metric.severity] || metric.severity}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-black text-zinc-900">
                      {metric.value}<span className="text-sm font-bold text-zinc-400 ml-1">{metric.unit}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">{t.recommendation}</p>
                      <p className="text-sm font-medium text-zinc-700 mb-3">{metric.recommendation}</p>
                      
                      {metric.searchKeywords && (
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-400 uppercase">
                            <Search className="w-3 h-3" />
                            <span>{t.searchKeywordsLabel}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="px-2 py-1 bg-zinc-100 rounded text-xs font-mono text-zinc-600">
                              {metric.searchKeywords}
                            </code>
                            <button 
                              onClick={() => handleCopy(metric.searchKeywords!, i)}
                              className="p-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                              title={t.copyKeywords}
                            >
                              {copiedIndex === i ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {copiedIndex === i && (
                            <span className="text-[10px] font-bold text-emerald-500 animate-pulse">
                              {t.keywordsCopied}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {metric.cues && metric.cues.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-50">
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t.movementCues}</p>
                      <ul className="space-y-1.5">
                        {metric.cues.map((cue, idx) => (
                          <li key={idx} className="flex items-start text-xs text-zinc-600">
                            <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0" />
                            {cue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-emerald-500 text-white">
            <h3 className="text-xl font-bold mb-2">{t.actionPlan}</h3>
            <p className="text-emerald-100 mb-6">{t.actionPlanDesc}</p>
            <div className="space-y-3">
              {result.actionPlan && result.actionPlan.length > 0 ? (
                result.actionPlan.map((plan, idx) => (
                  <div key={idx} className="flex flex-col p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mr-4">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-bold">{plan.name}</h6>
                        <p className="text-xs text-emerald-100">{plan.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-50 mt-2 pl-14">{plan.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-emerald-100">{t.excellentAlignment}</p>
                </div>
              )}
            </div>
            {result.actionPlan && result.actionPlan.length > 0 && (
              <button 
                onClick={() => {
                  if (onConsultAIShapist) {
                    const message = `你好，我剛完成了體態分析，我的綜合評分是 ${result.score}/100。我的主要問題是：\n${result.metrics.filter(m => m.severity !== 'Normal').map(m => `- ${m.name}: ${m.severity}`).join('\n')}\n請問你有什麼運動或飲食建議可以幫助我改善？`;
                    onConsultAIShapist(message);
                  }
                }}
                className="w-full mt-6 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-colors"
              >
                {t.startRoutine}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
