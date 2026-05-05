export const pathwayColors = [
  "#3e5c54",
  "#5a7a40",
  "#b8860b",
  "#c05621",
  "#9b2c2c",
];

export const conceptKeys = [
  "psychologicalSafety",
  "speakUpCulture",
  "powerAsymmetry",
  "confidentiality",
  "nonRetaliation",
  "independentChannel",
] as const;

export type ConceptKey = (typeof conceptKeys)[number];

export const predefinedTriggerKeys = [
  "powerImbalance",
  "retaliationConcern",
  "confidentialityNeed",
  "conflictedDecisionMaker",
  "safetyRisk",
  "legalExposure",
  "repeatedSilence",
  "unresolvedFacts",
] as const;

export type PredefinedTriggerKey = (typeof predefinedTriggerKeys)[number];
