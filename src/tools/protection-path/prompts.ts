import type { Language, ToolState } from "./schema";
import { translations } from "./translations";

type PromptKind = "sharpen" | "risk";

export function buildReflectionPrompt(
  kind: PromptKind,
  state: ToolState,
  language: Language,
) {
  const heading =
    kind === "sharpen"
      ? language === "de"
        ? "Modell schärfen"
        : "Sharpen the model"
      : language === "de"
        ? "Risikoprüfung"
        : "Risk review";
  const instruction =
    kind === "sharpen"
      ? language === "de"
        ? "Prüfe dieses Schutz- und Eskalationsmodell. Hilf, es klarer, konkreter und für ein Team leichter besprechbar zu machen."
        : "Review this protection and escalation model. Help make it clearer, more concrete, and easier for a team to discuss."
      : language === "de"
        ? "Prüfe dieses Schutz- und Eskalationsmodell auf Risiken, blinde Flecken, Machtasymmetrien und fehlende Schutzmassnahmen."
        : "Review this protection and escalation model for risks, blind spots, power asymmetries, and missing safeguards.";

  return [
    `# ${heading}`,
    "",
    instruction,
    "",
    "## Current context",
    formatContext(state, language),
    "",
    "## Selected triggers",
    formatList(triggerLabels(state, language), language),
    "",
    "## Escalation levels",
    state.levels.map(formatLevel).join("\n\n"),
    "",
    language === "de"
      ? "Antworte mit konkreten Verbesserungsvorschlägen und benenne offene Fragen, die das Team klären sollte."
      : "Respond with concrete improvement suggestions and name open questions the team should clarify.",
  ].join("\n");
}

function triggerLabels(state: ToolState, language: Language) {
  const labels = translations[language].build.triggerLabels;

  return [
    ...state.selectedTriggers.map((trigger) => labels[trigger as keyof typeof labels] ?? trigger),
    ...state.customTriggers,
  ];
}

function formatContext(state: ToolState, language: Language) {
  const empty = language === "de" ? "Noch nicht ausgefüllt" : "Not filled yet";
  const entries = [
    ["Team / committee", state.context.teamName],
    ["Review rhythm", state.context.rhythm],
    ["Sensitive situations", state.context.situations],
    ["Power asymmetries", state.context.power],
    ["Roles needing protection", state.context.protection],
    ["Existing channels", state.context.channels],
    ["Red lines", state.context.redLines],
    ["Open questions", state.context.openQuestions],
  ];

  return entries
    .map(([label, value]) => `- ${label}: ${value || empty}`)
    .join("\n");
}

function formatList(items: string[], language: Language) {
  if (!items.length) {
    return language === "de" ? "- Keine ausgewählt" : "- None selected";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatLevel(level: ToolState["levels"][number]) {
  return [
    `### ${level.number}. ${level.name}`,
    `- Purpose: ${level.purpose || "-"}`,
    `- Triggers: ${level.triggers || "-"}`,
    `- Safe first step: ${level.safeFirstStep || "-"}`,
    `- Roles / contacts: ${level.roles || "-"}`,
    `- Safeguards: ${level.safeguards || "-"}`,
    `- Documentation: ${level.documentation || "-"}`,
    `- De-escalation: ${level.deEscalation || "-"}`,
  ].join("\n");
}
