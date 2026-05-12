import { useCallback, useEffect, useReducer, useState } from "react";
import {
  readStepFromHash,
  stepRoutes,
  writeStepToHash,
  type StepId,
} from "../../app/routes";
import { EducationPanel } from "../../components/EducationPanel";
import { Sidebar } from "../../components/Sidebar";
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
  hasUserContent,
  migrateStoredState,
  toolStateReducer,
  type ToolAction,
} from "./state";
import { translations } from "./translations";

const STORAGE_KEY = "protection-path-designer-state";
const EDUCATION_OPEN_KEY = "protection-path-education-open";

function loadInitialState(): ToolState {
  const stored = loadFromStorage<unknown>(STORAGE_KEY, null);
  return migrateStoredState(stored) ?? createDefaultToolState();
}

function loadInitialEducationOpen(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const raw = window.localStorage.getItem(EDUCATION_OPEN_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return window.matchMedia("(min-width: 1280px)").matches;
}

export function ProtectionPathTool() {
  const [activeStep, setActiveStep] = useState<StepId>(
    () => readStepFromHash() ?? "vision",
  );
  const [toolState, dispatch] = useReducer(toolStateReducer, undefined, loadInitialState);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(loadInitialEducationOpen);
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

  useEffect(() => {
    window.localStorage.setItem(EDUCATION_OPEN_KEY, String(educationOpen));
  }, [educationOpen]);

  useEffect(() => {
    if (!sidebarOpen && !educationOpen) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setEducationOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, educationOpen]);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: "setLanguage", language });
  }, []);

  const loadDemo = useCallback(() => {
    if (hasUserContent(toolState) && !window.confirm(t.confirmReplaceWithDemo)) {
      return;
    }
    dispatch({ type: "loadDemo" });
    setActiveStep("build");
  }, [toolState, t.confirmReplaceWithDemo]);

  const buildOwn = useCallback(() => {
    if (hasUserContent(toolState) && !window.confirm(t.confirmStartBlank)) {
      return;
    }
    dispatch({ type: "buildOwn" });
    setActiveStep("build");
  }, [toolState, t.confirmStartBlank]);

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
      <Sidebar
        activeStep={activeStep}
        onClose={() => setSidebarOpen(false)}
        onStepChange={setActiveStep}
        open={sidebarOpen}
        steps={stepRoutes}
        translations={t}
      />

      <TopBar
        activeStep={activeStep}
        demoMode={toolState.demoMode}
        educationOpen={educationOpen}
        language={toolState.language}
        lastSavedAt={lastSavedAt}
        onLanguageChange={setLanguage}
        onOpenSidebar={() => setSidebarOpen(true)}
        onReset={resetState}
        onToggleEducation={() => setEducationOpen((value) => !value)}
        translations={t}
      />
      <EducationPanel
        activeStep={activeStep}
        onClose={() => setEducationOpen(false)}
        open={educationOpen}
        translations={t}
      />

      <main className="min-h-screen px-5 pb-16 pt-8 lg:ml-64 lg:px-10 lg:pt-20">
        <section className="mx-auto max-w-5xl animate-fade-in">
          <Screen
            activeStep={activeStep}
            dispatch={dispatch}
            onBuildOwn={buildOwn}
            onChangeStep={setActiveStep}
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
  onChangeStep: (step: StepId) => void;
};

function Screen({
  activeStep,
  state,
  translations: t,
  route,
  dispatch,
  onLoadDemo,
  onBuildOwn,
  onChangeStep,
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
        <BuildScreen
          dispatch={dispatch}
          onAdvance={() => onChangeStep("reflect")}
          state={state}
          translations={t}
        />
      </>
    );
  }

  if (activeStep === "reflect") {
    return (
      <>
        <StepHeader route={route} />
        <ReflectScreen
          onAdvance={() => onChangeStep("output")}
          state={state}
          translations={t}
        />
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
