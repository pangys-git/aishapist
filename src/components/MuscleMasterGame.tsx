import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { useLanguage } from '../context/LanguageContext';
import { X, Play, Trophy, AlertCircle, RefreshCw, Camera } from 'lucide-react';

type NoteType = 'SQUAT' | 'HANDS_UP' | 'JUMP_JACK';

interface Note {
  time: number;
  type: NoteType;
  hit?: boolean;
  missed?: boolean;
}

interface Level {
  id: string;
  stage: number;
  level: number;
  name: string;
  bpm: number;
  duration: number;
  youtubeId: string;
  notes: Note[];
}

// Generate simple levels
const generateLevel = (stage: number, level: number, name: string, bpm: number, duration: number, youtubeId: string, types: NoteType[]): Level => {
  const notes: Note[] = [];
  const beatInterval = 60 / bpm;
  let currentTime = 5; // Start after 5 seconds
  
  while (currentTime < duration) {
    // Randomly select a note type from the allowed types for this level
    const type = types[Math.floor(Math.random() * types.length)];
    notes.push({ time: currentTime, type });
    currentTime += beatInterval * (Math.random() > 0.5 ? 2 : 4); // Notes every 2 or 4 beats
  }
  
  return { id: `S${stage}L${level}`, stage, level, name, bpm, duration, youtubeId, notes };
};

const LEVELS: Level[] = [
  // Stage 1: Lower Body (Focus on stability and basic strength)
  generateLevel(1, 1, '基礎喚醒 (入門)', 70, 90, 'p7ZsBPK656s', ['SQUAT']),
  generateLevel(1, 2, '穩健步伐 (初級)', 80, 90, 'p7ZsBPK656s', ['SQUAT']),
  generateLevel(1, 3, '力量累積 (中級)', 90, 90, 'p7ZsBPK656s', ['SQUAT']),
  generateLevel(1, 4, '活力躍動 (進階)', 100, 90, 'p7ZsBPK656s', ['SQUAT']),
  generateLevel(1, 5, '下肢大師 (挑戰)', 110, 90, 'p7ZsBPK656s', ['SQUAT']),

  // Stage 2: Core & Coordination (Squats + Hands Up)
  generateLevel(2, 1, '核心啟動 (入門)', 75, 90, 'K4DyBUG242c', ['SQUAT', 'HANDS_UP']),
  generateLevel(2, 2, '平衡練習 (初級)', 85, 90, 'K4DyBUG242c', ['SQUAT', 'HANDS_UP']),
  generateLevel(2, 3, '協調訓練 (中級)', 95, 90, 'K4DyBUG242c', ['SQUAT', 'HANDS_UP']),
  generateLevel(2, 4, '核心強化 (進階)', 105, 90, 'K4DyBUG242c', ['SQUAT', 'HANDS_UP']),
  generateLevel(2, 5, '身心合一 (挑戰)', 115, 90, 'K4DyBUG242c', ['SQUAT', 'HANDS_UP']),

  // Stage 3: Full Body Vitality (Squats + Hands Up + Jump Jacks)
  generateLevel(3, 1, '全身舒展 (入門)', 80, 90, 'TW9d8vYrVFQ', ['SQUAT', 'HANDS_UP', 'JUMP_JACK']),
  generateLevel(3, 2, '燃脂輕動 (初級)', 90, 90, 'TW9d8vYrVFQ', ['SQUAT', 'HANDS_UP', 'JUMP_JACK']),
  generateLevel(3, 3, '活力全開 (中級)', 100, 90, 'TW9d8vYrVFQ', ['SQUAT', 'HANDS_UP', 'JUMP_JACK']),
  generateLevel(3, 4, '極限挑戰 (進階)', 110, 90, 'TW9d8vYrVFQ', ['SQUAT', 'HANDS_UP', 'JUMP_JACK']),
  generateLevel(3, 5, '肌力巔峰 (挑戰)', 120, 90, 'TW9d8vYrVFQ', ['SQUAT', 'HANDS_UP', 'JUMP_JACK']),
];

