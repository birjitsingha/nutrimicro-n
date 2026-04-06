import { useState } from 'react';
import { motion } from 'framer-motion';
import { ActivityLevel } from '@/lib/nutrition';

interface StepActivityProps {
  onNext: (level: ActivityLevel) => void;
  onBack: () => void;
  initial?: ActivityLevel;
}

const levels: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', desc: '1–3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: '3–5 days/week' },
  { value: 'very_active', label: 'Very Active', desc: '6–7 days/week' },
  { value: 'athlete', label: 'Athlete', desc: 'Intense training daily' },
];

const StepActivity = ({ onNext, onBack, initial }: StepActivityProps) => {
  const [selected, setSelected] = useState<ActivityLevel | null>(initial || null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Activity Level</h2>
        <p className="text-muted-foreground text-sm mt-1">How active are you on a typical week?</p>
      </div>

      <div className="space-y-2.5">
        {levels.map(l => (
          <button
            key={l.value}
            onClick={() => setSelected(l.value)}
            className={`w-full text-left rounded-lg border px-4 py-3.5 transition ${
              selected === l.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="font-medium text-sm text-foreground">{l.label}</div>
            <div className="text-xs text-muted-foreground">{l.desc}</div>
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
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
};

export default StepActivity;
