import { predefinedTriggerKeys, type PredefinedTriggerKey } from "./config";
import type { Language, Trigger } from "./schema";
import { translations } from "./translations";

export function getTriggerLabel(trigger: Trigger, language: Language): string {
  if (trigger.source === "custom") {
    return trigger.label;
  }
  return translations[language].build.triggerLabels[trigger.key];
}

export function getAllTriggerLabels(
  triggers: Trigger[],
  language: Language,
): string[] {
  return triggers.map((trigger) => getTriggerLabel(trigger, language));
}

export function isPredefinedSelected(
  triggers: Trigger[],
  key: PredefinedTriggerKey,
): boolean {
  return triggers.some(
    (trigger) => trigger.source === "predefined" && trigger.key === key,
  );
}

export function togglePredefined(
  triggers: Trigger[],
  key: PredefinedTriggerKey,
): Trigger[] {
  return isPredefinedSelected(triggers, key)
    ? triggers.filter(
        (trigger) =>
          !(trigger.source === "predefined" && trigger.key === key),
      )
    : [...triggers, { source: "predefined", key }];
}

export function removeTrigger(
  triggers: Trigger[],
  target: Trigger,
): Trigger[] {
  return triggers.filter((trigger) => !sameTrigger(trigger, target));
}

function sameTrigger(a: Trigger, b: Trigger): boolean {
  if (a.source !== b.source) {
    return false;
  }
  if (a.source === "predefined" && b.source === "predefined") {
    return a.key === b.key;
  }
  if (a.source === "custom" && b.source === "custom") {
    return a.id === b.id;
  }
  return false;
}

/**
 * Add a trimmed custom trigger label. If the input matches a predefined
 * trigger label (case-insensitive) or an existing custom label, the
 * original list is returned and the predefined entry is selected if it
 * wasn't already.
 */
export function addCustomTrigger(
  triggers: Trigger[],
  rawLabel: string,
  language: Language,
): Trigger[] {
  const trimmed = rawLabel.trim();
  if (!trimmed) {
    return triggers;
  }
  const normalized = trimmed.toLocaleLowerCase();

  const matchedPredefined = predefinedTriggerKeys.find(
    (key) =>
      translations[language].build.triggerLabels[key].toLocaleLowerCase() ===
      normalized,
  );
  if (matchedPredefined) {
    return isPredefinedSelected(triggers, matchedPredefined)
      ? triggers
      : [...triggers, { source: "predefined", key: matchedPredefined }];
  }

  const customCollision = triggers.some(
    (trigger) =>
      trigger.source === "custom" &&
      trigger.label.toLocaleLowerCase() === normalized,
  );
  if (customCollision) {
    return triggers;
  }

  return [
    ...triggers,
    {
      source: "custom",
      id: createCustomId(),
      label: trimmed,
    },
  ];
}

function createCustomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
