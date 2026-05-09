import type { Language, ToolState } from "./schema";
import { translations } from "./translations";

export type OutputModel = {
  title: string;
  subtitle: string;
  date: string;
  purpose: string;
  context: string;
  principles: string[];
  triggers: string[];
  roles: string[];
  rhythm: string;
  levels: Array<{
    number: number;
    name: string;
    purpose: string;
    roles: string;
  }>;
};

export function buildOutputModel(
  state: ToolState,
  language: Language,
): OutputModel {
  const t = translations[language];
  const teamName =
    state.context.teamName || (language === "de" ? "Dieses Team" : "This team");
  const triggerLabels = [
    ...state.selectedTriggers.map(
      (trigger) =>
        t.build.triggerLabels[
          trigger as keyof typeof t.build.triggerLabels
        ] ?? trigger,
    ),
    ...state.customTriggers,
  ];
  const roles = unique(
    state.levels
      .map((level) => level.roles)
      .filter(Boolean)
      .flatMap((value) => splitList(value)),
  );
  const context = [
    state.context.situations,
    state.context.power,
    state.context.protection,
    state.context.channels,
    state.context.redLines,
    state.context.openQuestions,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: t.output.documentTitle,
    subtitle: `${teamName} - ${t.output.draft}`,
    date: new Date().toLocaleDateString(language === "de" ? "de-CH" : "en-GB"),
    purpose:
      language === "de"
        ? `${teamName} erstellt einen gemeinsamen Schutz- und Eskalationsweg.`
        : `${teamName} is creating a shared protection and escalation path.`,
    context,
    principles: t.output.principles,
    triggers: triggerLabels,
    roles,
    rhythm: state.context.rhythm,
    levels: state.levels.map((level) => ({
      number: level.number,
      name: level.name,
      purpose: level.purpose,
      roles: level.roles,
    })),
  };
}

export function buildPlainTextOutput(
  state: ToolState,
  language: Language,
): string {
  const t = translations[language];
  const model = buildOutputModel(state, language);
  const empty = t.output.noContent;

  return [
    model.title,
    model.subtitle,
    model.date,
    "",
    `${t.output.purpose}:`,
    model.purpose || empty,
    "",
    `${t.output.context}:`,
    model.context || empty,
    "",
    `${t.output.guidingPrinciples}:`,
    formatPlainList(model.principles, empty),
    "",
    `${t.output.levels}:`,
    model.levels
      .map(
        (level) =>
          `${level.number}. ${level.name || empty}\n   ${t.build.fields.purpose}: ${level.purpose || empty}\n   ${t.output.roles}: ${level.roles || empty}`,
      )
      .join("\n"),
    "",
    `${t.output.triggers}:`,
    formatPlainList(model.triggers, empty),
    "",
    `${t.output.roles}:`,
    formatPlainList(model.roles, empty),
    "",
    `${t.output.reviewRhythm}:`,
    model.rhythm || empty,
  ].join("\n");
}

export function buildMarkdownOutput(
  state: ToolState,
  language: Language,
): string {
  const t = translations[language];
  const model = buildOutputModel(state, language);
  const empty = t.output.noContent;

  return [
    `# ${model.title}`,
    `_${model.subtitle} - ${model.date}_`,
    "",
    `## ${t.output.purpose}`,
    model.purpose || empty,
    "",
    `## ${t.output.context}`,
    model.context || empty,
    "",
    `## ${t.output.guidingPrinciples}`,
    formatMarkdownList(model.principles, empty),
    "",
    `## ${t.output.levels}`,
    `| ${t.output.columns.number} | ${t.output.columns.name} | ${t.output.columns.purpose} | ${t.output.columns.roles} |`,
    "|---|---|---|---|",
    ...model.levels.map(
      (level) =>
        `| ${level.number} | ${escapeTable(level.name || empty)} | ${escapeTable(level.purpose || empty)} | ${escapeTable(level.roles || empty)} |`,
    ),
    "",
    `## ${t.output.triggers}`,
    formatMarkdownList(model.triggers, empty),
    "",
    `## ${t.output.roles}`,
    formatMarkdownList(model.roles, empty),
    "",
    `## ${t.output.reviewRhythm}`,
    model.rhythm || empty,
  ].join("\n");
}

function formatPlainList(items: string[], empty: string) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
}

function formatMarkdownList(items: string[], empty: string) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
}

function escapeTable(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function splitList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values)];
}
