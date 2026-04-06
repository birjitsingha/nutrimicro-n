export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type Goal = 'maintain' | 'lose' | 'gain';

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface NutritionResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  athlete: 1.9,
};

export function calculateBMR(profile: UserProfile): number {
  const base = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  return profile.gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * activityFactors[activity]);
}

export function calculateNutrition(profile: UserProfile): NutritionResult {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  let targetCalories: number;
  let proteinPerKg: number;

  switch (profile.goal) {
    case 'lose':
      targetCalories = tdee - 400;
      proteinPerKg = 1.6;
      break;
    case 'gain':
      targetCalories = tdee + 400;
      proteinPerKg = 2.0;
      break;
    default:
      targetCalories = tdee;
      proteinPerKg = 1.4;
  }

  const protein = Math.round(proteinPerKg * profile.weight);
  const fatCalories = targetCalories * 0.25;
  const fat = Math.round(fatCalories / 9);
  const carbCalories = targetCalories - protein * 4 - fat * 9;
  const carbs = Math.round(carbCalories / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories: Math.round(targetCalories),
    protein,
    carbs: Math.max(carbs, 0),
    fat,
  };
}

export interface MicronutrientStatus {
  name: string;
  unit: string;
  rda: number;
  estimated: number;
  status: 'sufficient' | 'moderate' | 'low';
}

export function estimateMicronutrients(profile: UserProfile): MicronutrientStatus[] {
  const isFemale = profile.gender === 'female';
  return [
    { name: 'Iron', unit: 'mg', rda: isFemale ? 18 : 8, estimated: isFemale ? 12 : 10, status: isFemale ? 'moderate' : 'sufficient' },
    { name: 'Calcium', unit: 'mg', rda: 1000, estimated: 700, status: 'moderate' },
    { name: 'Vitamin D', unit: 'µg', rda: 15, estimated: 5, status: 'low' },
    { name: 'Vitamin B12', unit: 'µg', rda: 2.4, estimated: 2.0, status: 'moderate' },
    { name: 'Vitamin C', unit: 'mg', rda: isFemale ? 75 : 90, estimated: 60, status: 'moderate' },
  ];
}
