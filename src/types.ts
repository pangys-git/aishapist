export type Severity = 'Normal' | 'Mild' | 'Moderate' | 'Severe';

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PostureMetric {
  key?: string;
  name: string;
  value: number;
  unit: string;
  severity: Severity;
  description: string;
  recommendation: string;
  searchKeywords?: string;
  cues?: string[];
}

export interface UserInfo {
  height?: number; // cm
  weight?: number; // kg
  waist?: number; // cm
  hip?: number; // cm
}

export interface AnalysisResult {
  id: string;
  date: string;
  score: number;
  metrics: PostureMetric[];
  imageUrl: string;
  landmarks: Landmark[];
  view: 'Front' | 'Side' | 'Back' | 'Combined';
  actionPlan?: Exercise[];
  potentialConditions?: string[];
  images?: { Front?: string; Side?: string; Back?: string };
  allLandmarks?: { Front?: Landmark[]; Side?: Landmark[]; Back?: Landmark[] };
  userInfo?: UserInfo;
}

export interface UserPlan {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  imageUrl?: string;
}

export interface FitnessSuggestion {
  item_name: string;
  target_muscle: string;
  exercise_name: string;
  difficulty_level: string;
  safety_warning: string;
  instructions: string[];
}

export interface EverythingFitnessResult {
  environment_detected: string;
  fitness_suggestions: FitnessSuggestion[];
}
