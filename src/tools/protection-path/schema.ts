import type { PredefinedTriggerKey } from "./config";

export type Language = "de" | "en";

export type Trigger =
  | { source: "predefined"; key: PredefinedTriggerKey }
  | { source: "custom"; id: string; label: string };

export type ContextFields = {
  teamName: string;
  rhythm: string;
  situations: string;
  power: string;
  protection: string;
  channels: string;
  redLines: string;
  openQuestions: string;
};

export type EscalationLevel = {
  id: string;
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

export type ToolState = {
  language: Language;
  context: ContextFields;
  levels: EscalationLevel[];
  triggers: Trigger[];
  demoMode: boolean;
};

export const emptyContext: ContextFields = {
  teamName: "",
  rhythm: "",
  situations: "",
  power: "",
  protection: "",
  channels: "",
  redLines: "",
  openQuestions: "",
};

export const defaultLevels: EscalationLevel[] = [
  {
    id: "normal",
    number: 0,
    name: "Normal",
    purpose: "",
    triggers: "",
    safeFirstStep: "",
    roles: "",
    safeguards: "",
    documentation: "",
    deEscalation: "",
  },
  {
    id: "early-signal",
    number: 1,
    name: "Early Signal",
    purpose: "",
    triggers: "",
    safeFirstStep: "",
    roles: "",
    safeguards: "",
    documentation: "",
    deEscalation: "",
  },
  {
    id: "protected-consultation",
    number: 2,
    name: "Protected Consultation",
    purpose: "",
    triggers: "",
    safeFirstStep: "",
    roles: "",
    safeguards: "",
    documentation: "",
    deEscalation: "",
  },
  {
    id: "formal-clarification",
    number: 3,
    name: "Formal Clarification",
    purpose: "",
    triggers: "",
    safeFirstStep: "",
    roles: "",
    safeguards: "",
    documentation: "",
    deEscalation: "",
  },
  {
    id: "protection-mode",
    number: 4,
    name: "Protection Mode",
    purpose: "",
    triggers: "",
    safeFirstStep: "",
    roles: "",
    safeguards: "",
    documentation: "",
    deEscalation: "",
  },
];

export const defaultToolState: ToolState = {
  language: "en",
  context: emptyContext,
  levels: defaultLevels,
  triggers: [],
  demoMode: false,
};

export function createDefaultToolState(language: Language = "en"): ToolState {
  return {
    ...defaultToolState,
    language,
    context: { ...emptyContext },
    levels: defaultLevels.map((level) => ({ ...level })),
    triggers: [],
  };
}
