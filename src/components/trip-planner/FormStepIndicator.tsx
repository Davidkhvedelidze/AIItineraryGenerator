import { memo } from "react";

interface FormStepIndicatorProps {
  currentStep: 1 | 2 | 3;
  progressPercentage: number;
}

const STEP_LABELS = ["Trip Basics", "Travel Preferences", "Contact & Notes"] as const;

export const FormStepIndicator = memo(function FormStepIndicator({
  currentStep,
  progressPercentage,
}: FormStepIndicatorProps) {
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">Step {currentStep} of 3</p>
        <p className="text-xs font-medium text-stone-500">{progressPercentage}% complete</p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercentage} aria-label="Form completion progress">
        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
      </div>

      <ol className="grid grid-cols-3 gap-2 text-xs sm:text-sm" aria-label="Trip planner steps">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li
              key={label}
              aria-current={isActive ? "step" : undefined}
              className={`rounded-xl border px-2 py-2 text-center transition-colors sm:px-3 ${
                isActive
                  ? "border-primary bg-primary-soft text-foreground"
                  : isCompleted
                    ? "border-primary/35 bg-primary-soft/70 text-foreground"
                    : "border-stone-200 text-stone-500"
              }`}
            >
              <span className="font-medium">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
});
