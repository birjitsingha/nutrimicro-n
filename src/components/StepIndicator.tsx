import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : i === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: i === currentStep ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {i < currentStep ? '✓' : i + 1}
            </motion.div>
            <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{labels[i]}</span>
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-8 sm:w-16 h-0.5 mb-5 sm:mb-4 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
