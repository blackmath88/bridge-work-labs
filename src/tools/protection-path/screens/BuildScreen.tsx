import {
  ArrowRight,
  Check,
  ClipboardList,
  FileText,
  Plus,
  Route,
  Shield,
  Undo2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { pathwayColors, predefinedTriggerKeys, type PredefinedTriggerKey } from "../config";
import type {
  ContextFields,
  EscalationLevel,
  OrgConnection,
  OrgRole,
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
    <div className="space-y-8">
      <section>
        <p className="eyebrow-accent">{t.build.mapEyebrow}</p>
        <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h3 className="display-3">{t.build.mapTitle}</h3>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
              {t.build.mapIntro}
            </p>
          </div>
          {state.context.teamName ? (
            <span className="chip chip-active">{state.context.teamName}</span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <EscalationMap
            currentLevelId={selectedLevel?.id}
            levels={state.levels}
            onSelect={(levelId) =>
              dispatch({ type: "setCurrentLevel", levelId })
            }
            translations={t}
          />
          {selectedLevel ? (
            <ActionPanel level={selectedLevel} translations={t} />
          ) : null}
        </div>
      </section>

      <SafeRouteVisual
        connections={state.orgConnections}
        currentLevelId={selectedLevel?.id}
        levels={state.levels}
        roles={state.orgRoles}
        translations={t}
      />

      <details className="card overflow-hidden">
        <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
          <span>
            <span className="eyebrow-accent">{t.build.editDetails}</span>
            <span className="mt-1 block text-[14px] font-semibold tracking-tight text-ink">
              {selectedLevel?.name ?? t.build.levelsTitle}
            </span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            {selectedLevel
              ? t.levelCompletion(
                  countFilledLevelFields(selectedLevel),
                  LEVEL_FIELDS_FOR_COMPLETION.length,
                )
              : ""}
          </span>
        </summary>
        {selectedLevel ? (
          <div className="grid gap-4 border-t border-hairline bg-surface-2 p-5 md:grid-cols-2">
            <FieldInput
              label={t.build.fields.name}
              onChange={(value) => updateLevel(selectedLevel.id, "name", value)}
              value={selectedLevel.name}
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
                onChange={(value) => updateLevel(selectedLevel.id, field, value)}
                value={selectedLevel[field]}
              />
            ))}
          </div>
        ) : null}
      </details>

      <details className="card overflow-hidden">
        <summary className="cursor-pointer px-5 py-4">
          <span className="eyebrow-accent">{t.build.contextAndTriggers}</span>
          <span className="mt-1 block text-[14px] font-semibold tracking-tight text-ink">
            {t.build.contextTitle} · {t.build.triggersTitle}
          </span>
        </summary>
        <div className="space-y-8 border-t border-hairline bg-surface-2 p-5">
          <ContextForm
            context={state.context}
            translations={t}
            onUpdate={(field, value) =>
              dispatch({ type: "updateContext", field, value })
            }
          />
          <TriggerEditor
            customTrigger={customTrigger}
            onCustomTriggerChange={setCustomTrigger}
            onSubmitCustomTrigger={submitCustomTrigger}
            state={state}
            translations={t}
            dispatch={dispatch}
          />
        </div>
      </details>

      <div className="flex justify-end pt-2">
        <button className="btn-primary btn-lg" onClick={onAdvance} type="button">
          {t.continueToStep(t.steps.reflect.label)}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EscalationMap({
  levels,
  currentLevelId,
  translations: t,
  onSelect,
}: {
  levels: EscalationLevel[];
  currentLevelId?: string;
  translations: TranslationSet;
  onSelect: (levelId: string) => void;
}) {
  return (
    <div className="card p-4 md:p-5">
      <div className="grid gap-3 lg:grid-cols-5">
        {levels.map((level, index) => {
          const selected = level.id === currentLevelId;
          const accent = pathwayColors[index];
          const filled = countFilledLevelFields(level);
          return (
            <button
              className={`relative min-h-[210px] rounded-xl border bg-surface p-4 text-left shadow-e1 transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-e2 ${
                selected ? "border-ink shadow-e3" : "border-hairline"
              }`}
              key={level.id}
              onClick={() => onSelect(level.id)}
              type="button"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-1 rounded-b-full"
                style={{ backgroundColor: accent }}
              />
              <span className="flex items-center justify-between gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-[13px] font-semibold text-white"
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
              <span className="mt-2 line-clamp-3 block text-[12.5px] leading-5 text-ink-2">
                {level.purpose || t.build.fields.purpose}
              </span>
              <span className="mt-4 block border-t border-dashed border-hairline pt-3 text-[12px] font-medium leading-5 text-ink-3">
                {level.triggers || t.build.fields.triggers}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActionPanel({
  level,
  translations: t,
}: {
  level: EscalationLevel;
  translations: TranslationSet;
}) {
  const actions = [
    { icon: Route, label: t.build.fields.safeFirstStep, value: level.safeFirstStep },
    { icon: Users, label: t.build.fields.roles, value: level.roles },
    { icon: Shield, label: t.build.fields.safeguards, value: level.safeguards },
    { icon: FileText, label: t.build.fields.documentation, value: level.documentation },
    { icon: Undo2, label: t.build.fields.deEscalation, value: level.deEscalation },
  ];

  return (
    <aside className="card-elevated overflow-hidden">
      <div className="bg-ink p-5 text-white">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60">
          {t.build.selectedLevel}
        </p>
        <h4 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight">
          {level.number}. {level.name}
        </h4>
        <p className="mt-3 text-[13.5px] leading-6 text-white/75">
          {level.purpose || t.output.noContent}
        </p>
      </div>
      <div className="p-5">
        <p className="eyebrow-accent">{t.build.recommendedActions}</p>
        <div className="mt-4 space-y-3">
          {actions.map(({ icon: Icon, label, value }) => (
            <div className="flex gap-3" key={label}>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-sage-700">
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

function SafeRouteVisual({
  roles,
  connections,
  levels,
  currentLevelId,
  translations: t,
}: {
  roles: OrgRole[];
  connections: OrgConnection[];
  levels: EscalationLevel[];
  currentLevelId?: string;
  translations: TranslationSet;
}) {
  const roleById = new Map(roles.map((role) => [role.id, role]));
  const visibleRoles = roles.filter((role) =>
    connections.some((connection) => connection.from === role.id || connection.to === role.id),
  );
  const activeIndex = levels.findIndex((level) => level.id === currentLevelId);

  return (
    <section className="card p-5">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <div>
          <p className="eyebrow-accent">{t.build.safeRouteTitle}</p>
          <h3 className="display-3 mt-2">{t.build.safeRouteIntro}</h3>
        </div>
        <span className="chip chip-muted">
          <ClipboardList aria-hidden="true" className="h-3.5 w-3.5" />
          {connections.length} {t.output.levels.toLowerCase()}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="grid min-w-[760px] grid-cols-6 items-start gap-3">
          {visibleRoles.map((role, index) => {
            const connection = connections.find((item) => item.to === role.id);
            const levelIndex = connection
              ? levels.findIndex((level) => level.id === connection.levelId)
              : 0;
            const isActive = activeIndex >= 0 && levelIndex <= activeIndex;
            return (
              <div className="relative" key={role.id}>
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className={`absolute -left-3 top-6 h-0.5 w-3 ${
                      isActive ? "bg-sage-500" : "bg-hairline-strong"
                    }`}
                  />
                ) : null}
                <div
                  className={`min-h-[98px] rounded-xl border p-3 transition-colors ${
                    isActive
                      ? "border-sage-300 bg-sage-50"
                      : "border-hairline bg-surface-2"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ink shadow-e1">
                    <Users aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-[12.5px] font-semibold leading-4 tracking-tight text-ink">
                    {role.label}
                  </p>
                  <p className="mt-1 text-[11.5px] capitalize text-ink-3">
                    {t.build.orgKinds[role.kind]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {connections.map((connection) => {
          const level = levels.find((item) => item.id === connection.levelId);
          const target = roleById.get(connection.to);
          const active =
            activeIndex >= 0 &&
            levels.findIndex((item) => item.id === connection.levelId) <= activeIndex;
          return (
            <span className={active ? "chip chip-active" : "chip chip-muted"} key={`${connection.from}-${connection.to}`}>
              {level?.number}. {target?.label}
            </span>
          );
        })}
      </div>
    </section>
  );
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
