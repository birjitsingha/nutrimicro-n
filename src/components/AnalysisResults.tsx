import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MealSlot } from '@/components/StepFoodLog';
import { UserProfile, calculateNutrition } from '@/lib/nutrition';

interface AnalysisResultsProps {
  profile: UserProfile;
  userName: string;
  slots: MealSlot[];
  onEdit: () => void;
}

const COLORS = ['hsl(152, 44%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(210, 80%, 56%)'];

const AnalysisResults = ({ profile, userName, slots, onEdit }: AnalysisResultsProps) => {
  const totals = slots.reduce(
    (acc, slot) => {
      slot.entries.forEach(e => {
        const f = e.portionG / 100;
        acc.calories += e.food.caloriesPer100g * f;
        acc.protein += e.food.protein * f;
        acc.carbs += e.food.carbs * f;
        acc.fat += e.food.fat * f;
        acc.iron += (e.food.micronutrients.iron || 0) * f;
        acc.calcium += (e.food.micronutrients.calcium || 0) * f;
        acc.vitaminC += (e.food.micronutrients.vitaminC || 0) * f;
        acc.vitaminD += (e.food.micronutrients.vitaminD || 0) * f;
        acc.vitaminB12 += (e.food.micronutrients.vitaminB12 || 0) * f;
        acc.zinc += (e.food.micronutrients.zinc || 0) * f;
        acc.folate += (e.food.micronutrients.folate || 0) * f;
        acc.potassium += (e.food.micronutrients.potassium || 0) * f;
        acc.fiber += (e.food.micronutrients.fiber || 0) * f;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, calcium: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, zinc: 0, folate: 0, potassium: 0, fiber: 0 }
  );

  const rounded = {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  };

  const recommended = calculateNutrition(profile);
  const isFemale = profile.gender === 'female';

  const macroData = [
    { name: 'Protein', value: rounded.protein * 4, grams: rounded.protein, rec: recommended.protein },
    { name: 'Carbs', value: rounded.carbs * 4, grams: rounded.carbs, rec: recommended.carbs },
    { name: 'Fat', value: rounded.fat * 9, grams: rounded.fat, rec: recommended.fat },
  ];

  const micronutrients = [
    { name: 'Iron', value: Math.round(totals.iron * 10) / 10, rda: isFemale ? 18 : 8, unit: 'mg' },
    { name: 'Calcium', value: Math.round(totals.calcium), rda: 1000, unit: 'mg' },
    { name: 'Vitamin C', value: Math.round(totals.vitaminC), rda: isFemale ? 75 : 90, unit: 'mg' },
    { name: 'Vitamin D', value: Math.round(totals.vitaminD * 10) / 10, rda: 15, unit: 'µg' },
    { name: 'Vitamin B12', value: Math.round(totals.vitaminB12 * 10) / 10, rda: 2.4, unit: 'µg' },
    { name: 'Zinc', value: Math.round(totals.zinc * 10) / 10, rda: isFemale ? 8 : 11, unit: 'mg' },
    { name: 'Folate', value: Math.round(totals.folate), rda: 400, unit: 'µg' },
    { name: 'Potassium', value: Math.round(totals.potassium), rda: isFemale ? 2600 : 3400, unit: 'mg' },
    { name: 'Fiber', value: Math.round(totals.fiber * 10) / 10, rda: isFemale ? 25 : 38, unit: 'g' },
  ];

  const caloriePercent = Math.min(100, Math.round((rounded.calories / recommended.targetCalories) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {userName ? `${userName}'s Analysis` : 'Analysis'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's how your logged food stacks up</p>
        </div>
        <button onClick={onEdit} className="text-sm font-medium text-primary hover:underline">
          Edit Foods
        </button>
      </div>

      {/* Calorie overview */}
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Calories</div>
        <div className="text-4xl font-display font-bold text-foreground">{rounded.calories}</div>
        <div className="text-sm text-muted-foreground mt-1">of {recommended.targetCalories} kcal recommended</div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
          <motion.div
            className={`h-full rounded-full ${caloriePercent > 110 ? 'bg-destructive' : 'bg-primary'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(caloriePercent, 100)}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1.5">{caloriePercent}% of daily target</div>
      </div>

      {/* Macros */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Macronutrients</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {macroData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3 w-full">
            {macroData.map((m, i) => {
              const pct = m.rec > 0 ? Math.min(100, Math.round((m.grams / m.rec) * 100)) : 0;
              return (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
                      {m.name}
                    </span>
                    <span className="text-muted-foreground">{m.grams}g <span className="text-xs">/ {m.rec}g</span></span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Per-meal breakdown */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-3">Meal Breakdown</h3>
        <div className="space-y-2.5">
          {slots.filter(s => s.entries.length > 0).map(slot => {
            const sc = slot.entries.reduce((s, e) => s + (e.food.caloriesPer100g * e.portionG) / 100, 0);
            return (
              <div key={slot.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{slot.label}</div>
                  <div className="text-xs text-muted-foreground">{slot.entries.length} item{slot.entries.length !== 1 ? 's' : ''}</div>
                </div>
                <span className="text-sm font-semibold text-primary">{Math.round(sc)} kcal</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Micronutrients */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-3">Micronutrient Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {micronutrients.map(m => {
            const pct = Math.round((m.value / m.rda) * 100);
            const status = pct >= 80 ? 'sufficient' : pct >= 40 ? 'moderate' : 'low';
            return (
              <div key={m.name} className="rounded-lg bg-muted/50 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">{m.name}</div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === 'sufficient' ? 'bg-primary/15 text-primary' :
                    status === 'moderate' ? 'bg-warning/15 text-warning' :
                    'bg-destructive/15 text-destructive'
                  }`}>
                    {status === 'sufficient' ? '✓ Good' : status === 'moderate' ? '~ Fair' : '↓ Low'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.value} / {m.rda} {m.unit} ({pct}%)</div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
                  <motion.div
                    className={`h-full rounded-full ${
                      status === 'sufficient' ? 'bg-primary' :
                      status === 'moderate' ? 'bg-warning' :
                      'bg-destructive'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
