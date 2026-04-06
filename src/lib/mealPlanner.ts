import { FoodItem, foodDatabase } from '@/data/foodDatabase';
import { NutritionResult } from '@/lib/nutrition';

export interface Meal {
  name: string;
  foods: { food: FoodItem; portionG: number }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealPlan {
  label: string;
  meals: { slot: string; meal: Meal }[];
}

function pickFoods(filters: Partial<Pick<FoodItem, 'region' | 'category'>>[], count: number): FoodItem[] {
  const pool = foodDatabase.filter(f =>
    filters.some(fi => Object.entries(fi).every(([k, v]) => f[k as keyof FoodItem] === v))
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildMeal(name: string, foods: { food: FoodItem; portionG: number }[]): Meal {
  return {
    name,
    foods,
    totalCalories: Math.round(foods.reduce((s, f) => s + (f.food.caloriesPer100g * f.portionG) / 100, 0)),
    totalProtein: Math.round(foods.reduce((s, f) => s + (f.food.protein * f.portionG) / 100, 0)),
    totalCarbs: Math.round(foods.reduce((s, f) => s + (f.food.carbs * f.portionG) / 100, 0)),
    totalFat: Math.round(foods.reduce((s, f) => s + (f.food.fat * f.portionG) / 100, 0)),
  };
}

export function generateMealPlans(result: NutritionResult): MealPlan[] {
  const calTarget = result.targetCalories;

  const indianPlan: MealPlan = {
    label: 'Indian Diet',
    meals: [
      {
        slot: 'Breakfast',
        meal: buildMeal('Poha with Raita', [
          { food: foodDatabase.find(f => f.name === 'Poha')!, portionG: 200 },
          { food: foodDatabase.find(f => f.name === 'Raita (Curd)')!, portionG: 100 },
          { food: foodDatabase.find(f => f.name === 'Banana')!, portionG: 120 },
        ]),
      },
      {
        slot: 'Lunch',
        meal: buildMeal('Dal Roti with Sabzi', [
          { food: foodDatabase.find(f => f.name === 'Dal (Toor)')!, portionG: 200 },
          { food: foodDatabase.find(f => f.name === 'Roti (Wheat)')!, portionG: 120 },
          { food: foodDatabase.find(f => f.name === 'Palak Sabzi')!, portionG: 150 },
        ]),
      },
      {
        slot: 'Snack',
        meal: buildMeal('Paneer & Almonds', [
          { food: foodDatabase.find(f => f.name === 'Paneer')!, portionG: 80 },
          { food: foodDatabase.find(f => f.name === 'Almonds')!, portionG: 20 },
        ]),
      },
      {
        slot: 'Dinner',
        meal: buildMeal('Rajma Rice', [
          { food: foodDatabase.find(f => f.name === 'Rajma (Kidney Bean Curry)')!, portionG: 200 },
          { food: foodDatabase.find(f => f.name === 'Basmati Rice')!, portionG: 180 },
        ]),
      },
    ],
  };

  const globalPlan: MealPlan = {
    label: 'Global Diet',
    meals: [
      {
        slot: 'Breakfast',
        meal: buildMeal('Oats & Eggs', [
          { food: foodDatabase.find(f => f.name === 'Oats (Rolled)')!, portionG: 60 },
          { food: foodDatabase.find(f => f.name === 'Eggs (Boiled)')!, portionG: 100 },
          { food: foodDatabase.find(f => f.name === 'Banana')!, portionG: 120 },
        ]),
      },
      {
        slot: 'Lunch',
        meal: buildMeal('Chicken & Quinoa Bowl', [
          { food: foodDatabase.find(f => f.name === 'Chicken Breast (Grilled)')!, portionG: 150 },
          { food: foodDatabase.find(f => f.name === 'Quinoa (Cooked)')!, portionG: 180 },
          { food: foodDatabase.find(f => f.name === 'Broccoli')!, portionG: 100 },
        ]),
      },
      {
        slot: 'Snack',
        meal: buildMeal('Greek Yogurt & Almonds', [
          { food: foodDatabase.find(f => f.name === 'Greek Yogurt')!, portionG: 150 },
          { food: foodDatabase.find(f => f.name === 'Almonds')!, portionG: 25 },
        ]),
      },
      {
        slot: 'Dinner',
        meal: buildMeal('Salmon & Sweet Potato', [
          { food: foodDatabase.find(f => f.name === 'Salmon (Baked)')!, portionG: 150 },
          { food: foodDatabase.find(f => f.name === 'Sweet Potato')!, portionG: 200 },
          { food: foodDatabase.find(f => f.name === 'Spinach (Raw)')!, portionG: 80 },
        ]),
      },
    ],
  };

  return [indianPlan, globalPlan];
}
