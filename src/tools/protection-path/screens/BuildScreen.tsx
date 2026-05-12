import {
  ArrowRight,
  Check,
  FileText,
  Plus,
  Route,
  Shield,
  Undo2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import { pathwayColors, predefinedTriggerKeys, type PredefinedTriggerKey } from "../config";
import type {
  ContextFields,
  EscalationLevel,
  ToolState,
  Trigger,
} from "../schema";
import type { ToolAction } from "../state";
import type { TranslationSet } from "../translations";
import { getTriggerLabel, isPredefinedSelected } from "../triggers";

const LEVEL_FIELDS_FOR_COMPLETION: Array<keyof Omit<EscalationLevel, "id" | "number">> = [
  "name",
  "purpose",
  "triggers",
  "safeFirstStep",
  "roles",
  "safeguards",
  "documentation",
  "deEscalation",
];

const routeThreadByLevel: Record<string, string[]> = {
  normal: ["affectedPerson", "teamLead", "decisionOwner"],
  "early-signal": ["affectedPerson", "teamLead", "independentSupport"],
  "protected-consultation": ["affectedPerson", "independentSupport", "decisionOwner"],
  "formal-clarification": ["independentSupport", "decisionOwner", "hrLegal"],
  "protection-mode": ["affectedPerson", "independentSupport", "hrLegal", "executiveSponsor"],
};

type RouteType = "safe" | "normal" | "caution";
type RouteNodeId = keyof TranslationSet["build"]["routeNodeLabels"];

type RouteConnector = {
  from: RouteNodeId;
  to: RouteNodeId;
  type: RouteType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const routeConnectors: RouteConnector[] = [
  { from: "affectedPerson", to: "teamLead", type: "normal", x1: 15, y1: 36, x2: 41, y2: 36 },
  { from: "teamLead", to: "decisionOwner", type: "caution", x1: 49, y1: 36, x2: 75, y2: 36 },
  { from: "affectedPerson", to: "independentSupport", type: "safe", x1: 16, y1: 42, x2: 42, y2: 70 },
  { from: "independentSupport", to: "decisionOwner", type: "safe", x1: 50, y1: 70, x2: 75, y2: 42 },
  { from: "decisionOwner", to: "hrLegal", type: "normal", x1: 83, y1: 42, x2: 58, y2: 70 },
  { from: "hrLegal", to: "executiveSponsor", type: "safe", x1: 66, y1: 70, x2: 84, y2: 70 },
];

function countFilledLevelFields(level: EscalationLevel): number {
  return LEVEL_FIELDS_FOR_COMPLETION.reduce(
    (count, field) => (level[field].trim() ? count + 1 : count),
    0,
  );
}

type BuildScreenProps = {
  state: ToolState;
  translations: TranslationSet;
  dispatch: (action: ToolAction) => void;
  onAdvance: () => void;
};

export function BuildScreen({
  state,
  translations: t,
  dispatch,
  onAdvance,
}: BuildScreenProps) {
  const [customTrigger, setCustomTrigger] = useState("");
  const [viewMode, setViewMode] = useState<"simple" | "detailed">("simple");
  const selectedLevel =
    state.levels.find((level) => level.id === state.currentLevelId) ??
    state.levels[0];

  function submitCustomTrigger() {
    if (!customTrigger.trim()) {
      return;
    }
    dispatch({ type: "addCustomTrigger", label: customTrigger });
    setCustomTrigger("");
  }

  function updateLevel(
    levelId: string,
    field: keyof Omit<EscalationLevel, "id" | "number">,
    value: string,
  ) {
    dispatch({ type: "updateLevel", levelId, field, value });
  }

  return (
    <div className="space-y-7">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EscalationLaneCanvas
          currentLevelId={selectedLevel?.id}
          levels={state.levels}
          onSelect={(levelId) => dispatch({ type: "setCurrentLevel", levelId })}
          setViewMode={setViewMode}
          translations={t}
          viewMode={viewMode}
        />
        {selectedLevel ? (
          <ActionDetailPanel level={selectedLevel} translations={t} />
        ) : null}
      </section>

      <UnderlyingModelEditor
        customTrigger={customTrigger}
        dispatch={dispatch}
        onCustomTriggerChange={setCustomTrigger}
        onSubmitCustomTrigger={submitCustomTrigger}
        onUpdateContext={(field, value) =>
          dispatch({ type: "updateContext", field, value })
        }
        onUpdateLevel={updateLevel}
        selectedLevelId={selectedLevel?.id}
        state={state}
        translations={t}
      />

      <div className="flex justify-end pt-2">
        <button className="btn-primary btn-lg" onClick={onAdvance} type="button">
          {t.continueToStep(t.steps.reflect.label)}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EscalationLaneCanvas({
  levels,
  currentLevelId,
  translations: t,
  viewMode,
  setViewMode,
  onSelect,
}: {
  levels: EscalationLevel[];
  currentLevelId?: string;
  translations: TranslationSet;
  viewMode: "simple" | "detailed";
  setViewMode: (mode: "simple" | "detailed") => void;
  onSelect: (levelId: string) => void;
}) {
  const selectedIndex = Math.max(
    0,
    levels.findIndex((level) => level.id === currentLevelId),
  );
  const activeRoleIds = new Set(routeThreadByLevel[currentLevelId ?? "normal"] ?? []);

  return (
    <div className="card-elevated overflow-hidden">
      <div className="flex flex-col justify-between gap-4 border-b border-hairline bg-surface px-5 py-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow-accent">{t.build.mapEyebrow}</p>
          <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-ink">
            {t.build.mapTitle}
          </h3>
          <p className="mt-2 max-w-3xl text-[13.5px] leading-6 text-ink-2">
            {t.build.mapIntro}
          </p>
        </div>
        <div className="segmented shrink-0">
          <button
            data-active={viewMode === "simple"}
            onClick={() => setViewMode("simple")}
            type="button"
          >
            {t.build.laneModeSimple}
          </button>
          <button
            data-active={viewMode === "detailed"}
            onClick={() => setViewMode("detailed")}
            type="button"
          >
            {t.build.laneModeDetailed}
          </button>
        </div>
      </div>

      <div className="bg-surface-2 p-4 md:p-5">
        <div className="relative rounded-xl border border-hairline bg-surface p-4 shadow-e1">
          <div
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-[72px] hidden h-1 rounded-full bg-hairline-strong lg:block"
          />
          <div
            aria-hidden="true"
            className="absolute left-[8%] top-[72px] hidden h-1 rounded-full bg-sage-500 transition-all lg:block"
            style={{ width: `${Math.min(84, selectedIndex * 21)}%` }}
          />
          <div className="relative z-10 grid gap-3 lg:grid-cols-5">
            {levels.map((level, index) => (
              <EscalationNode
                active={index <= selectedIndex}
                detailed={viewMode === "detailed"}
                key={level.id}
                level={level}
                onSelect={() => onSelect(level.id)}
                selected={level.id === currentLevelId}
                translations={t}
              />
            ))}
          </div>

          <RoleRouteMap
            activeRoleIds={activeRoleIds}
            selectedLevelId={currentLevelId}
            translations={t}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}

function EscalationNode({
  level,
  selected,
  active,
  detailed,
  translations: t,
  onSelect,
}: {
  level: EscalationLevel;
  selected: boolean;
  active: boolean;
  detailed: boolean;
  translations: TranslationSet;
  onSelect: () => void;
}) {
  const accent = pathwayColors[level.number] ?? pathwayColors[0];
  const filled = countFilledLevelFields(level);

  return (
    <button
      className={`min-h-[168px] rounded-xl border p-4 text-left transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-e2 ${
        selected
          ? "border-ink bg-white shadow-e3"
          : active
            ? "border-sage-300 bg-sage-50/70 shadow-e1"
            : "border-hairline bg-surface-2"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[14px] font-semibold text-white shadow-e1"
          style={{ backgroundColor: accent }}
        >
          {level.number}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {t.levelCompletion(filled, LEVEL_FIELDS_FOR_COMPLETION.length)}
        </span>
      </span>
      <span className="mt-4 block text-[15px] font-semibold leading-5 tracking-tight text-ink">
        {level.name || t.build.fields.name}
      </span>
      <span className="mt-2 block text-[12.5px] leading-5 text-ink-2">
        {level.purpose || t.output.noContent}
      </span>
      {detailed ? (
        <span className="mt-4 block border-t border-dashed border-hairline pt-3 text-[12px] font-medium leading-5 text-ink-3">
          {level.triggers || t.build.fields.triggers}
        </span>
      ) : null}
    </button>
  );
}

function RoleRouteMap({
  activeRoleIds,
  selectedLevelId,
  translations: t,
  viewMode,
}: {
  activeRoleIds: Set<string>;
  selectedLevelId?: string;
  translations: TranslationSet;
  viewMode: "simple" | "detailed";
}) {
  const nodeLabels = t.build.routeNodeLabels;
  const routeNodes: Array<{ id: RouteNodeId; x: string; y: string; type: RouteType }> = [
    { id: "affectedPerson", x: "7%", y: "24%", type: "safe" },
    { id: "teamLead", x: "36%", y: "24%", type: "normal" },
    { id: "decisionOwner", x: "70%", y: "24%", type: "caution" },
    { id: "independentSupport", x: "36%", y: "64%", type: "safe" },
    { id: "hrLegal", x: "56%", y: "64%", type: "normal" },
    { id: "executiveSponsor", x: "78%", y: "64%", type: "safe" },
  ];

  return (
    <div className="mt-5 rounded-xl border border-hairline bg-[#fbfaf7] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow-accent">{t.build.safeRouteTitle}</p>
          <p className="mt-1 text-[13px] leading-5 text-ink-2">{t.build.safeRouteIntro}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["safe", "normal", "caution"] as const).map((type) => (
            <span className={routeLegendClass(type)} key={type}>
              {t.build.routeTypes[type]}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-hairline bg-surface">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {routeConnectors.map((connector) => {
            const highlighted =
              activeRoleIds.has(connector.from) && activeRoleIds.has(connector.to);
            return (
              <line
                key={`${connector.from}-${connector.to}`}
                stroke={routeColor(connector.type)}
                strokeDasharray={connector.type === "caution" ? "5 5" : undefined}
                strokeLinecap="round"
                strokeWidth={highlighted ? 1.8 : 0.8}
                opacity={highlighted ? 1 : 0.24}
                x1={connector.x1}
                x2={connector.x2}
                y1={connector.y1}
                y2={connector.y2}
              />
            );
          })}
        </svg>

        {routeNodes.map((node) => (
          <RouteNode
            active={activeRoleIds.has(node.id)}
            key={node.id}
            label={nodeLabels[node.id]}
            routeType={node.type}
            style={{ left: node.x, top: node.y }}
          />
        ))}

        {viewMode === "detailed" ? (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {(routeThreadByLevel[selectedLevelId ?? "normal"] ?? []).map((nodeId) => (
              <span className="chip chip-active" key={nodeId}>
                {nodeLabels[nodeId as RouteNodeId]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RouteNode({
  label,
  routeType,
  active,
  style,
}: {
  label: string;
  routeType: RouteType;
  active: boolean;
  style: CSSProperties;
}) {
  return (
    <div
      className={`absolute w-[168px] -translate-x-1/2 rounded-xl border p-3 shadow-e1 transition-all duration-200 ${
        active
          ? "border-ink bg-white shadow-e3"
          : "border-hairline bg-surface-2 opacity-70"
      }`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${routeDotClass(routeType)}`} />
        <span className="text-[12.5px] font-semibold leading-4 tracking-tight text-ink">
          {label}
        </span>
      </div>
    </div>
  );
}

function ActionDetailPanel({
  level,
  translations: t,
}: {
  level: EscalationLevel;
  translations: TranslationSet;
}) {
  const actions = [
    { icon: Shield, label: t.build.fields.purpose, value: level.purpose },
    { icon: Route, label: t.build.fields.triggers, value: level.triggers },
    { icon: Check, label: t.build.fields.safeFirstStep, value: level.safeFirstStep },
    { icon: Users, label: t.build.fields.roles, value: level.roles },
    { icon: FileText, label: t.build.fields.documentation, value: level.documentation },
    { icon: Undo2, label: t.build.fields.deEscalation, value: level.deEscalation },
  ];

  return (
    <aside className="card-elevated sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden">
      <div className="bg-ink p-5 text-white">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60">
          {t.build.selectedLevel}
        </p>
        <h4 className="mt-2 text-[25px] font-semibold leading-tight tracking-tight">
          {level.number}. {level.name}
        </h4>
        <p className="mt-3 text-[13.5px] leading-6 text-white/75">
          {level.safeFirstStep || level.purpose || t.output.noContent}
        </p>
      </div>
      <div className="max-h-[calc(100vh-17rem)] overflow-y-auto p-5">
        <p className="eyebrow-accent">{t.build.recommendedActions}</p>
        <div className="mt-4 space-y-3">
          {actions.map(({ icon: Icon, label, value }) => (
            <div className="flex gap-3 rounded-lg border border-hairline bg-surface-2 p-3" key={label}>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-sage-700 shadow-e1">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
                  {label}
                </span>
                <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">
                  {value || t.output.noContent}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function UnderlyingModelEditor({
  state,
  translations: t,
  selectedLevelId,
  customTrigger,
  onCustomTriggerChange,
  onSubmitCustomTrigger,
  onUpdateContext,
  onUpdateLevel,
  dispatch,
}: {
  state: ToolState;
  translations: TranslationSet;
  selectedLevelId?: string;
  customTrigger: string;
  onCustomTriggerChange: (value: string) => void;
  onSubmitCustomTrigger: () => void;
  onUpdateContext: (field: keyof ContextFields, value: string) => void;
  onUpdateLevel: (
    levelId: string,
    field: keyof Omit<EscalationLevel, "id" | "number">,
    value: string,
  ) => void;
  dispatch: (action: ToolAction) => void;
}) {
  return (
    <details className="card overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
        <span>
          <span className="eyebrow-accent">{t.build.underlyingModelEditor}</span>
          <span className="mt-1 block text-[14px] font-semibold tracking-tight text-ink">
            {t.build.contextTitle} · {t.build.triggersTitle} · {t.build.levelsTitle}
          </span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          {state.levels.length} {t.output.levels.toLowerCase()}
        </span>
      </summary>

      <div className="space-y-8 border-t border-hairline bg-surface-2 p-5">
        <ContextForm
          context={state.context}
          translations={t}
          onUpdate={onUpdateContext}
        />
        <TriggerEditor
          customTrigger={customTrigger}
          onCustomTriggerChange={onCustomTriggerChange}
          onSubmitCustomTrigger={onSubmitCustomTrigger}
          state={state}
          translations={t}
          dispatch={dispatch}
        />

        <section>
          <div className="mb-4">
            <p className="eyebrow-accent">03 / {t.build.sectionLabels.levels}</p>
            <h3 className="display-3 mt-2">{t.build.levelsTitle}</h3>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
              {t.build.levelsIntro}
            </p>
          </div>
          <div className="space-y-3">
            {state.levels.map((level) => (
              <details
                className="overflow-hidden rounded-xl border border-hairline bg-surface"
                key={level.id}
                open={level.id === selectedLevelId}
              >
                <summary className="cursor-pointer px-4 py-3">
                  <span className="font-semibold tracking-tight text-ink">
                    {level.number}. {level.name || t.build.fields.name}
                  </span>
                  <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    {t.levelCompletion(
                      countFilledLevelFields(level),
                      LEVEL_FIELDS_FOR_COMPLETION.length,
                    )}
                  </span>
                </summary>
                <div className="grid gap-4 border-t border-hairline bg-surface-2 p-4 md:grid-cols-2">
                  <FieldInput
                    label={t.build.fields.name}
                    onChange={(value) => onUpdateLevel(level.id, "name", value)}
                    value={level.name}
                  />
                  {(
                    [
                      "purpose",
                      "triggers",
                      "safeFirstStep",
                      "roles",
                      "safeguards",
                      "documentation",
                      "deEscalation",
                    ] as const
                  ).map((field) => (
                    <FieldTextArea
                      key={field}
                      label={t.build.fields[field]}
                      onChange={(value) => onUpdateLevel(level.id, field, value)}
                      value={level[field]}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </details>
  );
}

function routeColor(type: RouteType): string {
  if (type === "safe") return "#5f8d80";
  if (type === "caution") return "#c05621";
  return "#64748b";
}

function routeDotClass(type: RouteType): string {
  if (type === "safe") return "bg-sage-500";
  if (type === "caution") return "bg-[#c05621]";
  return "bg-ink-4";
}

function routeLegendClass(type: RouteType): string {
  if (type === "safe") return "chip border-sage-300 bg-sage-50 text-sage-700";
  if (type === "caution") return "chip border-[#c05621]/30 bg-[#fff7ed] text-[#9a3412]";
  return "chip chip-muted";
}

function TriggerEditor({
  state,
  translations: t,
  customTrigger,
  onCustomTriggerChange,
  onSubmitCustomTrigger,
  dispatch,
}: {
  state: ToolState;
  translations: TranslationSet;
  customTrigger: string;
  onCustomTriggerChange: (value: string) => void;
  onSubmitCustomTrigger: () => void;
  dispatch: (action: ToolAction) => void;
}) {
  return (
    <section>
      <div className="mb-4">
        <p className="eyebrow-accent">02 / {t.build.sectionLabels.triggers}</p>
        <h3 className="display-3 mt-2">{t.build.triggersTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.build.triggersIntro}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {predefinedTriggerKeys.map((key: PredefinedTriggerKey) => {
          const label = t.build.triggerLabels[key];
          const selected = isPredefinedSelected(state.triggers, key);
          return (
            <button
              className={`chip transition-all duration-150 ease-spring active:scale-[0.97] ${
                selected ? "chip-active" : "hover:border-sage-300 hover:text-ink"
              }`}
              key={key}
              onClick={() => dispatch({ type: "togglePredefinedTrigger", key })}
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
          onChange={(event) => onCustomTriggerChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmitCustomTrigger();
            }
          }}
          placeholder={t.build.customTriggerPlaceholder}
          type="text"
          value={customTrigger}
        />
        <button
          className="btn-primary"
          disabled={!customTrigger.trim()}
          onClick={onSubmitCustomTrigger}
          type="button"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          {t.build.addTrigger}
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-hairline bg-surface p-4">
        <p className="eyebrow">{t.build.selectedTriggers}</p>
        {state.triggers.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {state.triggers.map((trigger) => (
              <SelectedTriggerChip
                key={triggerKey(trigger)}
                label={getTriggerLabel(trigger, state.language)}
                removeLabel={t.build.remove}
                onRemove={() => dispatch({ type: "removeTrigger", trigger })}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-ink-3">{t.build.noTriggers}</p>
        )}
      </div>
    </section>
  );
}

function triggerKey(trigger: Trigger): string {
  return trigger.source === "predefined"
    ? `predefined-${trigger.key}`
    : `custom-${trigger.id}`;
}

function SelectedTriggerChip({
  label,
  removeLabel,
  onRemove,
}: {
  label: string;
  removeLabel: string;
  onRemove: () => void;
}) {
  return (
    <span className="chip chip-active gap-2">
      {label}
      <button
        aria-label={removeLabel}
        className="-mr-1 rounded-full p-0.5 text-sage-700/70 transition-colors hover:bg-sage-100 hover:text-sage-700"
        onClick={onRemove}
        type="button"
      >
        <X aria-hidden="true" className="h-3 w-3" />
      </button>
    </span>
  );
}

type ContextFormProps = {
  context: ContextFields;
  translations: TranslationSet;
  onUpdate: (field: keyof ContextFields, value: string) => void;
};

const contextTextAreas: Array<keyof ContextFields> = [
  "situations",
  "power",
  "protection",
  "channels",
  "redLines",
  "openQuestions",
];

function ContextForm({ context, translations: t, onUpdate }: ContextFormProps) {
  return (
    <section>
      <div className="mb-4">
        <p className="eyebrow-accent">01 / {t.build.sectionLabels.context}</p>
        <h3 className="display-3 mt-2">{t.build.contextTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.build.contextIntro}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldInput
          filled={isFilled(context.teamName)}
          label={t.build.contextFields.teamName}
          onChange={(value) => onUpdate("teamName", value)}
          placeholder={t.build.contextPlaceholders.teamName}
          value={context.teamName}
        />
        <FieldInput
          filled={isFilled(context.rhythm)}
          label={t.build.contextFields.rhythm}
          onChange={(value) => onUpdate("rhythm", value)}
          placeholder={t.build.contextPlaceholders.rhythm}
          value={context.rhythm}
        />
        {contextTextAreas.map((field) => (
          <FieldTextArea
            filled={isFilled(context[field])}
            key={field}
            label={t.build.contextFields[field]}
            onChange={(value) => onUpdate(field, value)}
            placeholder={t.build.contextPlaceholders[field]}
            value={context[field]}
          />
        ))}
      </div>
    </section>
  );
}

function isFilled(value: string): boolean {
  return value.trim().length > 0;
}

function FieldInput({
  label,
  value,
  placeholder,
  filled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  filled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel filled={filled} label={label} />
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

function FieldTextArea({
  label,
  value,
  placeholder,
  filled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  filled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel filled={filled} label={label} />
      <textarea
        className="field"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function FieldLabel({ label, filled }: { label: string; filled?: boolean }) {
  if (filled === undefined) {
    return <span className="field-label">{label}</span>;
  }
  return (
    <span className="field-label flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          filled ? "bg-sage-500" : "bg-ink-4/40"
        }`}
      />
      {label}
    </span>
  );
}
