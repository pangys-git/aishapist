import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { AnalysisResult, Landmark, Exercise, PostureMetric } from '../types';
import { analyzePosture } from '../utils/poseUtils';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

interface PoseAnalyzerProps {
  images: { Front?: string; Side?: string; Back?: string };
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const PoseAnalyzer: React.FC<PoseAnalyzerProps> = ({ images, onAnalysisComplete }) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/pose_landmarker/pose_landmarker_full.task`,
            delegate: "GPU"
          },
          runningMode: "IMAGE",
          numPoses: 1,
          // Lower thresholds as requested
          minPoseDetectionConfidence: 0.3,
          minPosePresenceConfidence: 0.3,
          minTrackingConfidence: 0.3
        });

        if (!isMounted) return;

        const allMetrics: PostureMetric[] = [];
        const allLandmarks: { Front?: Landmark[]; Side?: Landmark[]; Back?: Landmark[] } = {};
        let firstImageSrc = '';
        let firstLandmarks: Landmark[] = [];
        let firstView: 'Front' | 'Side' | 'Back' | 'Combined' = 'Combined';

        const viewsToProcess = (['Front', 'Side', 'Back'] as const).filter(v => images[v]);

        for (const v of viewsToProcess) {
          const imgUrl = images[v]!;
          
          // Load image and handle rotation/resizing
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          
          // Use createImageBitmap to handle EXIF orientation automatically
          const imageBitmap = await createImageBitmap(blob, { 
            imageOrientation: 'from-image' 
          });

          if (!landmarkerRef.current || !isMounted) return;

          // Resize image to avoid OOM and improve performance
          const MAX_DIM = 1024; // Slightly smaller for better mobile performance
          let width = imageBitmap.width;
          let height = imageBitmap.height;
          
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = (height / width) * MAX_DIM;
              width = MAX_DIM;
            } else {
              width = (width / height) * MAX_DIM;
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Could not get canvas context");
          
          // Draw resized and oriented image to canvas
          ctx.drawImage(imageBitmap, 0, 0, width, height);
          
          // Call detect() synchronously as requested
          const result = landmarkerRef.current.detect(canvas);

          if (result.landmarks && result.landmarks.length > 0 && isMounted) {
            // MediaPipe landmarks are already normalized 0-1
            const landmarks: Landmark[] = result.landmarks[0].map(l => ({
              x: l.x,
              y: l.y,
              z: l.z,
              visibility: l.visibility || 0.5 // MediaPipe visibility
            }));

            allLandmarks[v] = landmarks;
            
            if (!firstImageSrc) {
              firstImageSrc = imgUrl;
              firstLandmarks = landmarks;
              firstView = viewsToProcess.length === 1 ? v : 'Combined';
            }

            const metrics = analyzePosture(landmarks, v, language);
            allMetrics.push(...metrics);
          }
        }

        if (allMetrics.length > 0 && isMounted) {
          const score = Math.max(0, 100 - allMetrics.reduce((acc, m) => {
            if (m.severity === 'Mild') return acc + 5;
            if (m.severity === 'Moderate') return acc + 15;
            if (m.severity === 'Severe') return acc + 30;
            return acc;
          }, 0));

          const actionPlan: Exercise[] = [];
          const potentialConditions: string[] = [];
          const tData = translations[language];

          allMetrics.forEach(m => {
            if (m.severity !== 'Normal' && m.key) {
              const plan = (tData as any).actionPlans?.[m.key];
              if (plan && !actionPlan.find(p => p.id === m.key)) {
                actionPlan.push({
                  id: m.key,
                  name: plan.name,
                  description: plan.desc,
                  duration: plan.duration
                });
              }
              const condition = (tData as any).conditions?.[m.key];
              if (condition && !potentialConditions.includes(condition)) {
                potentialConditions.push(condition);
              }
            }
          });

          onAnalysisComplete({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            score,
            metrics: allMetrics,
            imageUrl: firstImageSrc,
            landmarks: firstLandmarks,
            view: firstView,
            actionPlan,
            potentialConditions,
            images,
            allLandmarks
          });
        } else if (isMounted) {
          setError(t.noPerson);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        if (isMounted) setError(t.failAnalyze);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initLandmarker();

    return () => {
      isMounted = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, [images, onAnalysisComplete, t, language]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {loading && !error && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium">{t.initEngine}</p>
        </div>
      )}
      {error && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold"
          >
            {t.retry}
          </button>
        </div>
      )}
    </div>
  );
};
