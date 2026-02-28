export type Language = 'en' | 'zh';

export const translations = {
  en: {
    appName: 'AI Shapist',
    tagline: 'AI-Powered Posture Analysis',
    description: 'Professional-grade body alignment assessment from a single photo. Identify imbalances and get personalized corrective guidance.',
    newAnalysis: 'New Analysis',
    newAnalysisDesc: 'Start a fresh posture assessment using your camera or photo library.',
    history: 'History',
    historyDesc: 'Review your past reports and track your progress over time.',
    getStarted: 'Get Started',
    viewRecords: 'View Records',
    privacyFirst: 'Privacy First',
    privacyFirstDesc: 'Analysis is performed locally. Your photos never leave your device.',
    medicalGrade: 'Medical Grade',
    medicalGradeDesc: 'Algorithms based on clinical physical therapy assessment standards.',
    smartGuidance: 'Smart Guidance',
    smartGuidanceDesc: 'Get tailored exercise plans based on your specific posture needs.',
    backToHome: 'Back to Home',
    saveReport: 'Save Report',
    copyKeywords: 'Copy Keywords',
    keywordsCopied: 'Copied!',
    searchKeywordsLabel: 'Search Keywords',
    excellentAlignment: 'You have excellent alignment with minimal deviations.',
    needsImprovement: "We've identified some areas that could benefit from corrective exercises.",
    viewLabel: 'View',
    severityLabels: {
      Normal: 'Normal',
      Mild: 'Mild',
      Moderate: 'Moderate',
      Severe: 'Severe'
    },
    overallScore: 'Overall Score',
    analysisSummary: 'Analysis Summary',
    detailedMetrics: 'Detailed Metrics',
    recommendation: 'Recommendation',
    movementCues: 'Movement Cues',
    actionPlan: 'Recommended Action Plan',
    actionPlanDesc: "Based on your results, we've curated a simple daily routine to help improve your alignment.",
    startRoutine: 'Consult AI Shapist',
    analysisHistory: 'Analysis History',
    trackProgress: 'Track your posture improvement over time.',
    scoreTrend: 'Score Trend',
    noRecords: 'No analysis records found.',
    back: 'Back',
    deleteConfirm: 'Are you sure you want to delete this record?',
    analyzing: 'Analyzing Posture...',
    initEngine: 'Initializing AI Engine...',
    noPerson: 'No person detected in the image. Please ensure your full body is visible and well-lit.',
    failAnalyze: 'Failed to analyze image. Please try again.',
    failInit: 'Failed to initialize AI engine.',
    retry: 'Retry',
    captureReady: 'Ready to Capture',
    captureDesc: 'Position yourself in a well-lit area. Wear tight-fitting clothes for better accuracy.',
    openCamera: 'Open Camera',
    uploadPhoto: 'Upload Photo',
    proTip: 'Pro Tip',
    proTipDesc: (view: string) => `Stand naturally with feet shoulder-width apart. For ${view} view, ensure your entire body is visible in the frame.`,
    front: 'Front',
    side: 'Side',
    backView: 'Back',
    combined: 'Combined',
    analyzePhotos: 'Analyze Photos',
    provideAllPhotosWarning: 'Providing front, side, and back photos will yield more accurate results.',
    privacy: 'Privacy',
    terms: 'Terms',
    support: 'Support',
    educational: '© 2026 AI Shapist. For educational purposes only. Not a medical diagnosis.',
    reportSaved: 'Report saved successfully!',
    reportSaveFailed: 'Failed to save report.',
    everythingFitness: 'Everything Fitness',
    everythingFitnessDesc: 'Turn your surroundings into a gym. Take a photo of your environment and get exercise suggestions.',
    aiShapistChat: {
      title: 'AI Shapist Chat',
      desc: '"AI Shapist — The Trinity Intelligent Posture Management Expert" Integrating fitness, physiotherapy, and nutrition, AI Shapist creates personalized exercise and diet plans for you through real-time dialogue. From posture optimization to early warning medical advice, we make health management smarter and safer.'
    },
    momo: {
      title: 'MoMo',
      tagline: 'Gluteal Amnesia Reboot',
      desc: 'A structured micro-exercise library designed to combat "sitting disease" and reconnect your glutes. Perfect for office workers and remote professionals.',
      stealth: 'Stealth',
      target: 'Target',
      benefit: 'Benefit',
      combo: '30s Micro-Combo',
      scenarios: [
        {
          id: 'meeting',
          name: 'High-Density Meeting',
          desc: 'Seated, no obvious body movement, suitable under observation.',
          combo: '10s Micro Pelvic Tilts (Relax lower back) + 20s Seated Glute Squeeze (Reactivate)',
          exercises: [
            {
              name: 'Seated Glute Squeeze',
              steps: [
                'Sit with feet flat on the floor, back straight.',
                'Imagine your glutes are pinching a business card, squeeze both sides hard.',
                'Hold for 5-10 seconds, then slowly release. Repeat 5 times.'
              ],
              target: 'Gluteus Maximus',
              stealth: 5,
              benefit: 'Awakens neural connections via isometric contraction without changing joint angles. Completely stealthy.'
            },
            {
              name: 'Micro Pelvic Tilts',
              steps: [
                'Sit on the front third of your chair.',
                'Slightly contract your lower abdomen, imagine pulling your belly button towards your spine to slightly tilt your pelvis backward.',
                'Feel the slight roll of your sit bones on the chair, hold for 3 seconds then return to neutral.'
              ],
              target: 'Core, Multifidus',
              stealth: 4,
              benefit: 'Relieves lower back stiffness from prolonged sitting, slightly stretches tight erector spinae.'
            },
            {
              name: 'Heel Raises with Glute Focus',
              steps: [
                'Sit with feet flat, knees at 90 degrees.',
                'Slightly raise both heels 1 cm off the ground.',
                'Simultaneously rotate your thighs slightly outward (without moving knees), feeling a slight tension on the sides of your glutes.'
              ],
              target: 'Gluteus Medius',
              stealth: 5,
              benefit: 'Activates the stabilizing gluteus medius, counteracting the inward thigh rotation habit of sitting.'
            }
          ]
        },
        {
          id: 'openOffice',
          name: 'Open Office Area',
          desc: 'Small stretches or contractions at your desk without disturbing others.',
          combo: '15s Seated Hip Flexor Micro-Stretch (Release) + 15s Seated Leg Extension (Balance tension)',
          exercises: [
            {
              name: 'Seated Leg Extension',
              steps: [
                'Sit at the edge of the chair, extend one leg straight with heel on the ground and toes pointing up.',
                'Keep your back straight and lean slightly forward until you feel a stretch in the back of your thigh.',
                'Imagine your sit bones extending backward. Hold for 15 seconds and switch sides.'
              ],
              target: 'Hamstrings',
              stealth: 4,
              benefit: 'Stretches hamstrings shortened by sitting, reducing posterior pelvic tilt pressure.'
            },
            {
              name: 'Seated Figure-Four Stretch',
              steps: [
                'Place your right ankle on your left knee (if wearing a skirt, cross legs but keep thighs abducted).',
                'Keep your spine straight and lean slightly forward.',
                'Feel the stretch deep in your right glute, imagine exhaling the tension. Hold for 15s.'
              ],
              target: 'Piriformis, Glutes',
              stealth: 3,
              benefit: 'Releases deep gluteal pressure, preventing sciatica.'
            },
            {
              name: 'Seated Hip Flexor Micro-Stretch',
              steps: [
                'Sit sideways on the edge of the chair, extend the outer leg backward with toes touching the ground.',
                'Squeeze your glutes and slightly tilt your pelvis backward.',
                'Feel the stretch in the front of your thigh and groin, hold for 15 seconds.'
              ],
              target: 'Iliopsoas',
              stealth: 3,
              benefit: 'Targeted release of the hip flexors which get tightest during sitting, creating space for glute activation.'
            }
          ]
        },
        {
          id: 'private',
          name: 'Private Space / Home',
          desc: 'Can leave the chair, requires 1x1 meter space.',
          combo: '10s Good Mornings (Dynamic stretch) + 20s Standing Hip Extension (Strong activation)',
          exercises: [
            {
              name: 'Standing Hip Extension',
              steps: [
                'Stand facing a desk or wall, hold on for stability.',
                'Keep your torso stable without leaning forward, extend one leg straight back and lift it about 15-20 degrees.',
                'Imagine your heel is pushing open a heavy door, squeeze your glute at the top and hold for 2 seconds.'
              ],
              target: 'Gluteus Maximus',
              stealth: 2,
              benefit: 'Directly counteracts hip flexion, maximizing gluteus maximus contraction.'
            },
            {
              name: 'Standing Clamshell',
              steps: [
                'Hold onto a desk sideways, keep feet together and knees slightly bent.',
                'Keep your pelvis facing forward without rotating, open your outer knee outward.',
                'Feel the soreness in the upper side of your glute, imagine stretching a rubber band.'
              ],
              target: 'Gluteus Medius',
              stealth: 2,
              benefit: 'Strengthens pelvic stabilizers, improving walking sway and knee pressure.'
            },
            {
              name: 'Good Mornings (Bodyweight)',
              steps: [
                'Stand with feet shoulder-width apart, hands lightly behind ears or crossed over chest.',
                'Keep your back flat, push your hips back, and lean your torso forward to a 45-degree angle.',
                'Feel the stretch in your hamstrings, then use your glutes to push your body back to standing.'
              ],
              target: 'Glutes, Hamstrings',
              stealth: 1,
              benefit: 'Trains the hip hinge movement, re-establishing a glute-dominant firing pattern.'
            }
          ]
        },
        {
          id: 'pantry',
          name: 'Pantry / Corridor',
          desc: 'Standing movements, utilizing fragmented time.',
          combo: '15s Single Leg Stance (Stability start) + 15s Wall Sit Micro-Hold (Overall activation)',
          exercises: [
            {
              name: 'Wall Sit Micro-Hold',
              steps: [
                'Stand with your back against a wall, take a small step forward, slightly bend knees (30-45 degrees is enough).',
                'Keep your lower back flat against the wall, press your heels firmly into the ground.',
                'Imagine tearing the floor apart outward, feel the activation on both sides of your glutes. Hold for 15-30s.'
              ],
              target: 'Quads, Glutes',
              stealth: 3,
              benefit: 'Easy to do while waiting for coffee, isometric contraction quickly pumps blood and activates lower limbs.'
            },
            {
              name: 'Single Leg Stance',
              steps: [
                'In the corridor or pantry, shift your weight to one leg, slightly lift the other foot off the ground.',
                'Keep the supporting knee slightly bent (not locked), keep your pelvis level.',
                'Imagine the sole of your supporting foot gripping the ground like tree roots, activate the side of your glute to maintain stability.'
              ],
              target: 'Gluteus Medius, Core',
              stealth: 4,
              benefit: 'Extremely casual movement that effectively awakens the stabilizing gluteus medius.'
            },
            {
              name: 'Standing Pelvic Clocks',
              steps: [
                'Stand with feet shoulder-width apart, hands on hips or resting naturally.',
                'Slightly and slowly rotate your pelvis, imagine your pelvis is a bowl full of water, let the water circle the rim.',
                'Keep the movement small, focus on the micro-control of the hip joints.'
              ],
              target: 'Pelvic Stabilizers',
              stealth: 3,
              benefit: 'Lubricates hip joints, relieves pelvic stiffness caused by prolonged sitting.'
            }
          ]
        }
      ]
    },
    muscleMaster: {
      title: 'Muscle Master',
      tagline: 'Rhythm & Muscle',
      desc: 'An innovative rhythm game combining muscle training and music beats. No controller needed, just your camera!',
      proposal: 'Game Design Proposal',
      sections: {
        concept: '1. Core Concept & Value Proposition',
        mechanics: '2. Notes & Action Mechanics',
        levels: '3. Level Design',
        tips: '4. Muscle Training Tips',
        tech: '5. Technical Architecture'
      },
      game: {
        playNow: 'Play Now',
        selectLevel: 'Select Level',
        stage1: 'Stage 1: Lower Body',
        stage2: 'Stage 2: Core Shield',
        stage3: 'Stage 3: Fat Burn',
        level: 'Level',
        start: 'Start',
        score: 'Score',
        combo: 'Combo',
        gameOver: 'Game Over',
        perfect: 'PERFECT!',
        miss: 'MISS',
        squat: 'SQUAT',
        handsUp: 'HANDS UP',
        jumpJack: 'JUMP JACK',
        loading: 'Loading AI Engine...',
        cameraError: 'Camera access denied.'
      }
    },
    analyzingEnvironment: 'Analyzing Environment...',
    environmentDetected: 'Environment Detected',
    fitnessSuggestions: 'Fitness Suggestions',
    targetMuscle: 'Target Muscle',
    difficulty: 'Difficulty',
    safetyWarning: 'Safety Warning',
    instructions: 'Instructions',
    potentialConditions: 'Potential Conditions',
    actionPlans: {
      headForward: {
        name: 'Chin Tucks',
        desc: 'Sit or stand straight. Gently glide your head straight back, creating a "double chin". Do not tilt your head up or down. Hold for 5 seconds, then release.',
        duration: '3 sets of 10 reps • 3 mins'
      },
      kyphosis: {
        name: 'Wall Angels',
        desc: 'Stand with your back against a wall. Keep your head, upper back, and buttocks touching the wall. Raise your arms to 90 degrees, keeping elbows and wrists against the wall. Slowly slide your arms up and down.',
        duration: '3 sets of 12 reps • 5 mins'
      },
      shoulderImbalance: {
        name: 'Upper Trapezius Stretch',
        desc: 'Sit or stand tall. Gently pull your ear towards your shoulder on the non-elevated side until you feel a stretch on the elevated side. Hold for 30 seconds.',
        duration: '3 sets per side • 3 mins'
      },
      pelvicImbalance: {
        name: 'Side-Lying Hip Abduction',
        desc: 'Lie on your side with legs straight. Slowly lift your top leg towards the ceiling, keeping your pelvis stable. Lower it back down with control.',
        duration: '3 sets of 15 reps per side • 5 mins'
      },
      legAlignment: {
        name: 'Clamshells',
        desc: 'Lie on your side with knees bent at 90 degrees. Keep your feet together and lift your top knee as high as you can without rotating your pelvis. Lower slowly.',
        duration: '3 sets of 15 reps per side • 5 mins'
      }
    },
    conditions: {
      headForward: 'Cervical Spondylosis, Turtle Neck Syndrome',
      kyphosis: 'Kyphosis, Round Shoulders, Upper Cross Syndrome',
      shoulderImbalance: 'Scoliosis, Muscle Tension Dysphonia',
      pelvicImbalance: 'Pelvic Tilt, Lower Cross Syndrome, Gluteal Amnesia',
      legAlignment: 'Knee Osteoarthritis, IT Band Syndrome'
    },
    metrics: {
      headForward: {
        name: 'Head Forward Distance',
        desc: 'Horizontal distance between ear and shoulder center.',
        rec: 'Perform chin tucks and chest stretches.',
        cues: [
          'Imagine a string pulling the back of your head upwards.',
          'Gently tuck your chin towards your neck (double chin position).',
          'Hold for 5 seconds, repeat 10 times.'
        ]
      },
      kyphosis: {
        name: 'Thoracic Kyphosis',
        desc: 'Deviation of the upper torso from the vertical axis.',
        rec: 'Strengthen upper back muscles (rows, face pulls).',
        cues: [
          'Squeeze your shoulder blades together and down.',
          'Open your chest towards the ceiling.',
          'Perform "Wall Angels" to improve thoracic mobility.'
        ]
      },
      shoulderImbalance: {
        name: 'Shoulder Imbalance',
        desc: 'Height difference between left and right shoulders.',
        rec: 'Check for scoliosis or unilateral muscle tension.',
        cues: [
          'Relax the elevated shoulder and stretch the neck on that side.',
          'Strengthen the lower trapezius on the lower shoulder side.',
          'Avoid carrying heavy bags on only one shoulder.'
        ]
      },
      pelvicImbalance: {
        name: 'Pelvic Imbalance',
        desc: 'Height difference between left and right hip bones.',
        rec: 'May indicate leg length discrepancy or hip muscle imbalance.',
        cues: [
          'Perform side-lying hip abductions to strengthen glutes.',
          'Stretch the hip flexors on the higher hip side.',
          'Stand with weight evenly distributed on both feet.'
        ]
      },
      legAlignment: {
        name: 'Leg Alignment',
        desc: 'Alignment of knees relative to ankles.',
        rec: 'Consult a specialist for corrective orthotics or exercises.',
        cues: [
          'Strengthen the hip external rotators.',
          'Focus on knee tracking during squats (knees over toes).',
          'Check for foot over-pronation (flat feet).'
        ]
      }
    }
  },
  zh: {
    appName: 'AI形養師-股具肌',
    tagline: 'AI 驅動體態分析',
    description: '透過單張照片進行專業級身體排列評估。識別不平衡並獲得個性化的矯正指導。',
    newAnalysis: '開始分析',
    newAnalysisDesc: '使用相機或相簿開始新的體態評估。',
    history: '歷史記錄',
    historyDesc: '回顧過去的報告並追蹤您的進步。',
    getStarted: '立即開始',
    viewRecords: '查看記錄',
    privacyFirst: '隱私優先',
    privacyFirstDesc: '分析在本地進行。您的照片永遠不會離開您的設備。',
    medicalGrade: '醫療級標準',
    medicalGradeDesc: '基於臨床物理治療評估標準的算法。',
    smartGuidance: '智能指導',
    smartGuidanceDesc: '根據您的具體體態需求獲得量身定制的運動計劃。',
    backToHome: '返回首頁',
    saveReport: '儲存報告',
    copyKeywords: '複製關鍵字',
    keywordsCopied: '已複製！',
    searchKeywordsLabel: '搜尋關鍵字',
    excellentAlignment: '您的身體排列非常出色，偏差極小。',
    needsImprovement: '我們發現了一些可以透過矯正運動改善的區域。',
    viewLabel: '視圖',
    severityLabels: {
      Normal: '正常',
      Mild: '輕微',
      Moderate: '中度',
      Severe: '嚴重'
    },
    overallScore: '綜合評分',
    analysisSummary: '分析摘要',
    detailedMetrics: '詳細指標',
    recommendation: '建議',
    movementCues: '動作提示',
    actionPlan: '推薦行動計劃',
    actionPlanDesc: '根據您的結果，我們為您準備了簡單的日常練習，幫助改善您的體態。',
    startRoutine: '請教AI形養師',
    analysisHistory: '分析歷史',
    trackProgress: '追蹤您的體態改善進度。',
    scoreTrend: '評分趨勢',
    noRecords: '未找到分析記錄。',
    back: '返回',
    deleteConfirm: '您確定要刪除此記錄嗎？',
    analyzing: '正在分析體態...',
    initEngine: '正在初始化 AI 引擎...',
    noPerson: '圖中未檢測到人像。請確保全身可見且光線充足。',
    failAnalyze: '分析圖像失敗。請再試一次。',
    failInit: '初始化 AI 引擎失敗。',
    retry: '重試',
    captureReady: '準備拍攝',
    captureDesc: '請站在光線充足的地方。穿著緊身衣物以獲得更好的準確度。',
    openCamera: '開啟相機',
    uploadPhoto: '上傳照片',
    proTip: '專業提示',
    proTipDesc: (view: string) => `自然站立，雙腳與肩同寬。對於 ${view} 視圖，請確保全身都在畫面中。`,
    front: '正面',
    side: '側面',
    backView: '背面',
    combined: '綜合',
    analyzePhotos: '分析照片',
    provideAllPhotosWarning: '若能提供正面、側面和背面照片會更加準確。',
    privacy: '隱私政策',
    terms: '使用條款',
    support: '支援',
    educational: '© 2026 AI Shapist. 僅供教育用途。非醫療診斷。',
    reportSaved: '報告儲存成功！',
    reportSaveFailed: '儲存報告失敗。',
    everythingFitness: 'Everything Fitness',
    everythingFitnessDesc: '利用智能電話拍攝辦公室或家居四周環境，以 AI 生成選擇適合的家居用品，並建議相應鍛鍊肌肉的運動。',
    aiShapistChat: {
      title: 'AI形養師',
      desc: '「AI形養師——三位一體的智能體態管理專家」融合健身、物治、營養三大領域，AI形養師透過即時對話，為您打造專屬的運動與飲食計畫。從體態優化到預警就醫建議，我們讓健康管理變得更聰明、更安全。'
    },
    momo: {
      title: 'MoMo 微運動',
      tagline: '重啟臀肌與對抗久坐',
      desc: '專為久坐上班族與遠距工作者設計的微運動處方庫，針對長期久坐導致的「臀部神經斷連」進行重新啟動。',
      stealth: '隱蔽性',
      target: '解剖學目標',
      benefit: '活化效益',
      combo: '30秒微組合',
      scenarios: [
        {
          id: 'meeting',
          name: '高密閉會議',
          desc: '不離開椅子，身體外觀無明顯起伏，適合在他人注視下進行。',
          combo: '10秒隱形骨盆傾斜（放鬆下背） + 20秒坐姿臀肌等長收縮（重新活化）',
          exercises: [
            {
              name: '坐姿臀肌等長收縮',
              steps: [
                '雙腳平踏地面，挺直腰背。',
                '想像你的臀部正在夾住一張名片，用力收縮兩側臀大肌。',
                '保持收縮 5-10 秒，然後緩慢放鬆。重複 5 次。'
              ],
              target: '臀大肌',
              stealth: 5,
              benefit: '透過等長收縮喚醒神經連結，不改變關節角度，完全隱蔽。'
            },
            {
              name: '隱形骨盆傾斜',
              steps: [
                '坐在椅子前三分之一處。',
                '微微收縮下腹部，想像將肚臍拉向脊椎，讓骨盆微微後傾。',
                '感受坐骨在椅面上的微小滾動，停留 3 秒後放回中立位。'
              ],
              target: '核心肌群、多裂肌',
              stealth: 4,
              benefit: '緩解久坐造成的下背僵硬，輕微伸展緊繃的豎脊肌。'
            },
            {
              name: '腳跟微抬',
              steps: [
                '雙腳平放，大腿與小腿呈90度。',
                '雙腳腳跟微微抬起離地 1 公分。',
                '同時將大腿微微向外旋轉（膝蓋不動），感受臀部側邊的微小張力。'
              ],
              target: '臀中肌',
              stealth: 5,
              benefit: '啟動負責穩定的臀中肌，對抗久坐時大腿內收的慣性。'
            }
          ]
        },
        {
          id: 'openOffice',
          name: '開放式辦公區',
          desc: '在位子上可進行小幅度拉伸或肌肉收縮，不影響他人。',
          combo: '15秒坐姿髂腰肌微展（解除抑制） + 15秒坐姿單腿伸展（平衡張力）',
          exercises: [
            {
              name: '坐姿單腿伸展',
              steps: [
                '坐在椅子邊緣，一腿伸直，腳跟著地，腳尖朝上。',
                '保持背部挺直，上半身微微前傾，直到大腿後側有拉扯感。',
                '想像你的坐骨正向後方延伸。停留 15 秒換邊。'
              ],
              target: '膕繩肌',
              stealth: 4,
              benefit: '伸展因久坐而縮短的腿後肌群，減少骨盆後傾壓力。'
            },
            {
              name: '坐姿鴿子式微調',
              steps: [
                '將右腳踝放在左膝上（若穿裙裝可改為雙腿交叉但保持大腿外展）。',
                '挺直脊椎，身體微向前傾。',
                '感受右側臀部深處的伸展，想像將緊繃感隨呼吸吐出。'
              ],
              target: '梨狀肌、臀大肌',
              stealth: 3,
              benefit: '釋放深層臀部壓力，預防坐骨神經痛。'
            },
            {
              name: '坐姿髂腰肌微展',
              steps: [
                '側坐在椅子邊緣，將外側的腿向後伸直，腳尖點地。',
                '收緊臀部，將骨盆微微後傾。',
                '感受大腿前側與鼠蹊部的拉伸感，停留 15 秒。'
              ],
              target: '髂腰肌',
              stealth: 3,
              benefit: '針對性解除久坐最容易緊繃的髖屈肌，為臀肌發力創造空間。'
            }
          ]
        },
        {
          id: 'private',
          name: '私人空間/居家',
          desc: '可離開椅子，需要 1x1 米的空間。',
          combo: '10秒早安式微屈（動態伸展） + 20秒站姿髖伸展（強力活化）',
          exercises: [
            {
              name: '站姿髖伸展',
              steps: [
                '面對桌子或牆壁站立，雙手扶穩。',
                '保持軀幹穩定不前傾，將單腿向後伸直抬起約 15-20 度。',
                '想像腳跟正在推開一扇沉重的門，在最高點夾緊臀部停留 2 秒。'
              ],
              target: '臀大肌',
              stealth: 2,
              benefit: '直接對抗髖屈曲，最大化收縮臀大肌。'
            },
            {
              name: '蚌殼式站立版',
              steps: [
                '側扶桌面，雙腳併攏微屈膝。',
                '保持骨盆朝前不旋轉，將外側膝蓋向外打開。',
                '感受臀部側上方的酸脹感，想像臀側有一條橡皮筋被拉開。'
              ],
              target: '臀中肌',
              stealth: 2,
              benefit: '強化骨盆穩定肌群，改善走路時的搖晃與膝蓋壓力。'
            },
            {
              name: '早安式微屈',
              steps: [
                '雙腳與肩同寬，雙手輕放耳後或交叉於胸前。',
                '保持背部平直，臀部向後推，上半身前傾至與地面呈 45 度。',
                '感受大腿後側拉伸後，用臀部力量將身體推回站姿。'
              ],
              target: '臀大肌、膕繩肌',
              stealth: 1,
              benefit: '訓練髖鉸鏈動作，重新建立臀部主導的發力模式。'
            }
          ]
        },
        {
          id: 'pantry',
          name: '茶水間/走廊',
          desc: '站姿動作，利用瑣碎時間進行。',
          combo: '15秒單腳站立平衡（穩定啟動） + 15秒靠牆微深蹲（整體活化）',
          exercises: [
            {
              name: '靠牆微深蹲',
              steps: [
                '背靠牆面，雙腳往前走一小步，微屈膝（約 30-45 度即可，不需到 90 度）。',
                '將下背部平貼牆面，腳跟用力踩地。',
                '想像把地板向外撕開，感受臀部兩側的發力。停留 15-30 秒。'
              ],
              target: '股四頭肌、臀大肌',
              stealth: 3,
              benefit: '在等咖啡時可輕鬆進行，等長收縮能快速充血並活化下肢。'
            },
            {
              name: '單腳站立平衡',
              steps: [
                '在走廊或茶水間，將重心轉移到單腳，另一腳微抬離地。',
                '支撐腳的膝蓋微彎不鎖死，保持骨盆水平。',
                '想像支撐腳的腳底像樹根一樣抓住地面，臀部側邊發力維持穩定。'
              ],
              target: '臀中肌、核心',
              stealth: 4,
              benefit: '動作極度日常，卻能有效喚醒負責穩定的臀中肌。'
            },
            {
              name: '站姿骨盆畫圓',
              steps: [
                '雙腳與肩同寬站立，雙手可插腰或自然下垂。',
                '輕微且緩慢地轉動骨盆，想像骨盆是一個裝滿水的碗，讓水沿著邊緣繞圈。',
                '動作幅度要小，專注於髖關節的微小控制。'
              ],
              target: '骨盆周圍小肌群',
              stealth: 3,
              benefit: '潤滑髖關節，解除久坐造成的骨盆僵硬。'
            }
          ]
        }
      ]
    },
    muscleMaster: {
      title: '練肌之達人',
      tagline: '節奏與肌肉的碰撞',
      desc: '結合「肌肉鍛鍊」與「音樂節拍」的創新運動節奏遊戲。不需控制器，用手機鏡頭捕捉你的熱血動作！',
      proposal: '遊戲企劃書',
      sections: {
        concept: '1. 🎮 遊戲核心概念與價值主張',
        mechanics: '2. 🎵 音符與動作判定機制',
        levels: '3. 🗺️ 關卡設計',
        tips: '4. 💡 肌肉鍛鍊衛教提示',
        tech: '5. 💻 技術實現邏輯'
      },
      game: {
        playNow: '立即遊玩',
        selectLevel: '選擇關卡',
        stage1: 'Stage 1: 覺醒的下肢',
        stage2: 'Stage 2: 核心之盾',
        stage3: 'Stage 3: 燃脂大師',
        level: '關卡',
        start: '開始遊戲',
        score: '分數',
        combo: '連擊',
        gameOver: '遊戲結束',
        perfect: '完美!',
        miss: '失誤',
        squat: '深蹲',
        handsUp: '高舉雙手',
        jumpJack: '開合跳',
        loading: '正在載入 AI 引擎...',
        cameraError: '無法存取相機。'
      }
    },
    analyzingEnvironment: '正在分析環境...',
    environmentDetected: '偵測到的環境',
    fitnessSuggestions: '健身建議',
    targetMuscle: '目標肌肉',
    difficulty: '難度',
    safetyWarning: '安全警告',
    instructions: '步驟說明',
    potentialConditions: '潛在疾病風險',
    actionPlans: {
      headForward: {
        name: '收下巴運動 (Chin Tucks)',
        desc: '挺直坐姿或站姿。輕輕將頭部平移向後收，擠出「雙下巴」。注意不要上下傾斜頭部。保持 5 秒鐘，然後放鬆。',
        duration: '3 組，每組 10 次 • 3 分鐘'
      },
      kyphosis: {
        name: '牆上天使 (Wall Angels)',
        desc: '背靠牆站立。讓後腦勺、上背部和臀部貼緊牆面。雙臂抬起呈 90 度，手肘和手腕貼牆。緩慢地將雙臂沿著牆面向上滑動再向下滑動。',
        duration: '3 組，每組 12 次 • 5 分鐘'
      },
      shoulderImbalance: {
        name: '上斜方肌伸展 (Upper Trapezius Stretch)',
        desc: '挺直坐姿或站姿。將頭部輕輕偏向較低的一側肩膀，直到感覺較高一側的頸部有伸展感。保持 30 秒。',
        duration: '每側 3 組 • 3 分鐘'
      },
      pelvicImbalance: {
        name: '側臥髖外展 (Side-Lying Hip Abduction)',
        desc: '側臥，雙腿伸直。保持骨盆穩定，緩慢將上方腿向天花板方向抬起。控制速度慢慢放下。',
        duration: '每側 3 組，每組 15 次 • 5 分鐘'
      },
      legAlignment: {
        name: '蚌殼式 (Clamshells)',
        desc: '側臥，雙膝彎曲 90 度。雙腳併攏，盡可能抬高上方的膝蓋，同時保持骨盆不翻轉。緩慢放下。',
        duration: '每側 3 組，每組 15 次 • 5 分鐘'
      }
    },
    conditions: {
      headForward: '頸椎病、烏龜頸症候群',
      kyphosis: '駝背、圓肩、上交叉症候群',
      shoulderImbalance: '脊柱側彎、單側肌肉勞損',
      pelvicImbalance: '骨盆歪斜、下交叉症候群、臀肌失憶症',
      legAlignment: '膝關節退化、髂脛束症候群 (ITBS)'
    },
    metrics: {
      headForward: {
        name: '頭部前傾距離',
        desc: '耳朵與肩膀中心點的水平距離。',
        rec: '進行收下巴運動和胸部伸展。',
        cues: [
          '想像有一根繩子將你的後腦勺向上拉。',
          '輕輕將下巴收向脖子（做出雙下巴的動作）。',
          '保持 5 秒鐘，重複 10 次。'
        ]
      },
      kyphosis: {
        name: '胸椎後凸 (圓肩)',
        desc: '上身軀幹偏離垂直軸的程度。',
        rec: '加強上背部肌肉（如划船、面拉）。',
        cues: [
          '向後向下擠壓肩胛骨。',
          '向天花板方向打開胸腔。',
          '進行「牆上天使」運動以改善胸椎活動度。'
        ]
      },
      shoulderImbalance: {
        name: '高低肩',
        desc: '左右肩膀之間的高度差。',
        rec: '檢查是否有脊椎側彎或單側肌肉緊繃。',
        cues: [
          '放鬆較高的一側肩膀，並伸展該側的頸部。',
          '加強較低一側肩膀的下斜方肌。',
          '避免長期單肩背負重物。'
        ]
      },
      pelvicImbalance: {
        name: '骨盆歪斜',
        desc: '左右髖骨之間的高度差。',
        rec: '可能表示長短腳或臀部肌肉不平衡。',
        cues: [
          '進行側臥抬腿以加強臀中肌。',
          '伸展較高一側骨盆的髖屈肌。',
          '站立時確保重心均勻分佈在雙腳。'
        ]
      },
      legAlignment: {
        name: '腿部排列',
        desc: '膝蓋相對於腳踝的排列情況。',
        rec: '諮詢專家進行矯正鞋墊或運動指導。',
        cues: [
          '加強臀部外旋肌群。',
          '深蹲時注意膝蓋對準腳尖。',
          '檢查是否有足部過度內翻（扁平足）。'
        ]
      }
    }
  }
};
