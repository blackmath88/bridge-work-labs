import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { stepRoutes, type StepId } from "../../app/routes";
import { EducationPanel } from "../../components/EducationPanel";
import { ExportButtons } from "../../components/ExportButtons";
import { StepNavigation } from "../../components/StepNavigation";
import { TopBar } from "../../components/TopBar";
import { clearStorage, loadFromStorage, saveToStorage } from "../../lib/storage";
import {
  conceptKeys,
  pathwayColors,
  predefinedTriggerKeys,
  type PredefinedTriggerKey,
} from "./config";
import { demoState } from "./demo";
import { buildOutputModel } from "./output";
import { buildReflectionPrompt } from "./prompts";
import {
  createDefaultToolState,
  type ContextFields,
  type EscalationLevel,
  type Language,
  type ToolState,
} from "./schema";
import { translations } from "./translations";

const STORAGE_KEY = "protection-path-designer-state";

export function ProtectionPathTool() {
  const [activeStep, setActiveStep] = useState<StepId>("vision");
  const [toolState, setToolState] = useState<ToolState>(() =>
    loadFromStorage(STORAGE_KEY, createDefaultToolState()),
  );
  const t = translations[toolState.language];
  const route = t.steps[activeStep];

  useEffect(() => {
    saveToStorage(STORAGE_KEY, toolState);
    document.documentElement.lang = toolState.language;
  }, [toolState]);

  function setLanguage(language: Language) {
    setToolState((current) => ({ ...current, language }));
  }

  function loadDemo() {
    setToolState((current) => ({
      ...demoState,
      language: current.language,
    }));
  }

  function buildOwn() {
    setToolState((current) => createDefaultToolState(current.language));
    setActiveStep("build");
  }

  function resetState() {
    clearStorage(STORAGE_KEY);
    setToolState((current) => createDefaultToolState(current.language));
    setActiveStep("vision");
  }

  function updateLevel(
    levelId: string,
    field: keyof Omit<EscalationLevel, "id" | "number">,
    value: string,
  ) {
    setToolState((current) => ({
      ...current,
      levels: current.levels.map((level) =>
        level.id === levelId ? { ...level, [field]: value } : level,
      ),
    }));
  }

  function toggleTrigger(trigger: string) {
    setToolState((current) => {
      const selected = current.selectedTriggers.includes(trigger);

      return {
        ...current,
        selectedTriggers: selected
          ? current.selectedTriggers.filter((item) => item !== trigger)
          : [...current.selectedTriggers, trigger],
      };
    });
  }

  function addCustomTrigger(trigger: string) {
    const trimmed = trigger.trim();
    if (!trimmed) {
      return;
    }

    setToolState((current) => {
      const alreadyExists =
        current.customTriggers.includes(trimmed) ||
        current.selectedTriggers.includes(trimmed);

      return alreadyExists
        ? current
        : { ...current, customTriggers: [...current.customTriggers, trimmed] };
    });
  }

  function removeCustomTrigger(trigger: string) {
    setToolState((current) => ({
      ...current,
      customTriggers: current.customTriggers.filter((item) => item !== trigger),
    }));
  }

  function updateContext(field: keyof ContextFields, value: string) {
    setToolState((current) => ({
      ...current,
      context: {
        ...current.context,
        [field]: value,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <aside className="app-sidebar z-40 flex w-full flex-col border-b border-stone-200 bg-[#f9f7f2] py-6 shadow-[4px_0_12px_rgba(62,92,84,0.05)] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="mb-8 px-6">
          <h2 className="text-xl font-extrabold text-primary">
            {t.sideTitle}
          </h2>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-stone-500">
            {t.sideSub}
          </p>
        </div>

        <StepNavigation
          activeStep={activeStep}
          onStepChange={setActiveStep}
          steps={stepRoutes}
          translations={t}
        />

        <div className="mt-auto border-t border-stone-200 px-6 pt-6">
          <p className="text-[11px] leading-relaxed text-stone-400">
            {t.privacyNote}
          </p>
          <div className="mt-3 border-t border-stone-100 pt-3">
            <p className="text-[10px] font-semibold text-stone-400">
              {t.brandLine}
            </p>
            <p className="mt-0.5 text-[9px] text-stone-300">
              {t.brandSub}
            </p>
          </div>
        </div>
      </aside>

      <TopBar
        activeStep={activeStep}
        demoMode={toolState.demoMode}
        language={toolState.language}
        onLanguageChange={setLanguage}
        onReset={resetState}
        translations={t}
      />
      <EducationPanel activeStep={activeStep} translations={t} />

      <main className="min-h-screen px-5 pb-12 pt-6 lg:ml-64 lg:px-8 lg:pt-24 xl:mr-72">
        <section className="mx-auto max-w-5xl">
          {activeStep === "vision" ? (
            <VisionScreen
              demoMode={toolState.demoMode}
              onBuildOwn={buildOwn}
              onLoadDemo={loadDemo}
              translations={t}
            />
          ) : activeStep === "build" ? (
            <>
              <StepHeader route={route} />
              <BuildScreen
                onAddCustomTrigger={addCustomTrigger}
                onRemoveCustomTrigger={removeCustomTrigger}
                onToggleTrigger={toggleTrigger}
                onUpdateContext={updateContext}
                onUpdateLevel={updateLevel}
                state={toolState}
                translations={t}
              />
            </>
          ) : activeStep === "reflect" ? (
            <>
              <StepHeader route={route} />
              <ReflectScreen state={toolState} translations={t} />
            </>
          ) : activeStep === "output" ? (
            <>
              <StepHeader route={route} />
              <OutputScreen state={toolState} translations={t} />
            </>
          ) : (
            <>
              <StepHeader route={route} />
              <StepPlaceholder translations={t} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

type RouteCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

function StepHeader({ route }: { route: RouteCopy }) {
  return (
    <div className="no-print mb-8 rounded-2xl border border-surface-high bg-white/75 p-8 shadow-sage backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
        {route.eyebrow}
      </p>
      <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-primary md:text-4xl">
        {route.title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-muted">
        {route.description}
      </p>
    </div>
  );
}

type VisionScreenProps = {
  demoMode: boolean;
  translations: (typeof translations)[Language];
  onLoadDemo: () => void;
  onBuildOwn: () => void;
};

function VisionScreen({
  demoMode,
  translations: t,
  onLoadDemo,
  onBuildOwn,
}: VisionScreenProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-surface-high bg-white/80 shadow-lift backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 md:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
              {t.vision.heroEyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-primary md:text-5xl">
              {t.vision.heroTitle}
            </h2>
            <p className="mt-4 text-2xl font-semibold italic leading-9 text-stone-500">
              {t.vision.heroSub}
            </p>
            <div className="mt-5 h-1 w-20 rounded-full bg-sage-soft" />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              {t.vision.heroLead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-sage transition-colors hover:bg-sage"
                onClick={onLoadDemo}
                type="button"
              >
                {t.vision.startDemo}
              </button>
              <button
                className="rounded-lg border-2 border-sage px-5 py-3 text-sm font-bold text-sage transition-colors hover:bg-sage hover:text-white"
                onClick={onBuildOwn}
                type="button"
              >
                {t.vision.buildOwn}
              </button>
              {demoMode ? (
                <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-bold text-primary">
                  {t.vision.demoLoaded}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex min-h-80 flex-col justify-between bg-sage p-8 text-white md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-muted">
                {t.vision.coreLabel}
              </p>
              <blockquote className="mt-4 text-xl italic leading-9">
                {t.vision.coreQuote}
              </blockquote>
            </div>
            <p className="mt-8 text-xs leading-5 text-sage-muted">
              {t.steps.vision.educationText}
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-surface-high bg-white p-6 shadow-sage">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {t.vision.pathTitle}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              {t.vision.pathSubtitle}
            </p>
          </div>
        </div>
        <div className="relative mt-7 grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-6 -z-0 hidden h-0.5 bg-outline sm:block" />
          {t.vision.pathway.map((level, index) => (
            <div
              className="relative z-10 flex flex-col items-center text-center"
              key={level.label}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-surface text-sm font-bold text-white shadow-sage"
                style={{ backgroundColor: pathwayColors[index] }}
              >
                {index}
              </div>
              <p className="mt-2 text-xs font-bold text-primary">
                {level.label}
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">{level.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
          {t.vision.conceptTag}
        </p>
        <div className="mt-2 flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              {t.vision.conceptTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              {t.vision.conceptDesc}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {conceptKeys.map((key) => {
            const concept = t.vision.concepts[key];

            return (
              <article
                className="rounded-xl border border-surface-high bg-white p-5 shadow-sage transition-transform hover:-translate-y-0.5"
                key={key}
              >
                <h4 className="text-sm font-bold text-primary">
                  {concept.title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  {concept.text}
                </p>
                <p className="mt-4 border-t border-dashed border-outline pt-3 text-xs font-semibold leading-5 text-sage">
                  {concept.question}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type BuildScreenProps = {
  state: ToolState;
  translations: (typeof translations)[Language];
  onUpdateContext: (field: keyof ContextFields, value: string) => void;
  onUpdateLevel: (
    levelId: string,
    field: keyof Omit<EscalationLevel, "id" | "number">,
    value: string,
  ) => void;
  onToggleTrigger: (trigger: string) => void;
  onAddCustomTrigger: (trigger: string) => void;
  onRemoveCustomTrigger: (trigger: string) => void;
};

function BuildScreen({
  state,
  translations: t,
  onUpdateContext,
  onUpdateLevel,
  onToggleTrigger,
  onAddCustomTrigger,
  onRemoveCustomTrigger,
}: BuildScreenProps) {
  const [openLevels, setOpenLevels] = useState<string[]>([state.levels[0]?.id]);
  const [customTrigger, setCustomTrigger] = useState("");
  const selectedTriggers = [
    ...state.selectedTriggers.map((trigger) => ({
      id: trigger,
      label:
        t.build.triggerLabels[trigger as PredefinedTriggerKey] ?? trigger,
      custom: false,
    })),
    ...state.customTriggers.map((trigger) => ({
      id: trigger,
      label: trigger,
      custom: true,
    })),
  ];

  function toggleLevel(levelId: string) {
    setOpenLevels((current) =>
      current.includes(levelId)
        ? current.filter((id) => id !== levelId)
        : [...current, levelId],
    );
  }

  function submitCustomTrigger() {
    onAddCustomTrigger(customTrigger);
    setCustomTrigger("");
  }

  return (
    <div className="space-y-8">
      <ContextForm
        context={state.context}
        onUpdateContext={onUpdateContext}
        translations={t}
      />

      <section className="rounded-xl border border-surface-high bg-white p-6 shadow-sage">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-primary">
            {t.build.triggersTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {t.build.triggersIntro}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {predefinedTriggerKeys.map((key: PredefinedTriggerKey) => {
            const label = t.build.triggerLabels[key];
            const selected = state.selectedTriggers.includes(key);

            return (
              <button
                className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors ${
                  selected
                    ? "border-sage bg-sage text-white"
                    : "border-outline bg-surface-low text-sage hover:border-sage"
                }`}
                key={key}
                onClick={() => onToggleTrigger(key)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            className="min-h-11 flex-1 rounded-lg border border-outline bg-surface-low px-4 text-sm outline-none transition-colors focus:border-sage"
            onChange={(event) => setCustomTrigger(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitCustomTrigger();
              }
            }}
            placeholder={t.build.customTriggerPlaceholder}
            type="text"
            value={customTrigger}
          />
          <button
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-sage"
            onClick={submitCustomTrigger}
            type="button"
          >
            {t.build.addTrigger}
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-outline bg-surface-low p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {t.build.selectedTriggers}
          </p>
          {selectedTriggers.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTriggers.map((trigger) => {
                return (
                  <span
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sage shadow-sage"
                    key={`${trigger.custom ? "custom" : "selected"}-${trigger.id}`}
                  >
                    {trigger.label}
                    <button
                      className="text-stone-400 hover:text-primary"
                      onClick={() =>
                        trigger.custom
                          ? onRemoveCustomTrigger(trigger.id)
                          : onToggleTrigger(trigger.id)
                      }
                      type="button"
                    >
                      {t.build.remove}
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">{t.build.noTriggers}</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h3 className="text-xl font-bold text-primary">
            {t.build.levelsTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {t.build.levelsIntro}
          </p>
        </div>

        <div className="space-y-4">
          {state.levels.map((level, index) => {
            const open = openLevels.includes(level.id);

            return (
              <article
                className="overflow-hidden rounded-xl border border-surface-high bg-white shadow-sage"
                key={level.id}
                style={{ borderLeft: `5px solid ${pathwayColors[index]}` }}
              >
                <button
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface-low"
                  onClick={() => toggleLevel(level.id)}
                  type="button"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: pathwayColors[index] }}
                  >
                    {level.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-primary">
                      {level.name || t.build.fields.name}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {level.purpose || t.build.fields.purpose}
                    </span>
                  </span>
                  <span className="text-xl text-stone-400" aria-hidden="true">
                    {open ? "-" : "+"}
                  </span>
                </button>

                {open ? (
                  <div className="grid gap-4 border-t border-surface-high p-4 md:grid-cols-2">
                    <LevelTextField
                      label={t.build.fields.name}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "name", value)
                      }
                      value={level.name}
                    />
                    <LevelTextArea
                      label={t.build.fields.purpose}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "purpose", value)
                      }
                      value={level.purpose}
                    />
                    <LevelTextArea
                      label={t.build.fields.triggers}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "triggers", value)
                      }
                      value={level.triggers}
                    />
                    <LevelTextArea
                      label={t.build.fields.safeFirstStep}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "safeFirstStep", value)
                      }
                      value={level.safeFirstStep}
                    />
                    <LevelTextArea
                      label={t.build.fields.roles}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "roles", value)
                      }
                      value={level.roles}
                    />
                    <LevelTextArea
                      label={t.build.fields.safeguards}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "safeguards", value)
                      }
                      value={level.safeguards}
                    />
                    <LevelTextArea
                      label={t.build.fields.documentation}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "documentation", value)
                      }
                      value={level.documentation}
                    />
                    <LevelTextArea
                      label={t.build.fields.deEscalation}
                      onChange={(value) =>
                        onUpdateLevel(level.id, "deEscalation", value)
                      }
                      value={level.deEscalation}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type ContextFormProps = {
  context: ContextFields;
  translations: (typeof translations)[Language];
  onUpdateContext: (field: keyof ContextFields, value: string) => void;
};

const contextTextAreas: Array<keyof ContextFields> = [
  "situations",
  "power",
  "protection",
  "channels",
  "redLines",
  "openQuestions",
];

function ContextForm({
  context,
  translations: t,
  onUpdateContext,
}: ContextFormProps) {
  return (
    <section className="rounded-xl border border-surface-high bg-white p-6 shadow-sage">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-primary">
          {t.build.contextTitle}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {t.build.contextIntro}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ContextInput
          label={t.build.contextFields.teamName}
          onChange={(value) => onUpdateContext("teamName", value)}
          placeholder={t.build.contextPlaceholders.teamName}
          value={context.teamName}
        />
        <ContextInput
          label={t.build.contextFields.rhythm}
          onChange={(value) => onUpdateContext("rhythm", value)}
          placeholder={t.build.contextPlaceholders.rhythm}
          value={context.rhythm}
        />
        {contextTextAreas.map((field) => (
          <ContextTextArea
            field={field}
            key={field}
            onChange={onUpdateContext}
            translations={t}
            value={context[field]}
          />
        ))}
      </div>
    </section>
  );
}

function ContextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
        {label}
      </span>
      <input
        className="min-h-11 w-full rounded-lg border border-transparent bg-surface-low px-3 text-sm outline-none transition-colors focus:border-sage"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

function ContextTextArea({
  field,
  value,
  translations: t,
  onChange,
}: {
  field: keyof ContextFields;
  value: string;
  translations: (typeof translations)[Language];
  onChange: (field: keyof ContextFields, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
        {t.build.contextFields[field]}
      </span>
      <textarea
        className="min-h-28 w-full resize-y rounded-lg border border-transparent bg-surface-low p-3 text-sm leading-6 outline-none transition-colors focus:border-sage"
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={t.build.contextPlaceholders[field]}
        value={value}
      />
    </label>
  );
}

function LevelTextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
        {label}
      </span>
      <input
        className="min-h-11 w-full rounded-lg border border-transparent bg-surface-low px-3 text-sm outline-none transition-colors focus:border-sage"
        onChange={(event) => onChange(event.target.value)}
        type="text"
        value={value}
      />
    </label>
  );
}

function LevelTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
        {label}
      </span>
      <textarea
        className="min-h-24 w-full resize-y rounded-lg border border-transparent bg-surface-low p-3 text-sm leading-6 outline-none transition-colors focus:border-sage"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

type ReflectScreenProps = {
  state: ToolState;
  translations: (typeof translations)[Language];
};

function ReflectScreen({ state, translations: t }: ReflectScreenProps) {
  const [copied, setCopied] = useState<"sharpen" | "risk" | null>(null);
  const cards = [
    {
      id: "sharpen" as const,
      title: t.reflect.sharpenTitle,
      description: t.reflect.sharpenDescription,
      prompt: buildReflectionPrompt("sharpen", state, state.language),
    },
    {
      id: "risk" as const,
      title: t.reflect.riskTitle,
      description: t.reflect.riskDescription,
      prompt: buildReflectionPrompt("risk", state, state.language),
    },
  ];

  async function copyPrompt(id: "sharpen" | "risk", prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber/40 bg-[#fff8e1] p-5 shadow-sage">
        <p className="text-sm font-bold text-primary">{t.reflect.note}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <article
            className="flex min-h-[32rem] flex-col rounded-xl border border-surface-high bg-white p-6 shadow-sage"
            key={card.id}
          >
            <div>
              <h3 className="text-xl font-bold text-primary">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {card.description}
              </p>
            </div>

            <pre className="mt-5 min-h-0 flex-1 overflow-auto rounded-lg border border-surface-high bg-surface-low p-4 text-xs leading-5 text-ink-muted">
              {card.prompt}
            </pre>

            <button
              className="mt-5 rounded-lg border-2 border-sage px-4 py-3 text-sm font-bold text-sage transition-colors hover:bg-sage hover:text-white"
              onClick={() => copyPrompt(card.id, card.prompt)}
              type="button"
            >
              {copied === card.id ? t.reflect.copied : t.reflect.copy}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

type OutputScreenProps = {
  state: ToolState;
  translations: (typeof translations)[Language];
};

function OutputScreen({ state, translations: t }: OutputScreenProps) {
  const model = buildOutputModel(state, state.language);

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-col justify-between gap-4 rounded-xl border border-surface-high bg-white p-5 shadow-sage md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-bold text-primary">
            {t.output.previewTitle}
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            {t.output.previewIntro}
          </p>
        </div>
        <ExportButtons state={state} translations={t} />
      </div>

      <article className="print-document rounded-xl border border-surface-high bg-white p-7 shadow-lift md:p-10">
        <header className="mb-8 flex flex-col justify-between gap-4 border-b-2 border-primary pb-5 md:flex-row md:items-start">
          <div>
            <h3 className="text-3xl font-extrabold uppercase text-primary">
              {model.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-stone-500">
              {model.subtitle}
            </p>
          </div>
          <p className="text-left text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400 md:text-right">
            v1.0
            <br />
            {model.date}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr]">
          <aside className="space-y-6 border-surface-high lg:border-r lg:pr-6">
            <OutputBlock title={t.output.guidingPrinciples}>
              <OutputList items={model.principles} empty={t.output.noContent} />
            </OutputBlock>
            <OutputBlock title={t.output.triggers}>
              <OutputPills items={model.triggers} empty={t.output.noContent} />
            </OutputBlock>
            <OutputBlock title={t.output.roles}>
              <OutputList items={model.roles} empty={t.output.noContent} />
            </OutputBlock>
          </aside>

          <section className="space-y-6">
            <OutputBlock title={t.output.purpose}>
              <p className="text-sm leading-6 text-ink-muted">
                {model.purpose || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.context}>
              <p className="text-sm leading-6 text-ink-muted">
                {model.context || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.levels}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-high text-primary">
                      <th className="py-2 pr-3 font-bold">#</th>
                      <th className="px-3 py-2 font-bold">
                        {t.build.fields.name}
                      </th>
                      <th className="px-3 py-2 font-bold">
                        {t.build.fields.purpose}
                      </th>
                      <th className="py-2 pl-3 font-bold">{t.output.roles}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-high">
                    {model.levels.map((level) => (
                      <tr key={level.number}>
                        <td className="py-2 pr-3 font-bold text-primary">
                          {level.number}
                        </td>
                        <td className="px-3 py-2 font-semibold text-ink">
                          {level.name || t.output.noContent}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">
                          {level.purpose || t.output.noContent}
                        </td>
                        <td className="py-2 pl-3 text-ink-muted">
                          {level.roles || t.output.noContent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </OutputBlock>

            <OutputBlock title={t.output.reviewRhythm}>
              <p className="text-sm leading-6 text-ink-muted">
                {model.rhythm || t.output.noContent}
              </p>
            </OutputBlock>
          </section>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-surface-high pt-4 text-[10px] uppercase tracking-[0.14em] text-stone-300">
          <span>{t.sideTitle}</span>
          <span>{t.brandLine}</span>
        </footer>
      </article>
    </div>
  );
}

function OutputBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
        {title}
      </h4>
      {children}
    </section>
  );
}

function OutputList({ items, empty }: { items: string[]; empty: string }) {
  return (
    <ul className="space-y-1.5 text-sm leading-6 text-ink-muted">
      {(items.length ? items : [empty]).map((item) => (
        <li key={item}>- {item}</li>
      ))}
    </ul>
  );
}

function OutputPills({ items, empty }: { items: string[]; empty: string }) {
  return items.length ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          className="rounded-full bg-sage-soft px-2 py-1 text-[11px] font-bold text-primary"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-ink-muted">{empty}</p>
  );
}

type StepPlaceholderProps = {
  translations: (typeof translations)[Language];
};

function StepPlaceholder({ translations: t }: StepPlaceholderProps) {
  return (
    <div className="rounded-xl border border-dashed border-outline bg-surface-low p-8 text-center shadow-sage">
      <p className="text-sm font-semibold text-primary">
        {t.placeholderTitle}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-muted">
        {t.placeholderText}
      </p>
    </div>
  );
}
