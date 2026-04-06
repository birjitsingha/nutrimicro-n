import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { UserProfile, calculateBMR, calculateTDEE } from '@/lib/nutrition';
import { AdvancedData } from './StepAdvanced';

interface TDEEResultsProps {
  profile: UserProfile;
  userName: string;
  advanced?: AdvancedData;
  onRecalculate: () => void;
}

const COLORS = ['hsl(210, 80%, 56%)', 'hsl(152, 44%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(340, 65%, 55%)'];

const educationalCards = [
  {
    title: 'BMR',
    full: 'Basal Metabolic Rate',
    icon: '🫀',
    share: '~60–70%',
    description: 'Calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell repair. This is the energy you\'d burn lying still all day.',
  },
  {
    title: 'NEAT',
    full: 'Non-Exercise Activity Thermogenesis',
    icon: '🚶',
    share: '~15–30%',
    description: 'Calories burned through everyday movement that isn\'t exercise — walking, typing, fidgeting, standing, cooking. Often the most variable component of TDEE.',
  },
  {
    title: 'EAT',
    full: 'Exercise Activity Thermogenesis',
    icon: '🏋️',
    share: '~5–15%',
    description: 'Calories burned during structured exercise and sports — gym sessions, running, swimming, yoga. Surprisingly, it\'s usually a smaller portion of total daily burn.',
  },
  {
    title: 'TEF',
    full: 'Thermic Effect of Food',
    icon: '🍽️',
    share: '~10%',
    description: 'Calories your body uses to digest, absorb, and process the food you eat. Protein has the highest thermic effect (~20–30%), followed by carbs (~5–10%) and fat (~0–3%).',
  },
];

const TDEEResults = ({ profile, userName, advanced, onRecalculate }: TDEEResultsProps) => {
  const bmr = Math.round(calculateBMR(profile));
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const tef = Math.round(tdee * 0.10);

  // Estimate EAT from exercise data
  const metMultiplier: Record<string, number> = {
    gym: 5, running: 8, walking: 3.5, sports: 6, yoga: 3, swimming: 7, cycling: 6.5, hiit: 9, other: 4,
  };
  const exerciseMins = advanced?.exerciseMinutes || 0;
  const met = metMultiplier[advanced?.exerciseType || 'other'] || 4;
  const eat = Math.round((met * 3.5 * profile.weight / 200) * exerciseMins);

  // NEAT is the remainder
  const neat = Math.max(0, tdee - bmr - tef - eat);

  const components = [
    { name: 'BMR', value: bmr, label: `${bmr} kcal` },
    { name: 'NEAT', value: neat, label: `${neat} kcal` },
    { name: 'EAT', value: eat, label: `${eat} kcal` },
    { name: 'TEF', value: tef, label: `${tef} kcal` },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          {userName ? `${userName}'s TDEE Breakdown` : 'Your TDEE Breakdown'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Total Daily Energy Expenditure</p>
      </div>

      {/* Big TDEE number */}
      <motion.div
        {...fadeIn}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
      >
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Daily Calorie Burn</div>
        <div className="text-5xl sm:text-6xl font-display font-bold text-primary">{tdee}</div>
        <div className="text-sm text-muted-foreground mt-1">kcal / day</div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          🌍 Optimized for Indian & global dietary patterns
        </div>
      </motion.div>

      {/* Component breakdown cards */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {components.map((c, i) => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.name}</div>
            <div className="text-xl font-display font-bold text-foreground mt-1">{c.value}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
            <div className="w-3 h-3 rounded-full mx-auto mt-2" style={{ backgroundColor: COLORS[i] }} />
          </div>
        ))}
      </motion.div>

      {/* Pie chart */}
      <motion.div
        {...fadeIn}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 text-center">Energy Distribution</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={components}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {components.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3 w-full">
            {components.map((c, i) => {
              const pct = Math.round((c.value / tdee) * 100);
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{c.value} kcal <span className="text-xs">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* BMR Details */}
      <motion.div
        {...fadeIn}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="text-lg font-display font-semibold text-foreground mb-3">Calculation Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">BMR (Mifflin-St Jeor)</span>
            <span className="font-medium text-foreground">{bmr} kcal</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Activity Multiplier</span>
            <span className="font-medium text-foreground">
              ×{({ sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725, athlete: 1.9 })[profile.activityLevel]}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">TDEE</span>
            <span className="font-bold text-primary">{tdee} kcal</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">TEF (10% of TDEE)</span>
            <span className="font-medium text-foreground">{tef} kcal</span>
          </div>
          {advanced && exerciseMins > 0 && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">EAT ({exerciseMins} min {advanced.exerciseType})</span>
              <span className="font-medium text-foreground">{eat} kcal</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">NEAT (estimated)</span>
            <span className="font-medium text-foreground">{neat} kcal</span>
          </div>
        </div>
      </motion.div>

      {/* Educational Section */}
      <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Understanding Your TDEE</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {educationalCards.map(card => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{card.icon}</span>
                  <div>
                    <div className="text-sm font-display font-semibold text-foreground">{card.title}</div>
                    <div className="text-xs text-muted-foreground">{card.full}</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{card.share}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recalculate */}
      <motion.div {...fadeIn} transition={{ delay: 0.6 }} className="pt-2">
        <button
          onClick={onRecalculate}
          className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          ↻ Recalculate
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TDEEResults;
