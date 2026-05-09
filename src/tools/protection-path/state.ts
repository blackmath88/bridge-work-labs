import { predefinedTriggerKeys, type PredefinedTriggerKey } from "./config";
import { getDemoState } from "./demo";
import {
  createDefaultToolState,
  type ContextFields,
  type EscalationLevel,
  type Language,
  type ToolState,
  type Trigger,
} from "./schema";
import {
  addCustomTrigger as addCustomTriggerToList,
  removeTrigger as removeTriggerFromList,
  togglePredefined,
} from "./triggers";

export type ToolAction =
  | { type: "setLanguage"; language: Language }
  | { type: "loadDemo" }
  | { type: "buildOwn" }
  | { type: "reset" }
  | { type: "updateContext"; field: keyof ContextFields; value: string }
  | {
      type: "updateLevel";
      levelId: string;
      field: keyof Omit<EscalationLevel, "id" | "number">;
      value: string;
    }
  | { type: "togglePredefinedTrigger"; key: PredefinedTriggerKey }
  | { type: "addCustomTrigger"; label: string }
  | { type: "removeTrigger"; trigger: Trigger };

export function toolStateReducer(
  state: ToolState,
  action: ToolAction,
): ToolState {
  switch (action.type) {
    case "setLanguage":
      return state.demoMode
        ? getDemoState(action.language)
        : { ...state, language: action.language };
    case "loadDemo":
      return getDemoState(state.language);
    case "buildOwn":
    case "reset":
      return createDefaultToolState(state.language);
    case "updateContext":
      return {
        ...state,
        context: { ...state.context, [action.field]: action.value },
      };
    case "updateLevel":
      return {
        ...state,
        levels: state.levels.map((level) =>
          level.id === action.levelId
            ? { ...level, [action.field]: action.value }
            : level,
        ),
      };
    case "togglePredefinedTrigger":
      return {
        ...state,
        triggers: togglePredefined(state.triggers, action.key),
      };
    case "addCustomTrigger":
      return {
        ...state,
        triggers: addCustomTriggerToList(
          state.triggers,
          action.label,
          state.language,
        ),
      };
    case "removeTrigger":
      return {
        ...state,
        triggers: removeTriggerFromList(state.triggers, action.trigger),
      };
  }
}

type LegacyToolState = ToolState & {
  selectedTriggers?: string[];
  customTriggers?: string[];
};

/**
 * Stored state from before the trigger normalization had two arrays
 * (selectedTriggers + customTriggers). This brings any old shape
 * forward and strips the legacy keys.
 */
export function migrateStoredState(raw: unknown): ToolState | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const candidate = raw as LegacyToolState;
  const fallback = createDefaultToolState(candidate.language ?? "en");

  const triggers: Trigger[] = Array.isArray(candidate.triggers)
    ? candidate.triggers.filter(isValidTrigger)
    : legacyArraysToTriggers(
        candidate.selectedTriggers,
        candidate.customTriggers,
      );

  return {
    language: candidate.language ?? fallback.language,
    demoMode: candidate.demoMode ?? false,
    context: { ...fallback.context, ...(candidate.context ?? {}) },
    levels:
      Array.isArray(candidate.levels) && candidate.levels.length
        ? candidate.levels
        : fallback.levels,
    triggers,
  };
}

function legacyArraysToTriggers(
  selected: unknown,
  custom: unknown,
): Trigger[] {
  const result: Trigger[] = [];
  const knownKeys = new Set<string>(predefinedTriggerKeys);
  if (Array.isArray(selected)) {
    for (const entry of selected) {
      if (typeof entry === "string" && knownKeys.has(entry)) {
        result.push({
          source: "predefined",
          key: entry as PredefinedTriggerKey,
        });
      }
    }
  }
  if (Array.isArray(custom)) {
    for (const entry of custom) {
      if (typeof entry === "string" && entry.trim()) {
        result.push({
          source: "custom",
          id: `legacy-${result.length}-${entry}`,
          label: entry,
        });
      }
    }
  }
  return result;
}

function isValidTrigger(value: unknown): value is Trigger {
  if (!value || typeof value !== "object") {
    return false;
  }
  const trigger = value as Trigger;
  if (trigger.source === "predefined") {
    return typeof trigger.key === "string";
  }
  if (trigger.source === "custom") {
    return typeof trigger.id === "string" && typeof trigger.label === "string";
  }
  return false;
}
