import { BookOpen, Menu, RotateCcw, Sparkles } from "lucide-react";
import type { StepId } from "../app/routes";
import type { Language } from "../tools/protection-path/schema";
import type { TranslationSet } from "../tools/protection-path/translations";

type TopBarProps = {
  activeStep: StepId;
  language: Language;
  translations: TranslationSet;
  demoMode: boolean;
  lastSavedAt: Date | null;
  educationOpen: boolean;
  onLanguageChange: (language: Language) => void;
  onReset: () => void;
  onOpenSidebar: () => void;
  onToggleEducation: () => void;
};

export function TopBar({
  activeStep,
  language,
  translations,
  demoMode,
  lastSavedAt,
  educationOpen,
  onLanguageChange,
  onReset,
  onOpenSidebar,
  onToggleEducation,
}: TopBarProps) {
  const savedTime = lastSavedAt
    ? lastSavedAt.toLocaleTimeString(language === "de" ? "de-CH" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <header className="app-topbar glass sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 px-4 py-2.5 lg:fixed lg:left-64 lg:right-0 lg:h-14 lg:px-7 lg:py-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          aria-label={translations.openMenu}
          className="btn-icon lg:hidden"
          onClick={onOpenSidebar}
          type="button"
        >
          <Menu aria-hidden="true" className="h-4 w-4" />
        </button>
        <p className="eyebrow hidden sm:block">{translations.appEyebrow}</p>
        <span className="hidden h-3 w-px bg-hairline-strong sm:block" />
        <h1 className="truncate text-[14px] font-semibold tracking-tight text-ink">
          {translations.appTitle}
        </h1>
        <span
          aria-hidden="true"
          className="hidden h-3 w-px bg-hairline-strong md:block"
        />
        <span className="hidden text-[13px] font-medium tracking-tight text-ink-3 md:inline">
          {translations.steps[activeStep].label}
        </span>
        {savedTime ? (
          <span
            aria-live="polite"
            className="hidden font-mono text-[11px] text-ink-4 md:inline"
          >
            · {translations.saved} {savedTime}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {demoMode ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-accent-400/20 px-2.5 py-1 text-[11.5px] font-medium tracking-tight text-accent-600 sm:inline-flex">
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            {translations.demoBadge}
          </span>
        ) : null}

        <div
          className="segmented"
          role="group"
          aria-label="Language"
        >
          {(["en", "de"] as const).map((option) => (
            <button
              data-active={language === option}
              key={option}
              onClick={() => onLanguageChange(option)}
              type="button"
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          aria-label={translations.toggleEducation}
          aria-pressed={educationOpen}
          className="btn-icon"
          onClick={onToggleEducation}
          title={translations.toggleEducation}
          type="button"
        >
          <BookOpen aria-hidden="true" className="h-4 w-4" />
        </button>

        <button
          aria-label={translations.reset}
          className="btn-icon"
          onClick={onReset}
          title={translations.reset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
