import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gamepad2, Activity, Shield, Code, Music, Target, Zap, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MuscleMasterGame } from './MuscleMasterGame';

interface MuscleMasterViewProps {
  onBack: () => void;
}

export const MuscleMasterView: React.FC<MuscleMasterViewProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const mmData = (t as any).muscleMaster;

  const isZh = language === 'zh';

  if (isPlaying) {
    return <MuscleMasterGame onExit={() => setIsPlaying(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
            {mmData.tagline}
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">{mmData.title}</h2>
          <p className="text-zinc-500">{mmData.desc}</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsPlaying(true)} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors flex items-center shadow-lg shadow-rose-500/30">
            <Play className="w-5 h-5 mr-2" /> {mmData.game.playNow}
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors flex items-center text-zinc-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Concept */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center">
            <Gamepad2 className="w-6 h-6 mr-3 text-rose-500" />
            {mmData.sections.concept}
          </h3>
          <div className="prose prose-zinc max-w-none">
            <p className="text-lg font-medium text-zinc-800 mb-4">
              {isZh ? '「練肌之達人」是一款將枯燥的健身動作轉化為熱血節奏打擊的創新體感遊戲。' : '"Muscle Master" transforms boring workouts into an exciting rhythm game.'}
            </p>
            <ul className="space-y-3 text-zinc-600">
              <li><strong className="text-zinc-900">{isZh ? '無門檻體感' : 'No Barriers'}:</strong> {isZh ? '不需要 Switch 或 VR 設備，只要有一支手機，隨時隨地都是你的專屬健身房。' : 'No console or VR needed. Your phone is your gym.'}</li>
              <li><strong className="text-zinc-900">{isZh ? '精準打擊感' : 'Precise Hit Feel'}:</strong> {isZh ? '透過 AI 視覺辨識（Pose Estimation），精準捕捉玩家的骨架位移，將「深蹲」、「舉手」化為完美的 Combo。' : 'Uses AI Pose Estimation to track your skeleton, turning squats and raises into perfect combos.'}</li>
              <li><strong className="text-zinc-900">{isZh ? '無痛養成' : 'Painless Habit'}:</strong> {isZh ? '將痛苦的肌肉鍛鍊隱藏在動感的音樂節拍中，讓玩家在追求 Full Combo 的過程中，不知不覺完成每日運動量。' : 'Hide the pain of working out behind catching beats. Get your daily exercise while chasing a Full Combo.'}</li>
            </ul>
          </div>
        </motion.section>

        {/* Section 2: Mechanics */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center text-rose-400">
            <Music className="w-6 h-6 mr-3" />
            {mmData.sections.mechanics}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <h4 className="font-bold text-lg">{isZh ? '紅音符『咚』' : 'Red Note "Don"'}</h4>
              </div>
              <p className="text-zinc-400 text-sm">{isZh ? '動作：快速【深蹲】' : 'Action: Quick Squat'}</p>
            </div>
            <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <h4 className="font-bold text-lg">{isZh ? '藍音符『咔』' : 'Blue Note "Ka"'}</h4>
              </div>
              <p className="text-zinc-400 text-sm">{isZh ? '動作：雙手【高舉過頭】' : 'Action: Hands Up'}</p>
            </div>
            <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50">
              <div className="flex items-center mb-2">
                <div className="w-4 h-12 rounded-full bg-yellow-400 mr-3 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                <h4 className="font-bold text-lg">{isZh ? '黃色長條『連打』' : 'Yellow Long Note'}</h4>
              </div>
              <p className="text-zinc-400 text-sm">{isZh ? '動作：【平板支撐】維持指定秒數' : 'Action: Plank for duration'}</p>
            </div>
            <div className="bg-zinc-800/50 p-5 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center mb-2">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  <div className="w-2 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <h4 className="font-bold text-lg text-emerald-400">{isZh ? '綠色雙軌『閃』(New)' : 'Green Dual Note (New)'}</h4>
              </div>
              <p className="text-zinc-400 text-sm">{isZh ? '動作：【左右跨步蹲】訓練大腿內外側' : 'Action: Side Lunge for inner/outer thighs'}</p>
            </div>
            <div className="bg-zinc-800/50 p-5 rounded-2xl border border-purple-500/30 md:col-span-2">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 mr-3 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <h4 className="font-bold text-lg text-purple-400">{isZh ? '紫色爆發『破』(New)' : 'Purple Burst Note (New)'}</h4>
              </div>
              <p className="text-zinc-400 text-sm">{isZh ? '動作：【開合跳】雙腳張開大於肩寬且雙手高舉。訓練心肺爆發力與全身協調。' : 'Action: Jumping Jack. Trains cardio and full-body coordination.'}</p>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Levels */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-emerald-500" />
            {mmData.sections.levels}
          </h3>
          <div className="space-y-4">
            <div className="p-5 border border-zinc-100 rounded-2xl bg-zinc-50 hover:bg-white transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-zinc-900">{isZh ? 'Stage 1: 覺醒的下肢' : 'Stage 1: Lower Body Awakening'}</h4>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">120 BPM Electro Pop</span>
              </div>
              <p className="text-sm text-zinc-500 mb-2"><strong>{isZh ? '目標肌群' : 'Target'}:</strong> {isZh ? '股四頭肌、臀大肌' : 'Quads, Glutes'}</p>
              <p className="text-zinc-700 text-sm">{isZh ? '以紅音符 (深蹲) 與綠音符 (跨步蹲) 為主，節奏穩定，幫助玩家熟悉下肢發力與 AI 判定節奏。' : 'Focuses on Squats and Side Lunges. Steady rhythm to help players get used to AI detection.'}</p>
            </div>
            <div className="p-5 border border-zinc-100 rounded-2xl bg-zinc-50 hover:bg-white transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-zinc-900">{isZh ? 'Stage 2: 核心之盾' : 'Stage 2: Shield of Core'}</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">90 BPM Trap/Dubstep</span>
              </div>
              <p className="text-sm text-zinc-500 mb-2"><strong>{isZh ? '目標肌群' : 'Target'}:</strong> {isZh ? '腹直肌、腹橫肌' : 'Abs, Core'}</p>
              <p className="text-zinc-700 text-sm">{isZh ? '大量黃色長條音符 (平板支撐)，考驗玩家的肌耐力。音樂重拍落下時會穿插藍音符 (單手撐地另一手高舉)，極度燃燒核心。' : 'Heavy use of long yellow notes (Planks). Drops feature blue notes (one-arm raises while planking) to burn the core.'}</p>
            </div>
            <div className="p-5 border border-zinc-100 rounded-2xl bg-zinc-50 hover:bg-white transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-zinc-900">{isZh ? 'Stage 3: 燃脂大師' : 'Stage 3: Fat Burn Master'}</h4>
                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">160+ BPM J-Rock</span>
              </div>
              <p className="text-sm text-zinc-500 mb-2"><strong>{isZh ? '目標肌群' : 'Target'}:</strong> {isZh ? '全身心肺、爆發力' : 'Full Body Cardio'}</p>
              <p className="text-zinc-700 text-sm">{isZh ? '紫色爆發音符 (開合跳) 密集出現，結合深蹲與舉手，是一場考驗反應速度與心肺極限的 Boss 戰！' : 'Dense purple notes (Jumping Jacks) mixed with squats and raises. A boss battle testing reaction and cardio limits!'}</p>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Tips */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-rose-50 p-8 rounded-3xl border border-rose-100"
        >
          <h3 className="text-2xl font-bold text-rose-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-rose-500" />
            {mmData.sections.tips}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100/50">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-zinc-800 font-medium text-sm leading-relaxed">
                {isZh ? '「肌肉是你身體最堅固的鎧甲！每一次深蹲，都在為你的膝蓋與脊椎建立無敵防護罩！」' : '"Muscle is your strongest armor! Every squat builds an invincible shield for your knees and spine!"'}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100/50">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-zinc-800 font-medium text-sm leading-relaxed">
                {isZh ? '「燃燒吧！肌肉是人體最大的消耗器官，鍛鍊它，讓你在睡覺時也能持續消耗卡路里！」' : '"Burn! Muscle is the body\'s biggest consumer. Train it to burn calories even while you sleep!"'}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100/50">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-zinc-800 font-medium text-sm leading-relaxed">
                {isZh ? '「覺得大腦卡卡的？運動能促進腦內啡分泌，打完這首歌，保證你思緒比 AI 還清晰！」' : '"Brain fog? Exercise releases endorphins. Finish this song and your mind will be sharper than AI!"'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Tech (Hidden for Vercel/GitHub deployment) */}
        {/*
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-zinc-900 p-8 rounded-3xl text-zinc-300 shadow-xl overflow-hidden"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-blue-400" />
            {mmData.sections.tech}
          </h3>
          <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm overflow-x-auto border border-zinc-800">
<pre className="text-emerald-400">
{`class MuscleMasterEngine {
  constructor() {
    this.poseEstimator = new MediaPipePose({ minConfidence: 0.5 });
    this.currentBeatTime = 0.0;
    this.hitWindow = 0.2; // +/- 0.2s
  }
  
  processFrame(videoFrame, audioTime) {
    this.currentBeatTime = audioTime;
    
    // 1. Extract skeleton landmarks
    const landmarks = this.poseEstimator.detect(videoFrame);
    if (!landmarks) return "MISS";
        
    // 2. Action Recognition
    const currentAction = this.recognizeAction(landmarks);
    
    // 3. Rhythm Hit Detection
    return this.checkHit(currentAction);
  }

  recognizeAction(landmarks) {
    const { HIP, KNEE, WRIST, NOSE } = landmarks;
    
    // Squat: Hip Y is lower than Knee Y (Y-axis points down)
    if (HIP.y > KNEE.y) return "SQUAT";
        
    // Hands Up: Wrist Y is higher than Head Y
    if (WRIST.y < NOSE.y) return "HANDS_UP";
        
    return "IDLE";
  }

  checkHit(currentAction) {
    const upcomingNotes = getNotesInWindow(this.currentBeatTime, this.hitWindow);
    
    for (let note of upcomingNotes) {
      if (note.type === "RED" && currentAction === "SQUAT") {
        return this.calculateScore(note.time, this.currentBeatTime);
      } else if (note.type === "BLUE" && currentAction === "HANDS_UP") {
        return this.calculateScore(note.time, this.currentBeatTime);
      }
    }
    return "MISS";
  }
}`}
</pre>
          </div>
        </motion.section>
        */}
      </div>
    </div>
  );
};
