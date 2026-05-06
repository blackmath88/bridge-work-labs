import {
  Check,
  ChevronDown,
  Copy,
  PlayCircle,
  Plus,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
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
  orgScopeColors,
  orgScopeKeys,
  pathwayColors,
  predefinedTriggerKeys,
  type OrgScopeKey,
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
        onLanguageChange={setLanguage}
        onReset={resetState}
        translations={t}
      />
      <EducationPanel activeStep={activeStep} translations={t} />

      <main className="min-h-screen px-5 pb-16 pt-8 lg:ml-64 lg:px-10 lg:pt-20 xl:mr-72">
        <section className="mx-auto max-w-5xl animate-fade-in">
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
    <div className="no-print mb-9 animate-fade-in">
      <p className="eyebrow-accent">{route.eyebrow}</p>
      <h2 className="display-2 mt-3 max-w-3xl">{route.title}</h2>
      <p className="lede mt-4 max-w-2xl">{route.description}</p>
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
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow-accent">{t.vision.heroEyebrow}</p>
          <h2 className="display-1 mt-4 max-w-3xl">{t.vision.heroTitle}</h2>
          <p className="mt-5 max-w-2xl text-[20px] font-medium leading-[1.45] tracking-tight text-ink-2">
            {t.vision.heroSub}
          </p>
          <p className="lede mt-5 max-w-2xl">{t.vision.heroLead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <button
              className="btn-primary btn-lg"
              onClick={onLoadDemo}
              type="button"
            >
              <PlayCircle aria-hidden="true" className="h-4 w-4" />
              {t.vision.startDemo}
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={onBuildOwn}
              type="button"
            >
              <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
              {t.vision.buildOwn}
            </button>
            {demoMode ? (
              <span className="chip chip-active">
                <Check aria-hidden="true" className="h-3 w-3" />
                {t.vision.demoLoaded}
              </span>
            ) : null}
          </div>
        </div>

        <figure className="card-elevated relative overflow-hidden bg-gradient-to-br from-sage-700 to-sage-900 p-8 text-white md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sage-400/20 blur-2xl"
          />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sage-200">
            {t.vision.coreLabel}
          </p>
          <blockquote className="mt-4 text-[19px] font-medium leading-[1.5] tracking-tight">
            “{t.vision.coreQuote}”
          </blockquote>
          <p className="mt-6 text-[12.5px] leading-relaxed text-sage-100/80">
            {t.steps.vision.educationText}
          </p>
        </figure>
      </section>

      <Pathway translations={t} />

      <section>
        <p className="eyebrow-accent">{t.vision.conceptTag}</p>
        <h3 className="display-3 mt-2">{t.vision.conceptTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.vision.conceptDesc}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {conceptKeys.map((key) => {
            const concept = t.vision.concepts[key];
            return (
              <article
                className="card group p-5 transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-e2"
                key={key}
              >
                <h4 className="text-[14px] font-semibold tracking-tight text-ink">
                  {concept.title}
                </h4>
                <p className="mt-2 text-[13.5px] leading-6 text-ink-2">
                  {concept.text}
                </p>
                <p className="mt-4 border-t border-dashed border-hairline pt-3 text-[12.5px] font-medium leading-5 text-sage-600">
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

function Pathway({
  translations: t,
}: {
  translations: (typeof translations)[Language];
}) {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  return (
    <section className="card p-6 md:p-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow-accent">{t.vision.pathTitle}</p>
          <h3 className="display-3 mt-2">{t.vision.pathSubtitle}</h3>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 md:inline">
          0 → 4
        </span>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-6 sm:grid-cols-5">
        <div
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-gradient-to-r from-hairline-strong via-sage-300 to-hairline-strong sm:block"
        />
        {t.vision.pathway.map((level, index) => {
          const isActive = activeLevel === index;
          return (
            <button
              className="relative z-10 flex flex-col items-center text-center transition-opacity duration-150 hover:opacity-100"
              key={level.label}
              onMouseEnter={() => setActiveLevel(index)}
              onMouseLeave={() => setActiveLevel(null)}
              onFocus={() => setActiveLevel(index)}
              onBlur={() => setActiveLevel(null)}
              style={{
                opacity: activeLevel === null || isActive ? 1 : 0.55,
              }}
              type="button"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-surface font-mono text-[12px] font-semibold tracking-tight text-ink shadow-e2 transition-transform duration-200 ease-spring"
                style={{
                  background: `linear-gradient(180deg, ${pathwayColors[index]}22, transparent), white`,
                  borderColor: pathwayColors[index],
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                {index}
              </div>
              <p className="mt-3 text-[12.5px] font-semibold tracking-tight text-ink">
                {level.label}
              </p>
              <p className="mt-1 text-[11.5px] text-ink-3">{level.sub}</p>
            </button>
          );
        })}
      </div>

      <PathwayInvolvement activeLevel={activeLevel} translations={t} />
    </section>
  );
}

function PathwayInvolvement({
  activeLevel,
  translations: t,
}: {
  activeLevel: number | null;
  translations: (typeof translations)[Language];
}) {
  const actorsByLevel = t.vision.pathwayActors;

  const cumulativeByLevel: Array<Array<{
    scope: OrgScopeKey;
    label: string;
    newlyJoined: boolean;
  }>> = actorsByLevel.map((_, levelIndex) => {
    const seen = new Set<string>();
    const merged: Array<{ scope: OrgScopeKey; label: string; newlyJoined: boolean }> = [];
    for (let i = 0; i <= levelIndex; i += 1) {
      for (const actor of actorsByLevel[i]) {
        const key = `${actor.scope}::${actor.label}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        merged.push({
          scope: actor.scope,
          label: actor.label,
          newlyJoined: i === levelIndex && Boolean(actor.newlyJoined),
        });
      }
    }
    return merged;
  });

  return (
    <div className="mt-9 border-t border-hairline pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="eyebrow">{t.vision.pathwayInvolvementTitle}</p>
          <p className="mt-1 max-w-2xl text-[13px] leading-6 text-ink-2">
            {t.vision.pathwayInvolvementSub}
          </p>
        </div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          {t.vision.pathwayInvolvementHint}
        </p>
      </div>

      <div className="mt-5 hidden grid-cols-[10rem_repeat(5,_minmax(0,1fr))] gap-x-3 gap-y-2 lg:grid">
        <div />
        {t.vision.pathway.map((level, index) => (
          <div className="text-center" key={`head-${level.label}`}>
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: pathwayColors[index] }}
            >
              {String(index).padStart(2, "0")}
            </p>
          </div>
        ))}

        {orgScopeKeys.map((scope) => (
          <PathwayMatrixRow
            actorsByLevel={actorsByLevel}
            activeLevel={activeLevel}
            key={scope}
            newBadgeLabel={t.vision.pathwayInvolvementNewBadge}
            scope={scope}
            scopeLabel={t.vision.pathwayScopes[scope].label}
            scopeDescription={t.vision.pathwayScopes[scope].description}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
        {t.vision.pathway.map((level, index) => (
          <article
            className="rounded-xl border border-hairline bg-surface-2 p-4"
            key={`mobile-${level.label}`}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-semibold text-white"
                style={{ backgroundColor: pathwayColors[index] }}
              >
                {index}
              </span>
              <p className="text-[13px] font-semibold tracking-tight text-ink">
                {level.label}
              </p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {cumulativeByLevel[index].map((actor) => (
                <li
                  className="flex items-center gap-2 text-[12.5px] leading-5 text-ink-2"
                  key={`${index}-${actor.scope}-${actor.label}`}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: orgScopeColors[actor.scope] }}
                  />
                  <span className="truncate">{actor.label}</span>
                  {actor.newlyJoined ? (
                    <span className="ml-auto rounded-full bg-sage-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-sage-700">
                      {t.vision.pathwayInvolvementNewBadge}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-dashed border-hairline pt-4">
        {orgScopeKeys.map((scope) => (
          <span
            className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-3"
            key={`legend-${scope}`}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: orgScopeColors[scope] }}
            />
            {t.vision.pathwayScopes[scope].label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PathwayMatrixRow({
  actorsByLevel,
  activeLevel,
  newBadgeLabel,
  scope,
  scopeLabel,
  scopeDescription,
}: {
  actorsByLevel: Array<Array<{
    scope: OrgScopeKey;
    label: string;
    newlyJoined?: boolean;
  }>>;
  activeLevel: number | null;
  newBadgeLabel: string;
  scope: OrgScopeKey;
  scopeLabel: string;
  scopeDescription: string;
}) {
  const color = orgScopeColors[scope];
  const firstActiveLevel = actorsByLevel.findIndex((actors) =>
    actors.some((actor) => actor.scope === scope),
  );

  return (
    <>
      <div className="flex flex-col justify-center border-r border-hairline pr-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <p className="text-[12.5px] font-semibold tracking-tight text-ink">
            {scopeLabel}
          </p>
        </div>
        <p className="mt-0.5 pl-4 text-[11px] leading-4 text-ink-3">
          {scopeDescription}
        </p>
      </div>

      {actorsByLevel.map((actors, levelIndex) => {
        const cellActors = actors.filter((actor) => actor.scope === scope);
        const isCarried =
          firstActiveLevel !== -1 &&
          levelIndex > firstActiveLevel &&
          cellActors.length === 0;
        const dimmed = activeLevel !== null && activeLevel !== levelIndex;

        return (
          <div
            className="flex min-h-[2.25rem] flex-col items-stretch justify-center gap-1 transition-opacity duration-150"
            key={`cell-${scope}-${levelIndex}`}
            style={{ opacity: dimmed ? 0.35 : 1 }}
          >
            {cellActors.length ? (
              cellActors.map((actor) => (
                <div
                  className="rounded-md border bg-surface px-2 py-1 text-[11.5px] leading-4 tracking-tight text-ink"
                  key={`${scope}-${levelIndex}-${actor.label}`}
                  style={{
                    borderColor: `${color}55`,
                    boxShadow: actor.newlyJoined
                      ? `inset 3px 0 0 ${color}`
                      : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{actor.label}</span>
                    {actor.newlyJoined ? (
                      <span
                        className="ml-auto shrink-0 rounded-full px-1.5 py-[1px] font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white"
                        style={{ backgroundColor: color }}
                      >
                        {newBadgeLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            ) : isCarried ? (
              <div
                aria-hidden="true"
                className="mx-auto h-px w-8"
                style={{ backgroundColor: `${color}55` }}
              />
            ) : (
              <div aria-hidden="true" className="h-px" />
            )}
          </div>
        );
      })}
    </>
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
    <div className="space-y-10">
      <ContextForm
        context={state.context}
        onUpdateContext={onUpdateContext}
        translations={t}
      />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow-accent">02 / Triggers</p>
            <h3 className="display-3 mt-2">{t.build.triggersTitle}</h3>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
              {t.build.triggersIntro}
            </p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex flex-wrap gap-1.5">
            {predefinedTriggerKeys.map((key: PredefinedTriggerKey) => {
              const label = t.build.triggerLabels[key];
              const selected = state.selectedTriggers.includes(key);

              return (
                <button
                  className={`chip transition-all duration-150 ease-spring active:scale-[0.97] ${
                    selected
                      ? "chip-active"
                      : "hover:border-sage-300 hover:text-ink"
                  }`}
                  key={key}
                  onClick={() => onToggleTrigger(key)}
                  type="button"
                >
                  {selected ? (
                    <Check aria-hidden="true" className="h-3 w-3" />
                  ) : (
                    <Plus aria-hidden="true" className="h-3 w-3 text-ink-4" />
                  )}
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              className="field flex-1"
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
              className="btn-primary"
              onClick={submitCustomTrigger}
              type="button"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              {t.build.addTrigger}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-4">
            <p className="eyebrow">{t.build.selectedTriggers}</p>
            {selectedTriggers.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedTriggers.map((trigger) => (
                  <span
                    className="chip chip-active gap-2"
                    key={`${trigger.custom ? "custom" : "selected"}-${trigger.id}`}
                  >
                    {trigger.label}
                    <button
                      aria-label={t.build.remove}
                      className="-mr-1 rounded-full p-0.5 text-sage-700/70 transition-colors hover:bg-sage-100 hover:text-sage-700"
                      onClick={() =>
                        trigger.custom
                          ? onRemoveCustomTrigger(trigger.id)
                          : onToggleTrigger(trigger.id)
                      }
                      type="button"
                    >
                      <X aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-ink-3">{t.build.noTriggers}</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="eyebrow-accent">03 / Levels</p>
          <h3 className="display-3 mt-2">{t.build.levelsTitle}</h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
            {t.build.levelsIntro}
          </p>
        </div>

        <div className="space-y-2.5">
          {state.levels.map((level, index) => {
            const open = openLevels.includes(level.id);
            const accent = pathwayColors[index];

            return (
              <article
                className="card overflow-hidden transition-shadow duration-200 ease-out-expo data-[open=true]:shadow-e2"
                data-open={open}
                key={level.id}
              >
                <button
                  className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
                  onClick={() => toggleLevel(level.id)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[13px] font-semibold text-white shadow-e1"
                    style={{ backgroundColor: accent }}
                  >
                    {level.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold tracking-tight text-ink">
                      {level.name || t.build.fields.name}
                    </span>
                    <span className="block truncate text-[12.5px] text-ink-3">
                      {level.purpose || t.build.fields.purpose}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 ease-spring ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open ? (
                  <div className="grid animate-fade-in gap-4 border-t border-hairline bg-surface-2 p-5 md:grid-cols-2">
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
    <section>
      <div className="mb-5">
        <p className="eyebrow-accent">01 / Context</p>
        <h3 className="display-3 mt-2">{t.build.contextTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.build.contextIntro}
        </p>
      </div>

      <div className="card p-5">
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
      <span className="field-label">{label}</span>
      <input
        className="field"
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
      <span className="field-label">{t.build.contextFields[field]}</span>
      <textarea
        className="field"
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
      <span className="field-label">{label}</span>
      <input
        className="field"
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
      <span className="field-label">{label}</span>
      <textarea
        className="field"
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
      <div className="rounded-2xl border border-accent-400/40 bg-accent-400/10 p-4">
        <p className="text-[13.5px] font-medium leading-6 tracking-tight text-ink">
          {t.reflect.note}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <article
            className="card flex min-h-[32rem] flex-col p-6"
            key={card.id}
          >
            <div>
              <p className="eyebrow">{card.id === "sharpen" ? "Prompt 01" : "Prompt 02"}</p>
              <h3 className="display-3 mt-2">{card.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-ink-2">
                {card.description}
              </p>
            </div>

            <pre className="mt-5 min-h-0 flex-1 overflow-auto rounded-xl border border-hairline bg-surface-2 p-4 font-mono text-[12px] leading-5 text-ink-2">
              {card.prompt}
            </pre>

            <button
              className="btn-secondary mt-5 self-start"
              onClick={() => copyPrompt(card.id, card.prompt)}
              type="button"
            >
              {copied === card.id ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-sage-500" />
              ) : (
                <Copy aria-hidden="true" className="h-3.5 w-3.5" />
              )}
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
      <div className="no-print card flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
        <div>
          <p className="eyebrow">Preview</p>
          <h3 className="display-3 mt-1">{t.output.previewTitle}</h3>
          <p className="mt-1 text-[13.5px] leading-6 text-ink-2">
            {t.output.previewIntro}
          </p>
        </div>
        <ExportButtons state={state} translations={t} />
      </div>

      <article className="print-document card-elevated p-7 md:p-12">
        <header className="mb-9 flex flex-col justify-between gap-4 border-b border-hairline-strong pb-6 md:flex-row md:items-start">
          <div>
            <p className="eyebrow">Protection Path</p>
            <h3 className="mt-2 text-[26px] font-semibold tracking-tightest text-ink md:text-[32px]">
              {model.title}
            </h3>
            <p className="mt-2 text-[13.5px] tracking-tight text-ink-2">
              {model.subtitle}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
              v1.0 — {model.date}
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              Folio 01 / 01
            </p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <aside className="space-y-7 lg:border-r lg:border-hairline lg:pr-8">
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

          <section className="space-y-7">
            <OutputBlock title={t.output.purpose}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.purpose || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.context}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.context || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.levels}>
              <div className="overflow-hidden rounded-xl border border-hairline">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead className="bg-surface-2">
                    <tr className="text-ink-3">
                      <th className="px-3 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
                        #
                      </th>
                      <th className="px-3 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
                        {t.build.fields.name}
                      </th>
                      <th className="px-3 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
                        {t.build.fields.purpose}
                      </th>
                      <th className="px-3 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
                        {t.output.roles}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {model.levels.map((level) => (
                      <tr key={level.number}>
                        <td className="px-3 py-3 font-mono text-[12px] font-semibold text-ink">
                          {String(level.number).padStart(2, "0")}
                        </td>
                        <td className="px-3 py-3 font-medium text-ink">
                          {level.name || t.output.noContent}
                        </td>
                        <td className="px-3 py-3 text-ink-2">
                          {level.purpose || t.output.noContent}
                        </td>
                        <td className="px-3 py-3 text-ink-2">
                          {level.roles || t.output.noContent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </OutputBlock>

            <OutputBlock title={t.output.reviewRhythm}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.rhythm || t.output.noContent}
              </p>
            </OutputBlock>
          </section>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-hairline pt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
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
      <h4 className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-3">
        {title}
      </h4>
      {children}
    </section>
  );
}

function OutputList({ items, empty }: { items: string[]; empty: string }) {
  return (
    <ul className="space-y-1.5 text-[14px] leading-7 text-ink-2">
      {(items.length ? items : [empty]).map((item) => (
        <li className="flex gap-2.5" key={item}>
          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-ink-4" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OutputPills({ items, empty }: { items: string[]; empty: string }) {
  return items.length ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-2.5 py-1 text-[11.5px] font-medium tracking-tight text-sage-700"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-[14px] text-ink-3">{empty}</p>
  );
}

type StepPlaceholderProps = {
  translations: (typeof translations)[Language];
};

function StepPlaceholder({ translations: t }: StepPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong bg-surface-2 p-10 text-center">
      <p className="text-[14px] font-semibold tracking-tight text-ink">
        {t.placeholderTitle}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-[13.5px] leading-6 text-ink-2">
        {t.placeholderText}
      </p>
    </div>
  );
}
