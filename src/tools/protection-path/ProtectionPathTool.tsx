import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  readStepFromHash,
  stepRoutes,
  writeStepToHash,
  type StepId,
} from "../../app/routes";
import { EducationPanel } from "../../components/EducationPanel";
import { StepNavigation } from "../../components/StepNavigation";
import { TopBar } from "../../components/TopBar";
import { clearStorage, loadFromStorage, saveToStorage } from "../../lib/storage";
import { createDefaultToolState, type Language, type ToolState } from "./schema";
import { BuildScreen } from "./screens/BuildScreen";
import { OutputScreen } from "./screens/OutputScreen";
import { ReflectScreen } from "./screens/ReflectScreen";
import { StepHeader } from "./screens/StepHeader";
import { StepPlaceholder } from "./screens/StepPlaceholder";
import { VisionScreen } from "./screens/VisionScreen";
import {
  migrateStoredState,
  toolStateReducer,
  type ToolAction,
} from "./state";
import { translations } from "./translations";

const STORAGE_KEY = "protection-path-designer-state";

function loadInitialState(): ToolState {
  const stored = loadFromStorage<unknown>(STORAGE_KEY, null);
  return migrateStoredState(stored) ?? createDefaultToolState();
}

export function ProtectionPathTool() {
  const [activeStep, setActiveStep] = useState<StepId>(
    () => readStepFromHash() ?? "vision",
  );
  const [toolState, dispatch] = useReducer(toolStateReducer, undefined, loadInitialState);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const t = translations[toolState.language];
  const route = t.steps[activeStep];

  useEffect(() => {
    saveToStorage(STORAGE_KEY, toolState);
    document.documentElement.lang = toolState.language;
    setLastSavedAt(new Date());
  }, [toolState]);

  useEffect(() => {
    writeStepToHash(activeStep);
  }, [activeStep]);

  useEffect(() => {
    function onHashChange() {
      const next = readStepFromHash();
      if (next) {
        setActiveStep(next);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: "setLanguage", language });
  }, []);

  const loadDemo = useCallback(() => {
    dispatch({ type: "loadDemo" });
  }, []);

  const buildOwn = useCallback(() => {
    dispatch({ type: "buildOwn" });
    setActiveStep("build");
  }, []);

  const resetState = useCallback(() => {
    if (!window.confirm(t.resetConfirm)) {
      return;
    }
    clearStorage(STORAGE_KEY);
    dispatch({ type: "reset" });
    setActiveStep("vision");
  }, [t.resetConfirm]);

  return (
    <div className="min-h-screen font-sans text-ink">
      <aside className="app-sidebar glass-side z-40 flex w-full flex-col py-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64">
        <div className="mb-7 px-5">
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

        <StepNavigation
          activeStep={activeStep}
          onStepChange={setActiveStep}
          steps={stepRoutes}
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

      <TopBar
        activeStep={activeStep}
        demoMode={toolState.demoMode}
        language={toolState.language}
        lastSavedAt={lastSavedAt}
        onLanguageChange={setLanguage}
        onReset={resetState}
        translations={t}
      />
      <EducationPanel activeStep={activeStep} translations={t} />

      <main className="min-h-screen px-5 pb-16 pt-8 lg:ml-64 lg:px-10 lg:pt-20 xl:mr-72">
        <section className="mx-auto max-w-5xl animate-fade-in">
          <Screen
            activeStep={activeStep}
            dispatch={dispatch}
            onBuildOwn={buildOwn}
            onLoadDemo={loadDemo}
            route={route}
            state={toolState}
            translations={t}
          />
        </section>
      </main>
    </div>
  );
}

type ScreenProps = {
  activeStep: StepId;
  state: ToolState;
  translations: (typeof translations)[Language];
  route: { eyebrow: string; title: string; description: string };
  dispatch: (action: ToolAction) => void;
  onLoadDemo: () => void;
  onBuildOwn: () => void;
};

function Screen({
  activeStep,
  state,
  translations: t,
  route,
  dispatch,
  onLoadDemo,
  onBuildOwn,
}: ScreenProps) {
  if (activeStep === "vision") {
    return (
      <VisionScreen
        demoMode={state.demoMode}
        onBuildOwn={onBuildOwn}
        onLoadDemo={onLoadDemo}
        translations={t}
      />
    );
  }

  if (activeStep === "build") {
    return (
      <>
        <StepHeader route={route} />
        <BuildScreen dispatch={dispatch} state={state} translations={t} />
      </>
    );
  }

  if (activeStep === "reflect") {
    return (
      <>
        <StepHeader route={route} />
        <ReflectScreen state={state} translations={t} />
      </>
    );
  }

  if (activeStep === "output") {
    return (
      <>
        <StepHeader route={route} />
        <OutputScreen state={state} translations={t} />
      </>
    );
  }

  return (
    <>
      <StepHeader route={route} />
      <StepPlaceholder translations={t} />
    </>
  );
}
