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
    <aside className="app-edu-panel fixed right-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-72 overflow-y-auto border-l border-stone-200 bg-[#f9f7f2] px-5 py-6 shadow-[-4px_0_12px_rgba(62,92,84,0.05)] xl:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-primary">
          {translations.learningPanel}
        </h2>
        <span className="rounded-full bg-sage-soft px-2 py-1 text-[10px] font-bold uppercase text-primary">
          {translations.draftBadge}
        </span>
      </div>

      <div className="rounded-xl border border-surface-high bg-white p-4 shadow-sage">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
          {step.label}
        </p>
        <h3 className="mt-2 text-sm font-bold text-ink">
          {step.educationTitle}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          {step.educationText}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-outline bg-surface-low p-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          {activeStep === "vision"
            ? translations.vision.coreQuote
            : translations.learningFooter}
        </p>
      </div>
    </aside>
  );
}
