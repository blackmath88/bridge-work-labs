import { Compass, Hammer, MessageSquareQuote, FileText } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { StepId, StepRoute } from "../app/routes";
import type { TranslationSet } from "../tools/protection-path/translations";

type StepNavigationProps = {
  activeStep: StepId;
  steps: StepRoute[];
  translations: TranslationSet;
  onStepChange: (step: StepId) => void;
};

const stepIcons: Record<StepId, ComponentType<SVGProps<SVGSVGElement>>> = {
  vision: Compass,
  build: Hammer,
  reflect: MessageSquareQuote,
  output: FileText,
};

export function StepNavigation({
  activeStep,
  steps,
  translations,
  onStepChange,
}: StepNavigationProps) {
  return (
    <nav className="flex-1 space-y-0.5 px-2.5" aria-label="Tool steps">
      {steps.map((step, index) => {
        const active = step.id === activeStep;
        const label = translations.steps[step.id].label;
        const Icon = stepIcons[step.id];

        return (
          <button
            className="sidebar-row group"
            data-active={active}
            key={step.id}
            onClick={() => onStepChange(step.id)}
            type="button"
          >
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
                active
                  ? "bg-sage-600 text-white"
                  : "bg-surface-3 text-ink-3 group-hover:bg-surface-sunken"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate">{label}</span>
            <span
              aria-hidden="true"
              className={`font-mono text-[10.5px] tracking-wide ${
                active ? "text-ink-3" : "text-ink-4"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
