import type { Language, ToolState } from "./schema";

const demoStateEn: ToolState = {
  language: "en",
  demoMode: true,
  context: {
    teamName: "Research Ethics Committee",
    rhythm: "Review every quarter and after any level 3 or 4 escalation.",
    situations:
      "Sensitive authorship disputes, conflicts of interest, and safety concerns in funded research.",
    power:
      "Junior researchers, students, and external advisors may be exposed to senior decision-makers.",
    protection:
      "Students, junior staff, complainants, and anyone asked to speak against a powerful stakeholder.",
    channels:
      "Committee chair, independent ombudsperson, HR partner, and confidential ethics mailbox.",
    redLines:
      "Retaliation, unmanaged conflicts of interest, and pressure to suppress safety concerns.",
    openQuestions:
      "Who can pause a decision when the chair is conflicted? How quickly can an independent reviewer be reached?",
  },
  triggers: [
    { source: "predefined", key: "powerImbalance" },
    { source: "predefined", key: "retaliationConcern" },
    { source: "predefined", key: "conflictedDecisionMaker" },
    {
      source: "custom",
      id: "demo-en-funder-pressure",
      label: "External funder pressure",
    },
  ],
  orgRoles: [
    { id: "committee", label: "Committee", kind: "team" },
    { id: "chair", label: "Chair", kind: "team" },
    { id: "observer", label: "Safety observer", kind: "independent" },
    { id: "ombuds", label: "Ombudsperson", kind: "independent" },
    { id: "reviewer", label: "Independent reviewer", kind: "formal" },
    { id: "sponsor", label: "Executive sponsor", kind: "protection" },
  ],
  orgConnections: [
    { from: "committee", to: "chair", levelId: "normal" },
    { from: "chair", to: "observer", levelId: "early-signal" },
    { from: "observer", to: "ombuds", levelId: "protected-consultation" },
    { from: "ombuds", to: "reviewer", levelId: "formal-clarification" },
    { from: "reviewer", to: "sponsor", levelId: "protection-mode" },
  ],
  currentLevelId: "protected-consultation",
  levels: [
    {
      id: "normal",
      number: 0,
      name: "Normal",
      purpose: "Keep concerns discussable in the regular committee rhythm.",
      triggers: "Routine uncertainty or early disagreement.",
      safeFirstStep: "Name the concern in the meeting notes and invite clarification.",
      roles: "Committee chair, agenda owner",
      safeguards: "Normalize questions and separate concern-raising from blame.",
      documentation: "Brief note in regular minutes.",
      deEscalation: "Return to normal agenda once the concern is answered.",
    },
    {
      id: "early-signal",
      number: 1,
      name: "Early Signal",
      purpose: "Create space before pressure hardens into conflict.",
      triggers: "Repeated discomfort, missing information, or visible silence.",
      safeFirstStep: "Invite a short pause and collect concerns without attribution.",
      roles: "Chair, rotating safety observer",
      safeguards: "No names attached without consent.",
      documentation: "Private signal log.",
      deEscalation: "Summarize what changed and close the loop with the group.",
    },
    {
      id: "protected-consultation",
      number: 2,
      name: "Protected Consultation",
      purpose: "Give affected people an independent route for advice.",
      triggers: "Power asymmetry, confidentiality need, or fear of consequences.",
      safeFirstStep: "Offer confidential consultation with the ombudsperson.",
      roles: "Ombudsperson, protected participant",
      safeguards: "Need-to-know sharing only.",
      documentation: "Confidential consultation note.",
      deEscalation: "Agree what can safely return to the committee.",
    },
    {
      id: "formal-clarification",
      number: 3,
      name: "Formal Clarification",
      purpose: "Move from informal concern to accountable decision path.",
      triggers: "Unresolved conflict, disputed facts, or a conflicted decision-maker.",
      safeFirstStep: "Assign an independent reviewer and define the decision hold.",
      roles: "Independent reviewer, chair substitute, HR or legal as needed",
      safeguards: "Conflict-of-interest check and written mandate.",
      documentation: "Formal clarification record.",
      deEscalation: "Share outcome, safeguards, and next review date.",
    },
    {
      id: "protection-mode",
      number: 4,
      name: "Protection Mode",
      purpose: "Protect people or decisions when immediate harm is plausible.",
      triggers: "Retaliation, coercion, serious safety risk, or legal exposure.",
      safeFirstStep: "Pause the decision and activate independent protection roles.",
      roles: "Ombudsperson, executive sponsor, HR/legal, external support",
      safeguards: "Immediate non-retaliation instruction and access limits.",
      documentation: "Restricted incident record.",
      deEscalation: "Only step down after risk review and protected follow-up.",
    },
  ],
};

