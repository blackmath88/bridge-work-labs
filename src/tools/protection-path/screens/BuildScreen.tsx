import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
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
};

export function BuildScreen({ state, translations: t, dispatch }: BuildScreenProps) {
  const [openLevels, setOpenLevels] = useState<string[]>(() => {
    const first = state.levels[0]?.id;
    return first ? [first] : [];
  });
  const [customTrigger, setCustomTrigger] = useState("");

  function toggleLevel(levelId: string) {
    setOpenLevels((current) =>
      current.includes(levelId)
        ? current.filter((id) => id !== levelId)
        : [...current, levelId],
    );
  }

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
    <div className="space-y-10">
      <ContextForm
        context={state.context}
        translations={t}
        onUpdate={(field, value) =>
          dispatch({ type: "updateContext", field, value })
        }
      />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow-accent">02 / {t.build.sectionLabels.triggers}</p>
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
              const selected = isPredefinedSelected(state.triggers, key);

              return (
                <button
                  className={`chip transition-all duration-150 ease-spring active:scale-[0.97] ${
                    selected
                      ? "chip-active"
                      : "hover:border-sage-300 hover:text-ink"
                  }`}
                  key={key}
                  onClick={() =>
                    dispatch({ type: "togglePredefinedTrigger", key })
                  }
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
              disabled={!customTrigger.trim()}
              onClick={submitCustomTrigger}
              type="button"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              {t.build.addTrigger}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-4">
            <p className="eyebrow">{t.build.selectedTriggers}</p>
            {state.triggers.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {state.triggers.map((trigger) => (
                  <SelectedTriggerChip
                    key={triggerKey(trigger)}
                    label={getTriggerLabel(trigger, state.language)}
                    removeLabel={t.build.remove}
                    onRemove={() =>
                      dispatch({ type: "removeTrigger", trigger })
                    }
                  />
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
          <p className="eyebrow-accent">03 / {t.build.sectionLabels.levels}</p>
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
                  <span className="hidden shrink-0 font-mono text-[11px] tracking-wide text-ink-3 sm:inline">
                    {t.levelCompletion(
                      countFilledLevelFields(level),
                      LEVEL_FIELDS_FOR_COMPLETION.length,
                    )}
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
                    <FieldInput
                      label={t.build.fields.name}
                      onChange={(value) => updateLevel(level.id, "name", value)}
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
                        onChange={(value) => updateLevel(level.id, field, value)}
                        value={level[field]}
                      />
                    ))}
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
      <div className="mb-5">
        <p className="eyebrow-accent">01 / {t.build.sectionLabels.context}</p>
        <h3 className="display-3 mt-2">{t.build.contextTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.build.contextIntro}
        </p>
      </div>

      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldInput
            label={t.build.contextFields.teamName}
            onChange={(value) => onUpdate("teamName", value)}
            placeholder={t.build.contextPlaceholders.teamName}
            value={context.teamName}
          />
          <FieldInput
            label={t.build.contextFields.rhythm}
            onChange={(value) => onUpdate("rhythm", value)}
            placeholder={t.build.contextPlaceholders.rhythm}
            value={context.rhythm}
          />
          {contextTextAreas.map((field) => (
            <FieldTextArea
              key={field}
              label={t.build.contextFields[field]}
              onChange={(value) => onUpdate(field, value)}
              placeholder={t.build.contextPlaceholders[field]}
              value={context[field]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FieldInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
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

function FieldTextArea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        className="field"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
