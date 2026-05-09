import { BookOpen, X } from "lucide-react";
import type { StepId } from "../app/routes";
import type { TranslationSet } from "../tools/protection-path/translations";

type EducationPanelProps = {
  activeStep: StepId;
  translations: TranslationSet;
  open: boolean;
  onClose: () => void;
};

export function EducationPanel({
  activeStep,
  translations,
  open,
  onClose,
}: EducationPanelProps) {
  const step = translations.steps[activeStep];

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-30 bg-ink/30 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        aria-hidden={!open}
        aria-label={translations.toggleEducation}
        className={`app-edu-panel glass-side fixed right-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-[88vw] max-w-sm flex-col overflow-y-auto border-l border-hairline px-5 py-6 shadow-e3 transition-transform duration-200 ease-out-expo lg:w-72 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-2">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
            <h2 className="text-[12px] font-semibold tracking-tight">
              {translations.learningPanel}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="chip chip-muted text-[10px] uppercase tracking-[0.12em]">
              {translations.draftBadge}
            </span>
            <button
              aria-label={translations.closeMenu}
              className="btn-icon h-7 w-7"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
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
    </>
  );
}
