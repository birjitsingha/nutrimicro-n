import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/StepIndicator';
import StepBasicDetails from '@/components/StepBasicDetails';
import StepActivity from '@/components/StepActivity';
import StepAdvanced, { AdvancedData } from '@/components/StepAdvanced';
import StepFoodLog, { MealSlot } from '@/components/StepFoodLog';
import AnalysisResults from '@/components/AnalysisResults';
import TDEEResults from '@/components/TDEEResults';
import { UserProfile, Gender, ActivityLevel } from '@/lib/nutrition';

const Index = () => {
  const [step, setStep] = useState(0);
  const [basicData, setBasicData] = useState<{ name: string; age: number; gender: Gender; height: number; weight: number } | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [advancedData, setAdvancedData] = useState<AdvancedData | undefined>(undefined);
  const [slots, setSlots] = useState<MealSlot[]>([]);

  const handleBasic = (data: { name: string; age: number; gender: Gender; height: number; weight: number }) => {
    setBasicData(data);
    setStep(1);
  };

  const handleActivity = (level: ActivityLevel) => {
    setActivityLevel(level);
    setStep(2);
  };

  const handleAdvanced = (data: AdvancedData) => {
    setAdvancedData(data);
    setStep(3); // TDEE results
  };

  const handleSkipAdvanced = () => {
    setAdvancedData(undefined);
    setStep(3); // TDEE results
  };

  const handleAnalyze = (mealSlots: MealSlot[]) => {
    setSlots(mealSlots);
    setStep(5); // Food analysis
  };

  const profile: UserProfile | null = basicData && activityLevel
    ? { age: basicData.age, gender: basicData.gender, height: basicData.height, weight: basicData.weight, activityLevel, goal: 'maintain' }
    : null;

  const totalSteps = 3; // Basics, Activity, Advanced
  const stepLabels = ['Your Details', 'Activity', 'Exercise'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">N</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">NutriMicro-N</span>
          </div>
          {step < totalSteps && (
            <span className="text-xs text-muted-foreground">Step {step + 1} of {totalSteps}</span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {step < totalSteps && (
          <StepIndicator currentStep={step} totalSteps={totalSteps} labels={stepLabels} />
        )}

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepBasicDetails key="basic" onNext={handleBasic} initial={basicData || undefined} />
            )}
            {step === 1 && (
              <StepActivity
                key="activity"
                onNext={handleActivity}
                onBack={() => setStep(0)}
                initial={activityLevel || undefined}
              />
            )}
            {step === 2 && (
              <StepAdvanced
                key="advanced"
                onNext={handleAdvanced}
                onBack={() => setStep(1)}
                onSkip={handleSkipAdvanced}
                initial={advancedData}
              />
            )}
          </AnimatePresence>

          {/* TDEE Results */}
          {step === 3 && profile && (
            <TDEEResults
              profile={profile}
              userName={basicData?.name || ''}
              advanced={advancedData}
              onRecalculate={() => setStep(0)}
            />
          )}

          {/* After TDEE, option to log food */}
          {step === 3 && profile && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">Want to analyze what you're eating?</p>
              <button
                onClick={() => setStep(4)}
                className="rounded-lg border border-primary text-primary px-6 py-2.5 text-sm font-medium hover:bg-primary/5 transition"
              >
                Log Your Food →
              </button>
            </div>
          )}

          {/* Food Log */}
          {step === 4 && (
            <StepFoodLog
              onAnalyze={handleAnalyze}
              onBack={() => setStep(3)}
              initial={slots.length ? slots : undefined}
            />
          )}

          {/* Food Analysis Results */}
          {step === 5 && profile && (
            <AnalysisResults
              profile={profile}
              userName={basicData?.name || ''}
              slots={slots}
              onEdit={() => setStep(4)}
            />
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        © 2026 NutriMicro-N · Smart Nutrition for Every Diet
      </footer>
    </div>
  );
};

export default Index;
