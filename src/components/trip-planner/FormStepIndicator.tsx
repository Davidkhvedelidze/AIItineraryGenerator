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
        <p className="text-sm font-medium text-foreground">Step {currentStep} of 3</p>
        <p className="text-xs text-muted-foreground">{progressPercentage}% complete</p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercentage} aria-label="Form completion progress">
        <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
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
              className={`rounded-md border px-2 py-2 text-center transition-colors sm:px-3 ${
                isActive
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : isCompleted
                    ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                    : "border-border text-muted-foreground"
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