const demoStateDe: ToolState = {
  language: "de",
  demoMode: true,
  context: {
    teamName: "Forschungsethik-Gremium",
    rhythm: "Vierteljährliche Überprüfung und nach jeder Eskalation auf Stufe 3 oder 4.",
    situations:
      "Sensible Urheberschaftskonflikte, Interessenkonflikte und Sicherheitsbedenken in geförderter Forschung.",
    power:
      "Junior-Forschende, Studierende und externe Beratende können gegenüber leitenden Entscheidungsträgern exponiert sein.",
    protection:
      "Studierende, Junior-Mitarbeitende, Hinweisgebende und alle, die gegen eine einflussreiche Person aussagen sollen.",
    channels:
      "Gremiumsleitung, unabhängige Ombudsperson, HR-Ansprechperson und vertrauliches Ethik-Postfach.",
    redLines:
      "Vergeltung, ungeregelte Interessenkonflikte und Druck, Sicherheitsbedenken zu unterdrücken.",
    openQuestions:
      "Wer kann eine Entscheidung pausieren, wenn die Leitung befangen ist? Wie schnell ist eine unabhängige Prüfung erreichbar?",
  },
  triggers: [
    { source: "predefined", key: "powerImbalance" },
    { source: "predefined", key: "retaliationConcern" },
    { source: "predefined", key: "conflictedDecisionMaker" },
    {
      source: "custom",
      id: "demo-de-funder-pressure",
      label: "Druck durch externe Geldgeber",
    },
  ],
  orgRoles: [
    { id: "committee", label: "Gremium", kind: "team" },
    { id: "chair", label: "Leitung", kind: "team" },
    { id: "observer", label: "Sicherheitsbeobachtung", kind: "independent" },
    { id: "ombuds", label: "Ombudsperson", kind: "independent" },
    { id: "reviewer", label: "Unabhängige Prüfung", kind: "formal" },
    { id: "sponsor", label: "GL-Patenschaft", kind: "protection" },
  ],
  orgConnections: [
    { from: "committee", to: "chair", levelId: "normal" },
    { from: "chair", to: "observer", levelId: "early-signal" },
    { from: "observer", to: "ombuds", levelId: "protected-consultation" },
    { from: "ombuds", to: "reviewer", levelId: "formal-clarification" },
    { from: "reviewer", to: "sponsor", levelId: "protection-mode" },
  ],
  currentLevelId: "protected-consultation",
  levels: [
    {
      id: "normal",
      number: 0,
      name: "Normal",
      purpose: "Bedenken im regulären Rhythmus des Gremiums besprechbar halten.",
      triggers: "Alltägliche Unsicherheit oder erste Meinungsverschiedenheiten.",
      safeFirstStep: "Bedenken im Sitzungsprotokoll benennen und um Klärung bitten.",
      roles: "Gremiumsleitung, Agenda-Verantwortliche",
      safeguards: "Fragen normalisieren und das Ansprechen von Bedenken von Schuldzuweisungen trennen.",
      documentation: "Kurzer Vermerk im regulären Protokoll.",
      deEscalation: "Zur normalen Tagesordnung zurückkehren, sobald die Frage beantwortet ist.",
    },
    {
      id: "early-signal",
      number: 1,
      name: "Frühsignal",
      purpose: "Raum schaffen, bevor sich Druck zu einem Konflikt verhärtet.",
      triggers: "Wiederholtes Unbehagen, fehlende Informationen oder sichtbares Schweigen.",
      safeFirstStep: "Eine kurze Pause einlegen und Bedenken ohne Zuschreibung sammeln.",
      roles: "Leitung, rotierende Sicherheitsbeobachtung",
      safeguards: "Keine Namen ohne Einverständnis.",
      documentation: "Internes Signalprotokoll.",
      deEscalation: "Veränderungen zusammenfassen und mit der Gruppe abschliessen.",
    },
    {
      id: "protected-consultation",
      number: 2,
      name: "Geschützte Beratung",
      purpose: "Betroffenen einen unabhängigen Weg für Beratung eröffnen.",
      triggers: "Machtasymmetrie, Vertraulichkeitsbedarf oder Angst vor Folgen.",
      safeFirstStep: "Vertrauliche Beratung bei der Ombudsperson anbieten.",
      roles: "Ombudsperson, geschützte teilnehmende Person",
      safeguards: "Weitergabe nur nach Need-to-know-Prinzip.",
      documentation: "Vertraulicher Beratungsvermerk.",
      deEscalation: "Vereinbaren, was sicher ins Gremium zurückkehren kann.",
    },
    {
      id: "formal-clarification",
      number: 3,
      name: "Formale Klärung",
      purpose: "Von informellem Anliegen zu einem verantworteten Entscheidungsweg übergehen.",
      triggers: "Ungelöster Konflikt, strittige Fakten oder eine befangene Entscheidungsperson.",
      safeFirstStep: "Unabhängige Prüfperson benennen und Entscheidungsstopp festlegen.",
      roles: "Unabhängige Prüfperson, stellvertretende Leitung, HR oder Recht nach Bedarf",
      safeguards: "Befangenheitsprüfung und schriftliches Mandat.",
      documentation: "Formaler Klärungsbericht.",
      deEscalation: "Ergebnis, Schutzmassnahmen und nächsten Prüftermin teilen.",
    },
    {
      id: "protection-mode",
      number: 4,
      name: "Schutzmodus",
      purpose: "Personen oder Entscheidungen schützen, wenn unmittelbarer Schaden wahrscheinlich ist.",
      triggers: "Vergeltung, Nötigung, ernstes Sicherheitsrisiko oder rechtliches Risiko.",
      safeFirstStep: "Entscheidung pausieren und unabhängige Schutzrollen aktivieren.",
      roles: "Ombudsperson, Geschäftsleitungs-Patenschaft, HR/Recht, externe Unterstützung",
      safeguards: "Sofortige Vergeltungssperre und Zugriffsbegrenzungen.",
      documentation: "Eingeschränkter Vorfallsbericht.",
      deEscalation: "Nur nach Risikoprüfung und geschützter Nachbearbeitung herabstufen.",
    },
  ],
};

export function getDemoState(language: Language): ToolState {
  return language === "de" ? demoStateDe : demoStateEn;
}
