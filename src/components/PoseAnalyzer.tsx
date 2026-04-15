import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { AnalysisResult, Landmark, Exercise, PostureMetric, UserInfo, SarcopeniaScreeningResult } from '../types';
import { analyzePosture } from '../utils/poseUtils';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

interface PoseAnalyzerProps {
  images: { Front?: string; Side?: string; Back?: string };
  userInfo?: UserInfo;
  sarcopeniaScreening?: SarcopeniaScreeningResult;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const PoseAnalyzer: React.FC<PoseAnalyzerProps> = ({ images, userInfo, sarcopeniaScreening, onAnalysisComplete }) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initLandmarker = async () => {
      console.log("PoseAnalyzer: Starting initialization...");
      const timeoutId = setTimeout(() => {
        if (loading && !error) {
          setError(language === 'en' ? "Initialization timed out. Please check your connection." : "初始化超時，請檢查網絡連接。");
        }
      }, 30000); // 30 second timeout

      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        console.log("PoseAnalyzer: FilesetResolver loaded");
        
        try {
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/pose_landmarker/pose_landmarker_full.task`,
              delegate: "GPU"
            },
            runningMode: "IMAGE",
            numPoses: 1,
            minPoseDetectionConfidence: 0.3,
            minPosePresenceConfidence: 0.3,
            minTrackingConfidence: 0.3
          });
          console.log("PoseAnalyzer: PoseLandmarker created with GPU");
        } catch (gpuErr) {
          console.warn("PoseAnalyzer: GPU initialization failed, falling back to CPU", gpuErr);
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/pose_landmarker/pose_landmarker_full.task`,
              delegate: "CPU"
            },
            runningMode: "IMAGE",
            numPoses: 1,
            minPoseDetectionConfidence: 0.3,
            minPosePresenceConfidence: 0.3,
            minTrackingConfidence: 0.3
          });
          console.log("PoseAnalyzer: PoseLandmarker created with CPU");
        }

        clearTimeout(timeoutId);
        if (!isMounted) return;

        const allMetrics: PostureMetric[] = [];
        const allLandmarks: { Front?: Landmark[]; Side?: Landmark[]; Back?: Landmark[] } = {};
        let firstImageSrc = '';
        let firstLandmarks: Landmark[] = [];
        let firstView: 'Front' | 'Side' | 'Back' | 'Combined' = 'Combined';

        const viewsToProcess = (['Front', 'Side', 'Back'] as const).filter(v => images[v]);
        console.log("PoseAnalyzer: Processing views:", viewsToProcess);

        for (const v of viewsToProcess) {
          console.log(`PoseAnalyzer: Processing view ${v}...`);
          const imgUrl = images[v]!;
          
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          
          const imageBitmap = await createImageBitmap(blob, { 
            imageOrientation: 'from-image' 
          });

          if (!landmarkerRef.current || !isMounted) return;

          const MAX_DIM = 1024;
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
          
          ctx.drawImage(imageBitmap, 0, 0, width, height);
          
          const result = landmarkerRef.current.detect(canvas);
          console.log(`PoseAnalyzer: Detection result for ${v}:`, result.landmarks?.length > 0 ? "Found" : "Not found");

          if (result.landmarks && result.landmarks.length > 0 && isMounted) {
            const landmarks: Landmark[] = result.landmarks[0].map(l => ({
              x: l.x,
              y: l.y,
              z: l.z,
              visibility: l.visibility || 0.5
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

        console.log("PoseAnalyzer: All views processed. Metrics count:", allMetrics.length);

        if (userInfo) {
          if (userInfo.height && userInfo.weight) {
            const heightM = userInfo.height / 100;
            const bmi = userInfo.weight / (heightM * heightM);
            let severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe' = 'Normal';
            let recommendation = language === 'en' ? 'Normal weight.' : '體重正常。';
            
            if (bmi < 18.5) {
              severity = 'Mild';
              recommendation = language === 'en' ? 'Underweight. Consider a balanced diet to gain weight.' : '體重過輕。建議均衡飲食以增加體重。';
            } else if (bmi >= 24 && bmi < 27) {
              severity = 'Mild';
              recommendation = language === 'en' ? 'Overweight. Consider regular exercise and a balanced diet.' : '過重。建議規律運動與均衡飲食。';
            } else if (bmi >= 27 && bmi < 30) {
              severity = 'Moderate';
              recommendation = language === 'en' ? 'Mild obesity. Consult a professional for a weight loss plan.' : '輕度肥胖。建議諮詢專業人士制定減重計畫。';
            } else if (bmi >= 30) {
              severity = 'Severe';
              recommendation = language === 'en' ? 'Severe obesity. Please seek medical advice.' : '中度至重度肥胖。請尋求醫療協助。';
            }

            allMetrics.push({
              key: 'bmi',
              name: 'BMI',
              value: parseFloat(bmi.toFixed(1)),
              unit: '',
              severity,
              description: language === 'en' ? 'Body Mass Index' : '身體質量指數',
              recommendation,
              searchKeywords: language === 'en' ? 'BMI improvement' : '改善 BMI',
              cues: []
            });
          }

          if (userInfo.waist && userInfo.hip) {
            const whr = userInfo.waist / userInfo.hip;
            let severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe' = 'Normal';
            let recommendation = language === 'en' ? 'Normal waist-to-hip ratio.' : '腰臀比正常。';
            
            // Using general thresholds (Men > 0.9, Women > 0.85 indicates higher risk, we use a simplified threshold here)
            if (whr >= 0.85 && whr < 0.9) {
              severity = 'Mild';
              recommendation = language === 'en' ? 'Slightly high. Monitor your diet and exercise.' : '偏高。注意飲食與運動。';
            } else if (whr >= 0.9 && whr < 0.95) {
              severity = 'Moderate';
              recommendation = language === 'en' ? 'High. Increased risk of metabolic issues.' : '過高。代謝症候群風險增加。';
            } else if (whr >= 0.95) {
              severity = 'Severe';
              recommendation = language === 'en' ? 'Very high. Please seek medical advice.' : '極高。請尋求醫療協助。';
            }

            allMetrics.push({
              key: 'whr',
              name: language === 'en' ? 'Waist-to-Hip Ratio' : '腰臀比',
              value: parseFloat(whr.toFixed(2)),
              unit: '',
              severity,
              description: language === 'en' ? 'Waist circumference divided by hip circumference' : '腰圍除以臀圍',
              recommendation,
              searchKeywords: language === 'en' ? 'Reduce waist-to-hip ratio' : '降低腰臀比',
              cues: []
            });
          }
        }

        if (sarcopeniaScreening) {
          // Add SARC-F Metric
          const sarcfSeverity: 'Normal' | 'Mild' | 'Moderate' | 'Severe' = sarcopeniaScreening.sarcfScore >= 4 ? 'Severe' : 'Normal';
          allMetrics.push({
            key: 'sarcf',
            name: language === 'en' ? 'SARC-F Score' : 'SARC-F 問卷得分',
            value: sarcopeniaScreening.sarcfScore,
            unit: '/ 10',
            severity: sarcfSeverity,
            description: language === 'en' ? 'Clinical screening for sarcopenia risk' : '肌少症風險臨床篩查',
            recommendation: sarcfSeverity === 'Severe' 
              ? (language === 'en' ? 'High risk. Consult a healthcare professional.' : '高風險。建議諮詢醫療專業人士。')
              : (language === 'en' ? 'Low risk. Maintain activity.' : '低風險。請保持活動。'),
            cues: []
          });

          // Add Chair Stand Metric
          if (sarcopeniaScreening.chairStandTime !== null) {
            const time = sarcopeniaScreening.chairStandTime;
            let csSeverity: 'Normal' | 'Mild' | 'Moderate' | 'Severe' = 'Normal';
            if (time >= 15) csSeverity = 'Severe';
            else if (time >= 12) csSeverity = 'Moderate';
            else if (time >= 10) csSeverity = 'Mild';

            allMetrics.push({
              key: 'chairstand',
              name: language === 'en' ? '5-Times Chair Stand' : '五次坐下站起測試',
              value: parseFloat(time.toFixed(1)),
              unit: 's',
              severity: csSeverity,
              description: language === 'en' ? 'Measures lower body strength' : '評估下肢肌力',
              recommendation: csSeverity === 'Normal' 
                ? (language === 'en' ? 'Good strength.' : '肌力良好。')
                : (language === 'en' ? 'Consider leg strengthening exercises.' : '建議加強腿部肌肉訓練。'),
              cues: []
            });
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
            allLandmarks,
            userInfo,
            sarcopeniaScreening
          });
        } else if (isMounted) {
          setError(t.noPerson);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        clearTimeout(timeoutId);
        if (isMounted) setError(t.failAnalyze);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      }
    };

    if (Object.keys(images).length === 0 && !sarcopeniaScreening) {
      setError(t.noPerson);
      setLoading(false);
      return;
    }

    initLandmarker();

    return () => {
      isMounted = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, [images, onAnalysisComplete, t, language, sarcopeniaScreening]);

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
