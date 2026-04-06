import { useState } from 'react';
import { motion } from 'framer-motion';

export interface AdvancedData {
  exerciseMinutes: number;
  exerciseType: string;
}

interface StepAdvancedProps {
  onNext: (data: AdvancedData) => void;
  onBack: () => void;
  onSkip: () => void;
  initial?: AdvancedData;
}

const exerciseTypes = [
  { value: 'gym', label: '🏋️ Gym / Weight Training' },
  { value: 'running', label: '🏃 Running / Jogging' },
  { value: 'walking', label: '🚶 Walking' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'yoga', label: '🧘 Yoga / Pilates' },
  { value: 'swimming', label: '🏊 Swimming' },
  { value: 'cycling', label: '🚴 Cycling' },
  { value: 'hiit', label: '⚡ HIIT / Crossfit' },
  { value: 'other', label: '🔄 Other' },
];

const StepAdvanced = ({ onNext, onBack, onSkip, initial }: StepAdvancedProps) => {
  const [minutes, setMinutes] = useState(initial?.exerciseMinutes?.toString() || '');
  const [exerciseType, setExerciseType] = useState(initial?.exerciseType || '');

  const handleSubmit = () => {
    onNext({
      exerciseMinutes: parseInt(minutes) || 0,
      exerciseType: exerciseType || 'other',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Exercise Details</h2>
        <p className="text-muted-foreground text-sm mt-1">Optional — helps us estimate your calorie burn more accurately.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Daily Exercise Duration</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              placeholder="30"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Type of Activity</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exerciseTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setExerciseType(t.value)}
                className={`text-left rounded-lg border px-3 py-2.5 text-sm transition ${
                  exerciseType === t.value
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
        >
          ← Back
        </button>
        <button
          onClick={onSkip}
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
};

export default StepAdvanced;
