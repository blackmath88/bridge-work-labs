import type { ToolState } from "./schema";

export const demoState: ToolState = {
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
  selectedTriggers: [
    "powerImbalance",
    "retaliationConcern",
    "conflictedDecisionMaker",
  ],
  customTriggers: ["External funder pressure"],
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
