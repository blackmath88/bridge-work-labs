import type { Language, ToolState } from "./schema";
import { getAllTriggerLabels } from "./triggers";

type PromptKind = "sharpen" | "risk";

const promptCopy = {
  en: {
    sharpenHeading: "Sharpen the model",
    riskHeading: "Risk review",
    sharpenInstruction:
      "Review this protection and escalation model. Help make it clearer, more concrete, and easier for a team to discuss.",
    riskInstruction:
      "Review this protection and escalation model for risks, blind spots, power asymmetries, and missing safeguards.",
    contextHeading: "Current context",
    triggersHeading: "Selected triggers",
    levelsHeading: "Escalation levels",
    closing:
      "Respond with concrete improvement suggestions and name open questions the team should clarify.",
    contextEmpty: "Not filled yet",
    listEmpty: "- None selected",
    contextLabels: {
      teamName: "Team / committee",
      rhythm: "Review rhythm",
      situations: "Sensitive situations",
      power: "Power asymmetries",
      protection: "Roles needing protection",
      channels: "Existing channels",
      redLines: "Red lines",
      openQuestions: "Open questions",
    },
    levelLabels: {
      purpose: "Purpose",
      triggers: "Triggers",
      safeFirstStep: "Safe first step",
      roles: "Roles / contacts",
      safeguards: "Safeguards",
      documentation: "Documentation",
      deEscalation: "De-escalation",
    },
  },
  de: {
    sharpenHeading: "Modell schärfen",
    riskHeading: "Risikoprüfung",
    sharpenInstruction:
      "Prüfe dieses Schutz- und Eskalationsmodell. Hilf, es klarer, konkreter und für ein Team leichter besprechbar zu machen.",
    riskInstruction:
      "Prüfe dieses Schutz- und Eskalationsmodell auf Risiken, blinde Flecken, Machtasymmetrien und fehlende Schutzmassnahmen.",
    contextHeading: "Aktueller Kontext",
    triggersHeading: "Ausgewählte Auslöser",
    levelsHeading: "Eskalationsstufen",
    closing:
      "Antworte mit konkreten Verbesserungsvorschlägen und benenne offene Fragen, die das Team klären sollte.",
    contextEmpty: "Noch nicht ausgefüllt",
    listEmpty: "- Keine ausgewählt",
    contextLabels: {
      teamName: "Team / Gremium",
      rhythm: "Überprüfungsrhythmus",
      situations: "Sensible Situationen",
      power: "Machtasymmetrien",
      protection: "Schutzbedürftige Rollen",
      channels: "Bestehende Kanäle",
      redLines: "Rote Linien",
      openQuestions: "Offene Fragen",
    },
    levelLabels: {
      purpose: "Zweck",
      triggers: "Auslöser",
      safeFirstStep: "Sicherer erster Schritt",
      roles: "Rollen / Kontakte",
      safeguards: "Schutzmassnahmen",
      documentation: "Dokumentation",
      deEscalation: "De-Eskalation",
    },
  },
} as const;

export function buildReflectionPrompt(
  kind: PromptKind,
  state: ToolState,
  language: Language,
) {
  const copy = promptCopy[language];
  const heading = kind === "sharpen" ? copy.sharpenHeading : copy.riskHeading;
  const instruction =
    kind === "sharpen" ? copy.sharpenInstruction : copy.riskInstruction;

  return [
    `# ${heading}`,
    "",
    instruction,
    "",
    `## ${copy.contextHeading}`,
    formatContext(state, language),
    "",
    `## ${copy.triggersHeading}`,
    formatList(getAllTriggerLabels(state.triggers, language), language),
    "",
    `## ${copy.levelsHeading}`,
    state.levels.map((level) => formatLevel(level, language)).join("\n\n"),
    "",
    copy.closing,
  ].join("\n");
}

function formatContext(state: ToolState, language: Language) {
  const copy = promptCopy[language];
  const labels = copy.contextLabels;
  const empty = copy.contextEmpty;
  const entries: Array<[string, string]> = [
    [labels.teamName, state.context.teamName],
    [labels.rhythm, state.context.rhythm],
    [labels.situations, state.context.situations],
    [labels.power, state.context.power],
    [labels.protection, state.context.protection],
    [labels.channels, state.context.channels],
    [labels.redLines, state.context.redLines],
    [labels.openQuestions, state.context.openQuestions],
  ];

  return entries
    .map(([label, value]) => `- ${label}: ${value || empty}`)
    .join("\n");
}

function formatList(items: string[], language: Language) {
  if (!items.length) {
    return promptCopy[language].listEmpty;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatLevel(
  level: ToolState["levels"][number],
  language: Language,
) {
  const labels = promptCopy[language].levelLabels;

  return [
    `### ${level.number}. ${level.name}`,
    `- ${labels.purpose}: ${level.purpose || "-"}`,
    `- ${labels.triggers}: ${level.triggers || "-"}`,
    `- ${labels.safeFirstStep}: ${level.safeFirstStep || "-"}`,
    `- ${labels.roles}: ${level.roles || "-"}`,
    `- ${labels.safeguards}: ${level.safeguards || "-"}`,
    `- ${labels.documentation}: ${level.documentation || "-"}`,
    `- ${labels.deEscalation}: ${level.deEscalation || "-"}`,
  ].join("\n");
}