interface MuscleMasterGameProps {
  onExit: () => void;
}

export const MuscleMasterGame: React.FC<MuscleMasterGameProps> = ({ onExit }) => {
  const { t } = useLanguage();
  const gameData = (t as any).muscleMaster.game;
  
  const [gameState, setGameState] = useState<'LOADING' | 'MENU' | 'PLAYING' | 'RESULT'>('LOADING');
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasStartedInit, setHasStartedInit] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  
  // Audio Context for simple beeps
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Game Engine State (using refs to avoid React re-renders during 60fps loop)
  const engineRef = useRef({
    startTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    notes: [] as Note[],
    feedback: '',
    feedbackTime: 0,
    lastAction: 'IDLE',
    hitWindow: 0.4, // +/- 0.4s to hit
    speed: 600, // pixels per second
    isPlaying: false,
    youtubeFailed: false,
    duration: 0,
    lastTimestamp: -1,
  });

  // Initialize MediaPipe and Camera
  useEffect(() => {
    if (!hasStartedInit) return;
    
    let stream: MediaStream | null = null;
    let isMounted = true;

    const init = async () => {
      if (isInitializing) return;
      setIsInitializing(true);
      setError(null);
      try {
        console.log("MuscleMaster: Starting initialization...");
        // 1. Setup Camera
        console.log("MuscleMaster: Requesting camera access...");
        
        // Check if Permissions API is available and check camera status
        if (navigator.permissions && (navigator.permissions as any).query) {
          try {
            const status = await navigator.permissions.query({ name: 'camera' as any });
            console.log("MuscleMaster: Camera permission status:", status.state);
          } catch (pErr) {
            console.warn("MuscleMaster: Permissions API query failed:", pErr);
          }
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('您的瀏覽器不支援相機功能。請更換瀏覽器。');
        }

        try {
          // Try with ideal constraints first for better quality
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } } 
          });
        } catch (e) {
          console.warn("MuscleMaster: Ideal constraints failed, falling back to basic video:", e);
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        console.log("MuscleMaster: Camera access granted.");
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("MuscleMaster: Video metadata loaded.");
            videoRef.current?.play().catch(e => console.error("MuscleMaster: Video play failed:", e));
          };
        }

        // 2. Setup MediaPipe
        console.log("MuscleMaster: Loading MediaPipe vision tasks...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        console.log("MuscleMaster: MediaPipe vision tasks loaded. Creating PoseLandmarker...");
        
        let landmarker;
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/pose_landmarker/pose_landmarker_lite.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
          });
        } catch (gpuError) {
          console.warn("MuscleMaster: GPU initialization failed, falling back to CPU:", gpuError);
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/pose_landmarker/pose_landmarker_lite.task",
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
          });
        }
        console.log("MuscleMaster: PoseLandmarker created successfully.");
        
        if (isMounted) {
          landmarkerRef.current = landmarker;
          setGameState('MENU');
          console.log("MuscleMaster: Initialization complete, state set to MENU.");
        }
      } catch (err: any) {
        console.error("MuscleMaster: Initialization error:", err);
        if (isMounted) {
          let userFriendlyError = err.message || gameData.cameraError;
          if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
            userFriendlyError = "相機存取被拒絕。請在瀏覽器設定中允許此應用程式使用相機，然後點擊「重試」。";
          } else if (err.name === 'NotFoundError') {
            userFriendlyError = "找不到相機設備。請確保您的裝置已連接相機。";
          } else if (err.message) {
            userFriendlyError = err.message;
          }
          setError(userFriendlyError);
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [retryCount, hasStartedInit]);

  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const startGame = (level: Level) => {
    // Init Audio Context on user interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Reset Engine State
    engineRef.current = {
      startTime: performance.now() / 1000,
      score: 0,
      combo: 0,
      maxCombo: 0,
      notes: JSON.parse(JSON.stringify(level.notes)), // Deep copy
      feedback: '',
      feedbackTime: 0,
      lastAction: 'IDLE',
      hitWindow: 0.4,
      speed: 600,
      isPlaying: false, // Will be set to true when YouTube starts playing
      youtubeFailed: false,
      duration: level.duration,
      lastTimestamp: -1,
    };
    
    setGameState('PLAYING');
    
    // Cancel any existing loop before starting a new one
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const detectAction = (landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) return 'IDLE';
    const lm = landmarks[0];
    
    // MediaPipe indices: 0: nose, 15: l_wrist, 16: r_wrist, 23: l_hip, 24: r_hip, 25: l_knee, 26: r_knee, 27: l_ankle, 28: r_ankle
    const nose = lm[0];
    const lWrist = lm[15], rWrist = lm[16];
    const lHip = lm[23], rHip = lm[24];
    const lKnee = lm[25], rKnee = lm[26];
    const lAnkle = lm[27], rAnkle = lm[28];

    // Y goes from 0 (top) to 1 (bottom)
    const handsUp = lWrist.y < nose.y && rWrist.y < nose.y;
    const hipY = (lHip.y + rHip.y) / 2;
    const kneeY = (lKnee.y + rKnee.y) / 2;
    
    // Squat: Hips are close to or below knees
    const squatting = hipY > kneeY - 0.1;
    
    // Jumping Jack: Feet wide apart and hands up
    const feetWide = Math.abs(lAnkle.x - rAnkle.x) > 0.2;

    if (handsUp && feetWide) return 'JUMP_JACK';
    if (handsUp) return 'HANDS_UP';
    if (squatting) return 'SQUAT';
    return 'IDLE';
  };

  const gameLoop = () => {
    const engine = engineRef.current;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    
    if (!video || !canvas || !landmarker || video.readyState < 2 || video.videoWidth === 0) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // 2. Clear Canvas & Draw Video (ALWAYS DO THIS)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1); // Mirror video
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Darken background slightly for contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!engine.isPlaying && !engine.youtubeFailed) {
      // Draw "Waiting for Music..." text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for Music...', canvas.width / 2, canvas.height / 2);
      
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Sync game time with YouTube player time or fallback
    let currentTime = 0;
    if (engine.youtubeFailed) {
      currentTime = performance.now() / 1000 - engine.startTime;
    } else if (ytPlayerRef.current) {
      currentTime = ytPlayerRef.current.getCurrentTime();
    }
    
    // 1. Detect Pose
    let currentAction = engine.lastAction;
    try {
      const now = performance.now();
      if (now > engine.lastTimestamp) {
        const result = landmarker.detectForVideo(video, now);
        currentAction = detectAction(result.landmarks);
        engine.lastTimestamp = now;
      }
    } catch (e) {
      console.error("MediaPipe detection error:", e);
    }

    // 2. Clear Canvas & Draw Video (Moved up)
    const hitLineY = canvas.height * 0.8;

    // Draw Hit Line
    ctx.beginPath();
    ctx.moveTo(0, hitLineY);
    ctx.lineTo(canvas.width, hitLineY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 3. Process Notes & Hit Detection
    let allNotesProcessed = true;
    
    engine.notes.forEach(note => {
      if (!note.hit && !note.missed) {
        allNotesProcessed = false;
        const timeDiff = note.time - currentTime;
        const noteY = hitLineY - (timeDiff * engine.speed);
        
        // Draw Note
        if (noteY > -100 && noteY < canvas.height + 100) {
          ctx.beginPath();
          ctx.arc(canvas.width / 2, noteY, 30, 0, 2 * Math.PI);
          
          if (note.type === 'SQUAT') {
            ctx.fillStyle = '#ef4444'; // Red
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gameData.squat, canvas.width / 2, noteY + 5);
          } else if (note.type === 'HANDS_UP') {
            ctx.fillStyle = '#3b82f6'; // Blue
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gameData.handsUp, canvas.width / 2, noteY + 5);
          } else if (note.type === 'JUMP_JACK') {
            ctx.fillStyle = '#a855f7'; // Purple
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gameData.jumpJack, canvas.width / 2, noteY + 5);
          }
          
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'white';
          ctx.stroke();
        }

        // Hit Detection
        if (Math.abs(timeDiff) <= engine.hitWindow) {
          // Allow hitting if action matches
          if (currentAction === note.type) {
            note.hit = true;
            engine.score += 100 + (engine.combo * 10);
            engine.combo += 1;
            if (engine.combo > engine.maxCombo) engine.maxCombo = engine.combo;
            engine.feedback = gameData.perfect;
            engine.feedbackTime = currentTime;
            playBeep(800, 'sine', 0.1); // Success beep
            
            // Visual hit effect
            ctx.beginPath();
            ctx.arc(canvas.width / 2, hitLineY, 50, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
          }
        } else if (timeDiff < -engine.hitWindow) {
          // Missed
          note.missed = true;
          engine.combo = 0;
          engine.feedback = gameData.miss;
          engine.feedbackTime = currentTime;
          playBeep(200, 'sawtooth', 0.2); // Miss beep
        }
      }
    });

    engine.lastAction = currentAction;

    // 4. Draw UI (Score, Combo, Feedback)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${gameData.score}: ${engine.score}`, 20, 50);
    
    ctx.textAlign = 'right';
    ctx.fillText(`${gameData.combo}: ${engine.combo}`, canvas.width - 20, 50);

    // Draw Feedback
    if (currentTime - engine.feedbackTime < 0.5) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillStyle = engine.feedback === gameData.perfect ? '#10b981' : '#ef4444';
      
      // Simple animation
      const scale = 1 + (0.5 - (currentTime - engine.feedbackTime)) * 0.5;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.fillText(engine.feedback, 0, 0);
      ctx.restore();
    }

    // Draw Current Action Debug
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, canvas.height - 40, 200, 30);
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Action: ${currentAction}`, 20, canvas.height - 20);

    // Check End Game
    if (allNotesProcessed && currentTime > engine.duration + 2) {
      engine.isPlaying = false;
      setGameState('RESULT');
      return;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col">
      {/* Hidden Video Element for MediaPipe */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} 
      />

      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md z-10">
        <button onClick={onExit} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white">Muscle Master</h2>
        <div className="w-10" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        
        {gameState === 'LOADING' && (
          <div className="text-center text-white bg-zinc-800 p-8 rounded-3xl shadow-2xl border border-zinc-700 max-w-sm w-full mx-4">
            {!hasStartedInit ? (
              <>
                <Camera className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">準備開始遊戲</h3>
                <p className="text-sm text-zinc-400 mb-6">點擊下方按鈕以啟動相機並開始 AI 姿態檢測。</p>
                
                <div className="bg-zinc-900/50 p-4 rounded-2xl mb-6 text-left">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">電腦版提示：</h4>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc pl-4">
                    <li>請確保您的電腦已連接網路攝影機。</li>
                    <li>若無法開啟，請檢查瀏覽器網址列左側是否已允許相機權限。</li>
                    <li>建議使用 Chrome 或 Edge 瀏覽器以獲得最佳體驗。</li>
                  </ul>
                </div>

                <button
                  onClick={() => setHasStartedInit(true)}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg"
                >
                  啟動相機
                </button>
              </>
            ) : (
              <>
                {isInitializing && !error ? (
                  <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                ) : error ? (
                  <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                ) : (
                  <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                )}
                
                <h3 className="text-xl font-bold mb-2">{error ? '初始化失敗' : gameData.loading}</h3>
                <p className="text-sm text-zinc-400 mb-6">{error || '正在準備 AI 引擎與相機...'}</p>
                
                <div className="space-y-3">
                  {error && (
                    <button
                      onClick={() => setRetryCount(prev => prev + 1)}
                      className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold transition-colors hover:bg-emerald-600 flex items-center justify-center"
                    >
                      <RefreshCw className={`w-5 h-5 mr-2 ${isInitializing ? 'animate-spin' : ''}`} />
                      {isInitializing ? '正在重試...' : '重試'}
                    </button>
                  )}
                  <button
                    onClick={onExit}
                    className="w-full py-3 bg-zinc-700 text-white rounded-xl font-bold transition-colors hover:bg-zinc-600"
                  >
                    返回主頁
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {gameState === 'MENU' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800 p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl border border-zinc-700 flex flex-col max-h-[90vh]"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center shrink-0">{gameData.selectLevel}</h3>
            
            {/* Stage Tabs */}
            <div className="flex space-x-2 mb-6 shrink-0">
              {[1, 2, 3].map(stage => (
                <button
                  key={stage}
                  onClick={() => {
                    setSelectedStage(stage);
                    const firstLevelOfStage = LEVELS.find(l => l.stage === stage);
                    if (firstLevelOfStage) setSelectedLevel(firstLevelOfStage);
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                    selectedStage === stage 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                      : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                  }`}
                >
                  {gameData[`stage${stage}`]?.split(':')[0] || `Stage ${stage}`}
                </button>
              ))}
            </div>

            {/* Level List */}
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
              {LEVELS.filter(l => l.stage === selectedStage).map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
                    selectedLevel.id === level.id 
                      ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  <div>
                    <div className="font-bold text-lg">{gameData.level} {level.level}: {level.name}</div>
                    <div className="text-sm opacity-80">{level.bpm} BPM • {level.notes.length} Notes</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(selectedLevel)}
              className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center transition-colors shadow-lg shrink-0"
            >
              <Play className="w-6 h-6 mr-2" /> {gameData.start}
            </button>
          </motion.div>
        )}

        {gameState === 'PLAYING' && (
          <>
            {/* YouTube Player (Mini view) */}
            <div className="absolute top-4 right-4 w-48 aspect-video z-20 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl opacity-80 hover:opacity-100 transition-opacity bg-black">
              <YouTube 
                videoId={selectedLevel.youtubeId} 
                opts={{ 
                  width: '100%', 
                  height: '100%', 
                  playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1 } 
                }}
                onReady={(e) => { 
                  ytPlayerRef.current = e.target; 
                  e.target.playVideo(); 
                }}
                onStateChange={(e) => {
                  // 1 = PLAYING
                  if (e.data === 1) {
                    engineRef.current.isPlaying = true;
                  } else {
                    engineRef.current.isPlaying = false;
                  }
                }}
                onEnd={() => {
                  engineRef.current.isPlaying = false;
                  setGameState('RESULT');
                }}
                onError={(e) => {
                  console.error("YouTube Error:", e.data);
                  // Fallback: if YouTube fails, just play the game without music using performance.now()
                  engineRef.current.youtubeFailed = true;
                  engineRef.current.isPlaying = true;
                  engineRef.current.startTime = performance.now() / 1000;
                }}
              />
            </div>
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain z-10 relative"
            />
          </>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl border border-zinc-700 text-center"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-3xl font-black text-white mb-2">{gameData.gameOver}</h3>
            <div className="bg-zinc-900 p-6 rounded-2xl mb-8">
              <div className="text-zinc-400 mb-1">{gameData.score}</div>
              <div className="text-5xl font-black text-rose-500 mb-4">{engineRef.current.score}</div>
              <div className="flex justify-between text-zinc-300 font-bold">
                <span>Max {gameData.combo}:</span>
                <span className="text-emerald-400">{engineRef.current.maxCombo}</span>
              </div>
            </div>
            <button
              onClick={() => setGameState('MENU')}
              className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold text-xl transition-colors hover:bg-zinc-200"
            >
              {t.backToHome}
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
