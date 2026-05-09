import type { Language, ToolState } from "./schema";
import { translations } from "./translations";
import { getAllTriggerLabels } from "./triggers";

export type OutputLevel = {
  number: number;
  name: string;
  purpose: string;
  triggers: string;
  safeFirstStep: string;
  roles: string;
  safeguards: string;
  documentation: string;
  deEscalation: string;
};

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
  levels: OutputLevel[];
};

export function buildOutputModel(
  state: ToolState,
  language: Language,
): OutputModel {
  const t = translations[language];
  const teamName =
    state.context.teamName || (language === "de" ? "Dieses Team" : "This team");
  const triggerLabels = getAllTriggerLabels(state.triggers, language);
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
      triggers: level.triggers,
      safeFirstStep: level.safeFirstStep,
      roles: level.roles,
      safeguards: level.safeguards,
      documentation: level.documentation,
      deEscalation: level.deEscalation,
    })),
  };
}

const levelFieldOrder: ReadonlyArray<keyof Omit<OutputLevel, "number" | "name">> = [
  "purpose",
  "triggers",
  "safeFirstStep",
  "roles",
  "safeguards",
  "documentation",
  "deEscalation",
];

export function getLevelFieldOrder() {
  return levelFieldOrder;
}

export function buildPlainTextOutput(
  state: ToolState,
  language: Language,
): string {
  const t = translations[language];
  const model = buildOutputModel(state, language);
  const empty = t.output.noContent;
  const fieldLabels = t.build.fields;

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
      .map((level) => {
        const header = `${level.number}. ${level.name || empty}`;
        const lines = levelFieldOrder.map(
          (field) => `   ${fieldLabels[field]}: ${level[field] || empty}`,
        );
        return [header, ...lines].join("\n");
      })
      .join("\n\n"),
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
  const fieldLabels = t.build.fields;

  const levelSections = model.levels.flatMap((level) => {
    const heading = `### ${level.number}. ${level.name || empty}`;
    const rows = levelFieldOrder.map(
      (field) => `- **${fieldLabels[field]}:** ${level[field] || empty}`,
    );
    return [heading, ...rows, ""];
  });

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
    "",
    ...levelSections,
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

function splitList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values)];
}
