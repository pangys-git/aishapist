import { Landmark, PostureMetric, Severity } from '../types';
import { translations } from '../constants/translations';

export const calculateAngle = (p1: Landmark, p2: Landmark, p3: Landmark): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

export const calculateDistance = (p1: Landmark, p2: Landmark): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getSeverity = (value: number, thresholds: { mild: number; moderate: number; severe: number }, inverse = false): Severity => {
  if (!inverse) {
    if (value >= thresholds.severe) return 'Severe';
    if (value >= thresholds.moderate) return 'Moderate';
    if (value >= thresholds.mild) return 'Mild';
    return 'Normal';
  } else {
    if (value <= thresholds.severe) return 'Severe';
    if (value <= thresholds.moderate) return 'Moderate';
    if (value <= thresholds.mild) return 'Mild';
    return 'Normal';
  }
};

export const analyzePosture = (landmarks: Landmark[], view: 'Front' | 'Side' | 'Back', lang: 'en' | 'zh' = 'en'): PostureMetric[] => {
  const metrics: PostureMetric[] = [];
  const t = translations[lang].metrics;

  if (view === 'Side') {
    // Forward Head Posture (Ear to Shoulder)
    const ear = landmarks[7] || landmarks[8];
    const shoulder = landmarks[11] || landmarks[12];
    
    if (ear && shoulder) {
      const dist = Math.abs(ear.x - shoulder.x) * 100;
      const severity = getSeverity(dist, { mild: 2, moderate: 4, severe: 6 });
      
      metrics.push({
        key: 'headForward',
        name: t.headForward.name,
        value: parseFloat(dist.toFixed(1)),
        unit: 'cm',
        severity,
        description: t.headForward.desc,
        recommendation: severity === 'Normal' ? (lang === 'en' ? 'Maintain good habits.' : '保持良好習慣。') : t.headForward.rec,
        searchKeywords: lang === 'en' ? 'Forward Head Posture Exercises' : '頭部前傾 矯正運動',
        cues: t.headForward.cues
      });
    }

    // Kyphosis approximation
    const hip = landmarks[23] || landmarks[24];
    if (shoulder && hip) {
      const angle = calculateAngle({ x: shoulder.x, y: shoulder.y - 0.1 }, shoulder, hip);
      const dev = Math.abs(180 - angle);
      const severity = getSeverity(dev, { mild: 5, moderate: 10, severe: 15 });
      
      metrics.push({
        key: 'kyphosis',
        name: t.kyphosis.name,
        value: parseFloat(dev.toFixed(1)),
        unit: '°',
        severity,
        description: t.kyphosis.desc,
        recommendation: severity === 'Normal' ? (lang === 'en' ? 'Keep it up!' : '做得好！') : t.kyphosis.rec,
        searchKeywords: lang === 'en' ? 'Kyphosis Correction Exercises' : '圓肩駝背 矯正運動',
        cues: t.kyphosis.cues
      });
    }
  }

  if (view === 'Front') {
    // Shoulder Level
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    if (leftShoulder && rightShoulder) {
      const diff = Math.abs(leftShoulder.y - rightShoulder.y) * 100;
      const severity = getSeverity(diff, { mild: 0.5, moderate: 1.5, severe: 3 });
      
      metrics.push({
        key: 'shoulderImbalance',
        name: t.shoulderImbalance.name,
        value: parseFloat(diff.toFixed(1)),
        unit: 'cm',
        severity,
        description: t.shoulderImbalance.desc,
        recommendation: severity === 'Normal' ? (lang === 'en' ? 'Balanced shoulders.' : '肩膀平衡。') : t.shoulderImbalance.rec,
        searchKeywords: lang === 'en' ? 'Uneven Shoulders Exercises' : '高低肩 矯正運動',
        cues: t.shoulderImbalance.cues
      });
    }

    // Pelvic Tilt (Front)
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    if (leftHip && rightHip) {
      const diff = Math.abs(leftHip.y - rightHip.y) * 100;
      const severity = getSeverity(diff, { mild: 0.5, moderate: 1.5, severe: 3 });
      
      metrics.push({
        key: 'pelvicImbalance',
        name: t.pelvicImbalance.name,
        value: parseFloat(diff.toFixed(1)),
        unit: 'cm',
        severity,
        description: t.pelvicImbalance.desc,
        recommendation: severity === 'Normal' ? (lang === 'en' ? 'Balanced pelvis.' : '骨盆平衡。') : t.pelvicImbalance.rec,
        searchKeywords: lang === 'en' ? 'Pelvic Tilt Correction' : '骨盆歪斜 矯正運動',
        cues: t.pelvicImbalance.cues
      });
    }

    // Leg Alignment
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    if (leftKnee && rightKnee && leftAnkle && rightAnkle) {
      const kneeDist = Math.abs(leftKnee.x - rightKnee.x);
      const ankleDist = Math.abs(leftAnkle.x - rightAnkle.x);
      const ratio = kneeDist / (ankleDist || 0.01);
      
      let severity: Severity = 'Normal';
      let name = t.legAlignment.name;
      let val = ratio;
      let keywords = lang === 'en' ? 'Leg Alignment Exercises' : '腿部排列 矯正運動';
      if (ratio < 0.5) {
        severity = getSeverity(0.5 - ratio, { mild: 0.1, moderate: 0.2, severe: 0.3 });
        name = lang === 'en' ? 'X-Leg (Genu Valgum)' : 'X型腿 (膝外翻)';
        keywords = lang === 'en' ? 'Knock Knees Exercises' : 'X型腿 矯正運動';
      } else if (ratio > 1.5) {
        severity = getSeverity(ratio - 1.5, { mild: 0.2, moderate: 0.5, severe: 1.0 });
        name = lang === 'en' ? 'O-Leg (Genu Varum)' : 'O型腿 (膝內翻)';
        keywords = lang === 'en' ? 'Bow Legs Exercises' : 'O型腿 矯正運動';
      }

      metrics.push({
        key: 'legAlignment',
        name,
        value: parseFloat(val.toFixed(2)),
        unit: 'ratio',
        severity,
        description: t.legAlignment.desc,
        recommendation: severity === 'Normal' ? (lang === 'en' ? 'Good leg alignment.' : '腿部排列良好。') : t.legAlignment.rec,
        searchKeywords: keywords,
        cues: t.legAlignment.cues
      });
    }
  }

  return metrics;
};
