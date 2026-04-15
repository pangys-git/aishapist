import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, X, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EverythingFitnessCameraProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export const EverythingFitnessCamera: React.FC<EverythingFitnessCameraProps> = ({ onCapture, onCancel }) => {
  const { t } = useLanguage();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      console.log("EverythingFitnessCamera: Requesting camera with constraints:", { facingMode });
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的瀏覽器不支援相機功能。請更換瀏覽器。');
      }

      let mediaStream: MediaStream;
      try {
        // Try with ideal constraints first
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: facingMode }, 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        });
      } catch (e) {
        console.warn("EverythingFitnessCamera: Ideal constraints failed, falling back to basic video:", e);
        // Fallback to basic video
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("EverythingFitnessCamera: Camera access error:", err);
      let msg = '無法存取相機。請檢查權限設定。';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        msg = '相機權限被拒絕。請在瀏覽器網址列左側允許相機權限，然後點擊「重試」。';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = '找不到相機設備。請確保相機已連接。';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
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
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <button onClick={() => { stopCamera(); onCancel(); }} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-zinc-500" />
        </button>
        <div className="font-bold text-zinc-900">{t.everythingFitness}</div>
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
          </>
        ) : (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.captureReady}</h3>
            <p className="text-zinc-500 mb-6 max-w-xs mx-auto">
              {t.everythingFitnessDesc}
            </p>

            <div className="bg-zinc-800/50 p-4 rounded-2xl mb-8 text-left max-w-xs mx-auto">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">電腦版提示：</h4>
              <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-4">
                <li>請確保電腦已連接網路攝影機。</li>
                <li>若無法開啟，請檢查網址列左側是否已允許相機權限。</li>
                <li>建議使用 Chrome 或 Edge 瀏覽器。</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button 
                onClick={startCamera}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" /> {t.openCamera}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-colors flex items-center justify-center"
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
          <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg z-30">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
            <button 
              onClick={startCamera}
              className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
            >
              重試
            </button>
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
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-blue-50">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-sm">{t.proTip}</h4>
            <p className="text-xs text-zinc-500">
              {t.everythingFitnessDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
