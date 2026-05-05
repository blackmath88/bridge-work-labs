import type { StepId } from "../app/routes";
import type { Language } from "../tools/protection-path/schema";
import type { TranslationSet } from "../tools/protection-path/translations";

type TopBarProps = {
  activeStep: StepId;
  language: Language;
  translations: TranslationSet;
  demoMode: boolean;
  onLanguageChange: (language: Language) => void;
  onReset: () => void;
};

export function TopBar({
  activeStep,
  language,
  translations,
  demoMode,
  onLanguageChange,
  onReset,
}: TopBarProps) {
  return (
    <header className="app-topbar sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-stone-200 bg-[#f9f7f2] px-5 py-3 shadow-sm lg:fixed lg:left-64 lg:right-0 lg:h-16 lg:px-8 lg:py-0">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
          {translations.appEyebrow}
        </p>
        <h1 className="text-lg font-bold text-primary">
          {translations.appTitle}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {demoMode ? (
          <span className="hidden rounded-full bg-sage-soft px-3 py-1 text-xs font-bold text-primary shadow-sage sm:inline-flex">
            {translations.demoBadge}
          </span>
        ) : null}
        <div className="flex rounded-full border border-outline bg-white p-1 shadow-sage">
          {(["en", "de"] as const).map((option) => (
            <button
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                language === option
                  ? "bg-sage text-white"
                  : "text-stone-500 hover:text-primary"
              }`}
              key={option}
              onClick={() => onLanguageChange(option)}
              type="button"
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="rounded-full border border-outline bg-white px-3 py-1 text-xs font-semibold text-sage shadow-sage transition-colors hover:border-sage hover:text-primary"
          onClick={onReset}
          type="button"
        >
          {translations.reset}
        </button>
        <div className="hidden rounded-full border border-outline bg-white px-3 py-1 text-xs font-semibold text-sage shadow-sage md:block">
          {translations.steps[activeStep].label}
        </div>
      </div>
    </header>
  );
}
