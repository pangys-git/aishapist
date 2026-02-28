import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, X, Check, Info, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserInfo } from '../types';

interface CameraViewProps {
  onAnalyze: (images: { Front?: string; Side?: string; Back?: string }, userInfo?: UserInfo) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onAnalyze, onCancel }) => {
  const { t } = useLanguage();
  const [view, setView] = useState<'Front' | 'Side' | 'Back'>('Front');
  const [capturedImages, setCapturedImages] = useState<{ Front?: string; Side?: string; Back?: string }>({});
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (stream) {
      startCamera();
    }
  }, [facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImages(prev => ({ ...prev, [view]: dataUrl }));
        // Move to next view if available
        if (view === 'Front' && !capturedImages.Side) setView('Side');
        else if (view === 'Side' && !capturedImages.Back) setView('Back');
        else stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImages(prev => ({ ...prev, [view]: event.target!.result as string }));
          // Move to next view if available
          if (view === 'Front' && !capturedImages.Side) setView('Side');
          else if (view === 'Side' && !capturedImages.Back) setView('Back');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    const count = Object.keys(capturedImages).length;
    if (count === 0) return;
    if (count < 3) {
      alert(t.provideAllPhotosWarning);
    }
    setShowUserInfoForm(true);
  };

  const submitAnalysis = () => {
    onAnalyze(capturedImages, userInfo);
  };

  const getViewLabel = (v: string) => {
    switch(v) {
      case 'Front': return t.front;
      case 'Side': return t.side;
      case 'Back': return t.backView;
      default: return v;
    }
  };

  if (showUserInfoForm) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <button onClick={() => setShowUserInfoForm(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-zinc-500" />
          </button>
          <h2 className="text-lg font-bold text-zinc-900">基本資料 (選填)</h2>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-zinc-500 mb-8">提供以下資料，我們將為您計算 BMI 與腰臀比，讓分析更全面。</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">身高 (cm)</label>
              <input 
                type="number" 
                value={userInfo.height || ''} 
                onChange={e => setUserInfo({...userInfo, height: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="例如: 170"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">體重 (kg)</label>
              <input 
                type="number" 
                value={userInfo.weight || ''} 
                onChange={e => setUserInfo({...userInfo, weight: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="例如: 65"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">腰圍 (cm)</label>
              <input 
                type="number" 
                value={userInfo.waist || ''} 
                onChange={e => setUserInfo({...userInfo, waist: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="例如: 80"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">臀圍 (cm)</label>
              <input 
                type="number" 
                value={userInfo.hip || ''} 
                onChange={e => setUserInfo({...userInfo, hip: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="例如: 95"
              />
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-zinc-100">
          <button 
            onClick={submitAnalysis}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
          >
            開始分析 <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <button onClick={() => { stopCamera(); onCancel(); }} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-zinc-500" />
        </button>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          {(['Front', 'Side', 'Back'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-1 ${
                view === v ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
              }`}
            >
              <span>{getViewLabel(v)}</span>
              {capturedImages[v] && <Check className="w-3 h-3 text-emerald-500" />}
            </button>
          ))}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative bg-zinc-900 overflow-hidden flex items-center justify-center">
        {stream ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-cover"
            />
            {/* Overlay Guidelines */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-2 border-white/30 border-dashed rounded-[40px] w-[60%] h-[80%] flex flex-col items-center py-12">
                <div className="w-24 h-24 border-2 border-white/50 rounded-full mb-auto" /> {/* Head */}
                <div className="w-full h-1 bg-white/20" /> {/* Shoulders */}
                <div className="mt-auto mb-12 w-full h-1 bg-white/20" /> {/* Hips */}
              </div>
            </div>
          </>
        ) : capturedImages[view] ? (
          <div className="relative w-full h-full">
            <img src={capturedImages[view]} alt={view} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-4">
              <button 
                onClick={startCamera}
                className="px-6 py-3 bg-white text-zinc-900 rounded-xl font-bold flex items-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" /> Retake {getViewLabel(view)}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.captureReady}</h3>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
              {t.captureDesc}
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={startCamera}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" /> {t.openCamera}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" /> {t.uploadPhoto}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-2xl flex items-center shadow-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {stream && (
        <div className="p-8 bg-zinc-900 flex items-center justify-center space-x-12">
          <button 
            onClick={toggleCamera}
            className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-white"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full border-4 border-zinc-900" />
          </button>
          <button 
            onClick={stopCamera}
            className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="p-6 bg-white border-t border-zinc-100">
        <div className="flex items-start space-x-4 mb-4">
          <div className="p-2 rounded-lg bg-blue-50">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-sm">{t.proTip}</h4>
            <p className="text-xs text-zinc-500">
              {t.proTipDesc(getViewLabel(view))}
            </p>
          </div>
        </div>
        {Object.keys(capturedImages).length > 0 && (
          <button 
            onClick={handleAnalyze}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
          >
            {t.analyzePhotos} ({Object.keys(capturedImages).length}/3)
          </button>
        )}
      </div>
    </div>
  );
};
