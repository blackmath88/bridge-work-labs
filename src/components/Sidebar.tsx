import { Sparkles, X } from "lucide-react";
import type { StepId, StepRoute } from "../app/routes";
import type { TranslationSet } from "../tools/protection-path/translations";
import { StepNavigation } from "./StepNavigation";

type SidebarProps = {
  activeStep: StepId;
  steps: StepRoute[];
  translations: TranslationSet;
  open: boolean;
  onStepChange: (step: StepId) => void;
  onClose: () => void;
};

export function Sidebar({
  activeStep,
  steps,
  translations: t,
  open,
  onStepChange,
  onClose,
}: SidebarProps) {
  function handleStepChange(step: StepId) {
    onStepChange(step);
    onClose();
  }

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
        aria-label={t.sideTitle}
        className={`app-sidebar glass-side fixed inset-y-0 left-0 z-40 flex w-72 flex-col py-6 shadow-e3 transition-transform duration-200 ease-out-expo lg:w-64 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-7 flex items-start justify-between gap-3 px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-600 text-white shadow-e1"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <p className="eyebrow">{t.sideSub}</p>
            </div>
            <h2 className="mt-3 text-[17px] font-semibold tracking-tight text-ink">
              {t.sideTitle}
            </h2>
          </div>
          <button
            aria-label={t.closeMenu}
            className="btn-icon h-7 w-7 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        <StepNavigation
          activeStep={activeStep}
          onStepChange={handleStepChange}
          steps={steps}
          translations={t}
        />

        <div className="mt-auto px-5 pt-6">
          <div className="hr-soft" />
          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-3">
            {t.privacyNote}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-ink-3">
              {t.brandLine}
            </p>
            <span className="kbd">v1</span>
          </div>
          <p className="mt-1 text-[10.5px] text-ink-4">{t.brandSub}</p>
        </div>
      </aside>
    </>
  );
}
