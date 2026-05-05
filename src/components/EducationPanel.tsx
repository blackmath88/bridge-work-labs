import { BookOpen } from "lucide-react";
import type { StepId } from "../app/routes";
import type { TranslationSet } from "../tools/protection-path/translations";

type EducationPanelProps = {
  activeStep: StepId;
  translations: TranslationSet;
};

export function EducationPanel({
  activeStep,
  translations,
}: EducationPanelProps) {
  const step = translations.steps[activeStep];

  return (
    <aside className="app-edu-panel fixed right-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-72 overflow-y-auto px-5 py-6 xl:block">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-2">
          <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
          <h2 className="text-[12px] font-semibold tracking-tight">
            {translations.learningPanel}
          </h2>
        </div>
        <span className="chip chip-muted text-[10px] uppercase tracking-[0.12em]">
          {translations.draftBadge}
        </span>
      </div>

      <div className="card animate-fade-in p-4">
        <p className="eyebrow">{step.label}</p>
        <h3 className="mt-2 text-[14px] font-semibold tracking-tight text-ink">
          {step.educationTitle}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          {step.educationText}
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-hairline-strong bg-surface-2 p-4">
        <p className="text-[12.5px] leading-relaxed italic text-ink-3">
          {activeStep === "vision"
            ? translations.vision.coreQuote
            : translations.learningFooter}
        </p>
      </div>
    </aside>
  );
}
