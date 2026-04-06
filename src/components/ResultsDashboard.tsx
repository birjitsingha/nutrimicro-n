import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { NutritionResult, UserProfile, MicronutrientStatus, estimateMicronutrients } from '@/lib/nutrition';
import { generateMealPlans, MealPlan } from '@/lib/mealPlanner';
import { useState } from 'react';

interface ResultsDashboardProps {
  profile: UserProfile;
  result: NutritionResult;
  onEdit: () => void;
}

const COLORS = ['hsl(152, 44%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(210, 80%, 56%)'];

const ResultsDashboard = ({ profile, result, onEdit }: ResultsDashboardProps) => {
  const micronutrients = estimateMicronutrients(profile);
  const mealPlans = generateMealPlans(result);
  const [activePlan, setActivePlan] = useState(0);

  const macroData = [
    { name: 'Protein', value: result.protein * 4, grams: result.protein },
    { name: 'Carbs', value: result.carbs * 4, grams: result.carbs },
    { name: 'Fat', value: result.fat * 9, grams: result.fat },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <motion.div {...fadeIn} className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Your Nutrition Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">Personalized recommendations based on your profile</p>
        </div>
        <button
          onClick={onEdit}
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit Profile
        </button>
      </div>

      {/* Calorie Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'BMR', value: `${result.bmr}`, unit: 'kcal' },
          { label: 'TDEE', value: `${result.tdee}`, unit: 'kcal' },
          { label: 'Target', value: `${result.targetCalories}`, unit: 'kcal' },
        ].map(item => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
            <div className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">{item.value}</div>
            <div className="text-xs text-muted-foreground">{item.unit}</div>
          </div>
        ))}
      </div>

      {/* Macros */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Macronutrients</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {macroData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3 w-full">
            {macroData.map((m, i) => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
                    {m.name}
                  </span>
                  <span className="text-muted-foreground">{m.grams}g</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(m.value / result.targetCalories) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Micronutrients */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Micronutrient Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {micronutrients.map(m => (
            <div key={m.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <div>
                <div className="text-sm font-medium text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">RDA: {m.rda}{m.unit}</div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                m.status === 'sufficient' ? 'bg-primary/15 text-primary' :
                m.status === 'moderate' ? 'bg-warning/15 text-warning' :
                'bg-destructive/15 text-destructive'
              }`}>
                {m.status === 'sufficient' ? '✓ Sufficient' : m.status === 'moderate' ? '~ Moderate' : '↓ Low'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plans */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Meal Suggestions</h3>
        <div className="flex gap-2 mb-4">
          {mealPlans.map((plan, i) => (
            <button
              key={plan.label}
              onClick={() => setActivePlan(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activePlan === i
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {plan.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {mealPlans[activePlan].meals.map(({ slot, meal }) => (
            <div key={slot} className="rounded-lg border border-border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{slot}</div>
                  <div className="font-medium text-foreground">{meal.name}</div>
                </div>
                <span className="text-sm font-semibold text-primary">{meal.totalCalories} kcal</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {meal.foods.map(f => (
                  <span key={f.food.name} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                    {f.food.name} · {f.portionG}g
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>P: {meal.totalProtein}g</span>
                <span>C: {meal.totalCarbs}g</span>
                <span>F: {meal.totalFat}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;
