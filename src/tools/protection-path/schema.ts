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

export type OrgRole = {
  id: string;
  label: string;
  kind: "team" | "independent" | "formal" | "protection";
};

export type OrgConnection = {
  from: string;
  to: string;
  levelId: string;
};

export type ToolState = {
  language: Language;
  context: ContextFields;
  levels: EscalationLevel[];
  triggers: Trigger[];
  orgRoles: OrgRole[];
  orgConnections: OrgConnection[];
  currentLevelId: string;
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

export const defaultOrgRoles: OrgRole[] = [
  { id: "team", label: "Team / committee", kind: "team" },
  { id: "chair", label: "Chair / lead", kind: "team" },
  { id: "observer", label: "Safety observer", kind: "independent" },
  { id: "ombuds", label: "Ombudsperson", kind: "independent" },
  { id: "reviewer", label: "Independent reviewer", kind: "formal" },
  { id: "sponsor", label: "Protection sponsor", kind: "protection" },
];

export const defaultOrgConnections: OrgConnection[] = [
  { from: "team", to: "chair", levelId: "normal" },
  { from: "chair", to: "observer", levelId: "early-signal" },
  { from: "observer", to: "ombuds", levelId: "protected-consultation" },
  { from: "ombuds", to: "reviewer", levelId: "formal-clarification" },
  { from: "reviewer", to: "sponsor", levelId: "protection-mode" },
];

export const defaultToolState: ToolState = {
  language: "en",
  context: emptyContext,
  levels: defaultLevels,
  triggers: [],
  orgRoles: defaultOrgRoles,
  orgConnections: defaultOrgConnections,
  currentLevelId: "normal",
  demoMode: false,
};

export function createDefaultToolState(language: Language = "en"): ToolState {
  return {
    ...defaultToolState,
    language,
    context: { ...emptyContext },
    levels: defaultLevels.map((level) => ({ ...level })),
    triggers: [],
    orgRoles: defaultOrgRoles.map((role) => ({ ...role })),
    orgConnections: defaultOrgConnections.map((connection) => ({ ...connection })),
    currentLevelId: defaultLevels[0]?.id ?? "normal",
  };
}
