import type { StepId, StepRoute } from "../app/routes";
import type { TranslationSet } from "../tools/protection-path/translations";

type StepNavigationProps = {
  activeStep: StepId;
  steps: StepRoute[];
  translations: TranslationSet;
  onStepChange: (step: StepId) => void;
};

export function StepNavigation({
  activeStep,
  steps,
  translations,
  onStepChange,
}: StepNavigationProps) {
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Tool steps">
      {steps.map((step, index) => {
        const active = step.id === activeStep;
        const label = translations.steps[step.id].label;

        return (
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
              active
                ? "border-r-4 border-sage bg-stone-100 font-bold text-primary"
                : "text-stone-500 hover:bg-stone-50 hover:text-primary"
            }`}
            key={step.id}
            onClick={() => onStepChange(step.id)}
            type="button"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                active
                  ? "bg-sage text-white"
                  : "bg-surface-mid text-ink-muted"
              }`}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
