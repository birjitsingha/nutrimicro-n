import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gender, calculateBMR, calculateTDEE } from '@/lib/nutrition';

interface StepBasicDetailsProps {
  onNext: (data: { name: string; age: number; gender: Gender; height: number; weight: number }) => void;
  initial?: { name: string; age: number; gender: Gender; height: number; weight: number };
}

const StepBasicDetails = ({ onNext, initial }: StepBasicDetailsProps) => {
  const [name, setName] = useState(initial?.name || '');
  const [age, setAge] = useState(initial?.age?.toString() || '');
  const [gender, setGender] = useState<Gender>(initial?.gender || 'male');
  const [height, setHeight] = useState(initial?.height?.toString() || '');
  const [weight, setWeight] = useState(initial?.weight?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maintenanceCalories = useMemo(() => {
    const a = parseInt(age), h = parseFloat(height), w = parseFloat(weight);
    if (!a || a < 10 || !h || h < 50 || !w || w < 20) return null;
    const bmr = calculateBMR({ age: a, gender, height: h, weight: w, activityLevel: 'moderate', goal: 'maintain' });
    return calculateTDEE(bmr, 'moderate');
  }, [age, gender, height, weight]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your name';
    const a = parseInt(age), h = parseFloat(height), w = parseFloat(weight);
    if (!a || a < 10 || a > 120) e.age = 'Enter valid age (10–120)';
    if (!h || h < 50 || h > 300) e.height = 'Enter valid height (50–300 cm)';
    if (!w || w < 20 || w > 500) e.weight = 'Enter valid weight (20–500 kg)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext({ name: name.trim(), age: parseInt(age), gender, height: parseFloat(height), weight: parseFloat(weight) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Basic Details</h2>
        <p className="text-muted-foreground text-sm mt-1">Tell us about yourself to get started.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="25"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Gender</label>
          <div className="flex gap-2">
            {(['male', 'female'] as Gender[]).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  gender === g
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="170"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.height && <p className="text-destructive text-xs mt-1">{errors.height}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="70"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.weight && <p className="text-destructive text-xs mt-1">{errors.weight}</p>}
        </div>
      </div>

      {maintenanceCalories && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center"
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Est. Maintenance Calories</div>
          <div className="text-2xl font-display font-bold text-primary mt-0.5">{maintenanceCalories} <span className="text-sm font-normal text-muted-foreground">kcal/day</span></div>
          <div className="text-xs text-muted-foreground mt-0.5">Based on moderate activity</div>
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition"
      >
        Continue →
      </button>
    </motion.div>
  );
};

export default StepBasicDetails;
