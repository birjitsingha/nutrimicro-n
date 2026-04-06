import { useState } from 'react';
import { motion } from 'framer-motion';
import { Goal } from '@/lib/nutrition';

interface StepGoalProps {
  onSubmit: (goal: Goal) => void;
  onBack: () => void;
  initial?: Goal;
}

const goals: { value: Goal; label: string; emoji: string; desc: string }[] = [
  { value: 'lose', label: 'Lose Weight', emoji: '🔥', desc: 'Calorie deficit for fat loss' },
  { value: 'maintain', label: 'Maintain Weight', emoji: '⚖️', desc: 'Stay at your current weight' },
  { value: 'gain', label: 'Gain Weight / Muscle', emoji: '💪', desc: 'Calorie surplus for growth' },
];

const StepGoal = ({ onSubmit, onBack, initial }: StepGoalProps) => {
  const [selected, setSelected] = useState<Goal | null>(initial || null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Your Goal</h2>
        <p className="text-muted-foreground text-sm mt-1">What would you like to achieve?</p>
      </div>

      <div className="space-y-2.5">
        {goals.map(g => (
          <button
            key={g.value}
            onClick={() => setSelected(g.value)}
            className={`w-full text-left rounded-lg border px-4 py-4 transition ${
              selected === g.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{g.emoji}</span>
              <div>
                <div className="font-medium text-sm text-foreground">{g.label}</div>
                <div className="text-xs text-muted-foreground">{g.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
        >
          ← Back
        </button>
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected}
          className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
        >
          Get Results 🎯
        </button>
      </div>
    </motion.div>
  );
};

export default StepGoal;
