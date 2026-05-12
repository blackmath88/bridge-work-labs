import type { ConceptKey, PredefinedTriggerKey } from "./config";
import type { Language } from "./schema";

export type TranslationSet = {
  languageName: string;
  sideTitle: string;
  sideSub: string;
  privacyNote: string;
  brandLine: string;
  brandSub: string;
  appEyebrow: string;
  appTitle: string;
  reset: string;
  resetConfirm: string;
  saved: string;
  openMenu: string;
  closeMenu: string;
  toggleEducation: string;
  levelCompletion: (filled: number, total: number) => string;
  continueToStep: (stepLabel: string) => string;
  confirmReplaceWithDemo: string;
  confirmStartBlank: string;
  demoBadge: string;
  draftBadge: string;
  learningPanel: string;
  learningFallback: string;
  learningFooter: string;
  placeholderTitle: string;
  placeholderText: string;
  steps: {
    vision: {
      label: string;
      eyebrow: string;
      title: string;
      description: string;
      educationTitle: string;
      educationText: string;
    };
    build: {
      label: string;
      eyebrow: string;
      title: string;
      description: string;
      educationTitle: string;
      educationText: string;
    };
    reflect: {
      label: string;
      eyebrow: string;
      title: string;
      description: string;
      educationTitle: string;
      educationText: string;
    };
    output: {
      label: string;
      eyebrow: string;
      title: string;
      description: string;
      educationTitle: string;
      educationText: string;
    };
  };
  vision: {
    heroEyebrow: string;
    heroTitle: string;
    heroSub: string;
    heroLead: string;
    startDemo: string;
    buildOwn: string;
    coreLabel: string;
    coreQuote: string;
    pathTitle: string;
    pathSubtitle: string;
    conceptTag: string;
    conceptTitle: string;
    conceptDesc: string;
    demoLoaded: string;
    ownStarted: string;
    pathway: Array<{ label: string; sub: string }>;
    concepts: Record<ConceptKey, { title: string; text: string; question: string }>;
  };
  build: {
    mapEyebrow: string;
    mapTitle: string;
    mapIntro: string;
    selectedLevel: string;
    safeRouteTitle: string;
    safeRouteIntro: string;
    recommendedActions: string;
    editDetails: string;
    contextAndTriggers: string;
    underlyingModelEditor: string;
    laneModeSimple: string;
    laneModeDetailed: string;
    routeTypes: {
      safe: string;
      normal: string;
      caution: string;
    };
    routeNodeLabels: {
      affectedPerson: string;
      teamLead: string;
      decisionOwner: string;
      independentSupport: string;
      hrLegal: string;
      executiveSponsor: string;
    };
    orgKinds: {
      team: string;
      independent: string;
      formal: string;
      protection: string;
    };
    contextTitle: string;
    contextIntro: string;
    contextFields: {
      teamName: string;
      rhythm: string;
      situations: string;
      power: string;
      protection: string;
      channels: string;
      redLines: string;
      openQuestions: string;
    };
    contextPlaceholders: {
      teamName: string;
      rhythm: string;
      situations: string;
      power: string;
      protection: string;
      channels: string;
      redLines: string;
      openQuestions: string;
    };
    levelsTitle: string;
    levelsIntro: string;
    triggersTitle: string;
    triggersIntro: string;
    selectedTriggers: string;
    noTriggers: string;
    customTriggerPlaceholder: string;
    addTrigger: string;
    remove: string;
    sectionLabels: {
      context: string;
      triggers: string;
      levels: string;
    };
    fields: {
      name: string;
      purpose: string;
      triggers: string;
      safeFirstStep: string;
      roles: string;
      safeguards: string;
      documentation: string;
      deEscalation: string;
    };
    triggerLabels: Record<PredefinedTriggerKey, string>;
  };
  reflect: {
    note: string;
    sharpenTitle: string;
    sharpenDescription: string;
    riskTitle: string;
    riskDescription: string;
    promptLabel: string;
    copy: string;
    copied: string;
    resetToGenerated: string;
    edited: string;
  };
  output: {
    previewTitle: string;
    previewIntro: string;
    previewEyebrow: string;
    brand: string;
    documentTitle: string;
    draft: string;
    purpose: string;
    context: string;
    guidingPrinciples: string;
    levels: string;
    triggers: string;
    roles: string;
    reviewRhythm: string;
    noContent: string;
    principles: string[];
  };
  export: {
    copyText: string;
    markdown: string;
    word: string;
    print: string;
    copied: string;
  };
};

export const translations: Record<Language, TranslationSet> = {
  en: {
    languageName: "English",
    sideTitle: "Protection Model",
    sideSub: "Team escalation tool",
    privacyNote: "Inputs and documents stay local in your browser.",
    brandLine: "Bridge Work Labs",
    brandSub: "Lightweight tools for real organizational problems",
    appEyebrow: "Protection Path Designer",
    appTitle: "Protection & Escalation Model",
    reset: "Reset",
    resetConfirm: "Reset everything? Your context, triggers, and levels will be cleared.",
    saved: "Saved",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleEducation: "Learning panel",
    levelCompletion: (filled: number, total: number) => `${filled} of ${total}`,
    continueToStep: (stepLabel: string) => `Continue to ${stepLabel}`,
    confirmReplaceWithDemo:
      "Replace your current model with the demo? Your inputs will be lost.",
    confirmStartBlank:
      "Start over with a blank model? Your inputs will be lost.",
    demoBadge: "Demo loaded",
    draftBadge: "Draft",
    learningPanel: "Learning panel",
    learningFallback:
      "Educational guidance for this step will appear here as the tool grows.",
    learningFooter: "Agree the path while it is calm. It is harder to draw under pressure.",
    placeholderTitle: "Nothing to show on this step yet",
    placeholderText:
      "Pick a step from the sidebar to continue.",
    steps: {
      vision: {
        label: "Vision",
        eyebrow: "Start here",
        title: "Escalation is a protection path",
        description:
          "A shared frame for sensitive teams before pressure, hierarchy, or uncertainty makes the next step harder.",
        educationTitle: "Why start with the path?",
        educationText:
          "A protection path turns escalation from a personal confrontation into a route the team has agreed in advance.",
      },
      build: {
        label: "Build",
        eyebrow: "Model builder",
        title: "Shape the protection model",
        description:
          "Capture the team's context, the signals that should trigger a step up, and what each escalation level looks like in practice.",
        educationTitle: "Build guidance",
        educationText:
          "Describe context, roles, signals, and safeguards so the path is concrete enough to act on.",
      },
      reflect: {
        label: "Reflect",
        eyebrow: "Thinking support",
        title: "Review the model before use",
        description:
          "Two prompts to sharpen the model and surface blind spots before you share it with the team.",
        educationTitle: "Reflection guidance",
        educationText:
          "Use these prompts in a workshop or paste them into an AI assistant. The thinking stays with your team.",
      },
      output: {
        label: "Output",
        eyebrow: "One-page model",
        title: "Preview the protection path",
        description:
          "A live one-page summary that updates from your inputs. Copy, download, or print to share with the team.",
        educationTitle: "Output guidance",
        educationText:
          "The one-pager is for reference, not for resolving the situation. Keep it short, visible, and current.",
      },
    },
    vision: {
      heroEyebrow: "Shared language before pressure",
      heroTitle: "Escalation is a protection path",
      heroSub: "Not failure. Not punishment. A pre-agreed route.",
      heroLead:
        "A structured tool for teams handling sensitive situations, hierarchies, and protection needs in universities, research institutions, public-sector organizations, and governance work.",
      startDemo: "Start with demo",
      buildOwn: "Build your own",
      coreLabel: "Core message",
      coreQuote:
        "In sensitive teams and committees, escalation is not a sign of failure. It is a route the team has agreed in advance, for when people, roles, or decisions come under pressure.",
      pathTitle: "Escalation pathway",
      pathSubtitle: "A visible route from normal dialogue to immediate protection.",
      conceptTag: "Foundations",
      conceptTitle: "Shared language",
      conceptDesc: "These concepts help teams discuss difficult situations more clearly.",
      demoLoaded: "Demo model loaded",
      ownStarted: "Blank model ready",
      pathway: [
        { label: "Normal", sub: "Team dialogue" },
        { label: "Early Signal", sub: "Uncertainty" },
        { label: "Protected Consultation", sub: "Neutral help" },
        { label: "Formal Clarification", sub: "Formal route" },
        { label: "Protection Mode", sub: "Immediate protection" },
      ],
      concepts: {
        psychologicalSafety: {
          title: "Psychological Safety",
          text: "People can raise concerns without fear of retaliation.",
          question: "What would make people feel safe?",
        },
        speakUpCulture: {
          title: "Speak-Up Culture",
          text: "Concerns are treated early as contributions, not disruptions.",
          question: "Where do people stay silent?",
        },
        powerAsymmetry: {
          title: "Power Asymmetry",
          text: "Hierarchy can limit what people feel able to say.",
          question: "Which power differences matter most?",
        },
        confidentiality: {
          title: "Confidentiality",
          text: "Information is shared only with those who need to know.",
          question: "What must stay confidential?",
        },
        nonRetaliation: {
          title: "Non-Retaliation",
          text: "Good-faith concerns do not create disadvantages.",
          question: "What would retaliation look like?",
        },
        independentChannel: {
          title: "Independent Channel",
          text: "A route exists outside the direct hierarchy.",
          question: "When is the direct line not safe?",
        },
      },
    },
    build: {
      mapEyebrow: "Escalation risk map",
      mapTitle: "Choose the current escalation level",
      mapIntro:
        "Scan the route, select the live level, then act from the panel. Details stay editable below.",
      selectedLevel: "Current selected level",
      safeRouteTitle: "Safe route",
      safeRouteIntro: "A lightweight route from the regular team path to independent protection.",
      recommendedActions: "Recommended actions",
      editDetails: "Edit level details",
      contextAndTriggers: "Context and triggers",
      underlyingModelEditor: "Edit underlying model",
      laneModeSimple: "Simple",
      laneModeDetailed: "Detailed",
      routeTypes: {
        safe: "Safe route",
        normal: "Normal route",
        caution: "Caution / conflicted route",
      },
      routeNodeLabels: {
        affectedPerson: "Affected person",
        teamLead: "Team lead",
        decisionOwner: "Decision owner",
        independentSupport: "Ombudsperson / independent support",
        hrLegal: "HR / legal",
        executiveSponsor: "Executive sponsor",
      },
      orgKinds: {
        team: "Team route",
        independent: "Independent",
        formal: "Formal",
        protection: "Protection",
      },
      contextTitle: "Context capture",
      contextIntro:
        "Capture the basic operating context for this protection path. These fields feed the prompts and one-page output.",
      contextFields: {
        teamName: "Team / committee name",
        rhythm: "Review rhythm",
        situations: "Sensitive situations",
        power: "Power asymmetries",
        protection: "Roles needing protection",
        channels: "Existing channels",
        redLines: "Red lines",
        openQuestions: "Open questions",
      },
      contextPlaceholders: {
        teamName: "Research Ethics Committee",
        rhythm: "Quarterly review, plus after major escalations",
        situations: "Where does the team face sensitive or high-pressure decisions?",
        power: "Which hierarchy, funding, or role differences matter?",
        protection: "Who may need extra protection to speak or act safely?",
        channels: "Which formal or informal routes already exist?",
        redLines: "What must trigger immediate protection or a pause?",
        openQuestions: "What remains unresolved or needs agreement?",
      },
      levelsTitle: "Escalation levels",
      levelsIntro:
        "Define what each of the five levels looks like in your team's day-to-day.",
      triggersTitle: "Triggers",
      triggersIntro:
        "Pick the signals that should move the team to a higher level, or add your own.",
      selectedTriggers: "Selected triggers",
      noTriggers: "No triggers selected yet.",
      customTriggerPlaceholder: "Add a custom trigger",
      addTrigger: "Add",
      remove: "Remove",
      sectionLabels: {
        context: "Context",
        triggers: "Triggers",
        levels: "Levels",
      },
      fields: {
        name: "Name",
        purpose: "Purpose",
        triggers: "Triggers",
        safeFirstStep: "Safe first step",
        roles: "Roles / contacts",
        safeguards: "Safeguards",
        documentation: "Documentation",
        deEscalation: "De-escalation",
      },
      triggerLabels: {
        powerImbalance: "Power imbalance",
        retaliationConcern: "Retaliation concern",
        confidentialityNeed: "Confidentiality need",
        conflictedDecisionMaker: "Conflicted decision-maker",
        safetyRisk: "Safety risk",
        legalExposure: "Legal exposure",
        repeatedSilence: "Repeated silence",
        unresolvedFacts: "Unresolved facts",
      },
    },
    reflect: {
      note: "These prompts are written for a workshop or to paste into an AI assistant. The thinking and the decisions stay with your team.",
      sharpenTitle: "Sharpen model",
      sharpenDescription:
        "Use this prompt to make the current protection path clearer, more practical, and easier to discuss.",
      riskTitle: "Risk review",
      riskDescription:
        "Use this prompt to inspect blind spots, power risks, retaliation risks, and unclear safeguards.",
      promptLabel: "Prompt",
      copy: "Copy prompt",
      copied: "Copied",
      resetToGenerated: "Reset to generated",
      edited: "Edited",
    },
    output: {
      previewTitle: "Live one-page model",
      previewIntro:
        "This preview updates from the current context, triggers, and escalation levels.",
      previewEyebrow: "Preview",
      brand: "Protection Path",
      documentTitle: "Protection & Escalation Model",
      draft: "Draft",
      purpose: "Purpose",
      context: "Context",
      guidingPrinciples: "Guiding principles",
      levels: "Levels",
      triggers: "Triggers",
      roles: "Roles",
      reviewRhythm: "Review rhythm",
      noContent: "Not yet specified",
      principles: [
        "Escalation is a protection path, not a punishment.",
        "Concerns raised in good faith must not create disadvantage.",
        "Information is shared on a need-to-know basis.",
        "De-escalation is intentional and documented.",
      ],
    },
    export: {
      copyText: "Copy text",
      markdown: "Download Markdown",
      word: "Export Word",
      print: "Print / PDF",
      copied: "Copied",
    },
  },
  de: {
    languageName: "Deutsch",
    sideTitle: "Schutzmodell",
    sideSub: "Team-Eskalationstool",
    privacyNote: "Alle Eingaben und Dokumente bleiben lokal in Ihrem Browser.",
    brandLine: "Bridge Work Labs",
    brandSub: "Leichtgewichtige Tools für echte Organisationsprobleme",
    appEyebrow: "Protection Path Designer",
    appTitle: "Schutz- & Eskalationsmodell",
    reset: "Zurücksetzen",
    resetConfirm: "Alles zurücksetzen? Kontext, Auslöser und Stufen werden gelöscht.",
    saved: "Gespeichert",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schliessen",
    toggleEducation: "Erläuterungen",
    levelCompletion: (filled: number, total: number) => `${filled} von ${total}`,
    continueToStep: (stepLabel: string) => `Weiter zu ${stepLabel}`,
    confirmReplaceWithDemo:
      "Aktuelles Modell durch die Demo ersetzen? Eingaben gehen verloren.",
    confirmStartBlank:
      "Mit einem leeren Modell neu beginnen? Eingaben gehen verloren.",
    demoBadge: "Demo geladen",
    draftBadge: "Entwurf",
    learningPanel: "Erläuterungen",
    learningFallback:
      "Hinweise zu diesem Schritt erscheinen hier.",
    learningFooter:
      "Vereinbaren Sie den Weg in ruhigen Momenten. Unter Druck ist er schwerer zu zeichnen.",
    placeholderTitle: "Für diesen Schritt gibt es noch keinen Inhalt",
    placeholderText:
      "Wählen Sie einen Schritt in der Seitenleiste, um fortzufahren.",
    steps: {
      vision: {
        label: "Vision",
        eyebrow: "Startpunkt",
        title: "Eskalation ist ein Schutzweg",
        description:
          "Ein gemeinsamer Rahmen für sensible Teams, bevor Druck, Hierarchie oder Unsicherheit den nächsten Schritt erschweren.",
        educationTitle: "Warum mit dem Weg beginnen?",
        educationText:
          "Ein Schutzweg macht aus einer persönlichen Konfrontation einen Weg, den das Team vorab vereinbart hat.",
      },
      build: {
        label: "Erstellen",
        eyebrow: "Modell erstellen",
        title: "Schutzmodell ausarbeiten",
        description:
          "Erfassen Sie den Kontext des Teams, die Auslöser für eine höhere Stufe und wie jede Eskalationsstufe in der Praxis aussieht.",
        educationTitle: "Hinweise zum Erstellen",
        educationText:
          "Beschreiben Sie Kontext, Rollen, Signale und Schutzmassnahmen so konkret, dass der Weg im Ernstfall trägt.",
      },
      reflect: {
        label: "Reflektieren",
        eyebrow: "Denkhilfe",
        title: "Modell vor der Nutzung prüfen",
        description:
          "Zwei Prompts, um das Modell zu schärfen und blinde Flecken sichtbar zu machen, bevor Sie es im Team teilen.",
        educationTitle: "Hinweise zur Reflexion",
        educationText:
          "Nutzen Sie die Prompts in einem Workshop oder fügen Sie sie in einen KI-Assistenten ein. Das Denken bleibt im Team.",
      },
      output: {
        label: "Output",
        eyebrow: "Einseiter",
        title: "Schutzweg in der Vorschau",
        description:
          "Eine einseitige Übersicht, die sich aus Ihren Eingaben aktualisiert. Kopieren, herunterladen oder drucken zum Teilen.",
        educationTitle: "Hinweise zum Output",
        educationText:
          "Der Einseiter dient als Referenz, nicht zur Lösung der Situation. Halten Sie ihn kurz, sichtbar und aktuell.",
      },
    },
    vision: {
      heroEyebrow: "Gemeinsame Sprache vor Druck",
      heroTitle: "Eskalation ist ein Schutzweg",
      heroSub: "Nicht Versagen. Nicht Bestrafung. Ein vorher vereinbarter Weg.",
      heroLead:
        "Ein strukturiertes Werkzeug für Teams, die mit sensiblen Situationen, Hierarchien und Schutzbedarf arbeiten, etwa in Hochschulen, Forschungseinrichtungen, öffentlichem Sektor und Governance-Arbeit.",
      startDemo: "Mit Demo starten",
      buildOwn: "Eigenes Modell erstellen",
      coreLabel: "Kernbotschaft",
      coreQuote:
        "In sensiblen Teams und Gremien ist Eskalation kein Zeichen von Versagen. Sie ist ein vorab vereinbarter Schutzweg, wenn Menschen, Rollen oder Entscheidungen unter Druck geraten.",
      pathTitle: "Eskalationspfad",
      pathSubtitle: "Ein sichtbarer Weg vom normalen Dialog bis zum Sofortschutz.",
      conceptTag: "Grundlagen",
      conceptTitle: "Gemeinsame Sprache",
      conceptDesc:
        "Diese Konzepte helfen Teams, schwierige Situationen klarer zu besprechen.",
      demoLoaded: "Demo-Modell geladen",
      ownStarted: "Leeres Modell bereit",
      pathway: [
        { label: "Normal", sub: "Teamdialog" },
        { label: "Frühsignal", sub: "Unsicherheit" },
        { label: "Geschützte Beratung", sub: "Neutrale Hilfe" },
        { label: "Formale Klärung", sub: "Formaler Weg" },
        { label: "Schutzmodus", sub: "Sofortschutz" },
      ],
      concepts: {
        psychologicalSafety: {
          title: "Psychologische Sicherheit",
          text: "Bedenken äussern, ohne Angst vor Vergeltung.",
          question: "Was würde Menschen sicher fühlen lassen?",
        },
        speakUpCulture: {
          title: "Speak-Up-Kultur",
          text: "Bedenken werden früh als Beitrag behandelt, nicht als Störung.",
          question: "Wo schweigen Menschen?",
        },
        powerAsymmetry: {
          title: "Machtasymmetrie",
          text: "Hierarchie kann begrenzen, was Menschen sagen können.",
          question: "Welche Machtunterschiede sind am wichtigsten?",
        },
        confidentiality: {
          title: "Vertraulichkeit",
          text: "Informationen werden nur mit denen geteilt, die sie brauchen.",
          question: "Was muss vertraulich bleiben?",
        },
        nonRetaliation: {
          title: "Vergeltungsschutz",
          text: "Bedenken in gutem Glauben führen zu keinen Nachteilen.",
          question: "Wie sähe Vergeltung bei uns aus?",
        },
        independentChannel: {
          title: "Unabhängiger Kanal",
          text: "Ein Weg ausserhalb der direkten Hierarchie ist verfügbar.",
          question: "Wann ist der direkte Weg nicht sicher?",
        },
      },
    },
    build: {
      mapEyebrow: "Eskalations-Risikokarte",
      mapTitle: "Aktuelle Eskalationsstufe wählen",
      mapIntro:
        "Weg überblicken, aktuelle Stufe auswählen und aus dem Panel handeln. Details bleiben unten bearbeitbar.",
      selectedLevel: "Aktuell ausgewählte Stufe",
      safeRouteTitle: "Sicherer Weg",
      safeRouteIntro:
        "Ein einfacher Weg vom regulären Teamkanal zu unabhängigen Schutzrollen.",
      recommendedActions: "Empfohlene Schritte",
      editDetails: "Stufendetails bearbeiten",
      contextAndTriggers: "Kontext und Auslöser",
      underlyingModelEditor: "Zugrunde liegendes Modell bearbeiten",
      laneModeSimple: "Einfach",
      laneModeDetailed: "Detailliert",
      routeTypes: {
        safe: "Sicherer Weg",
        normal: "Normaler Weg",
        caution: "Vorsicht / befangener Weg",
      },
      routeNodeLabels: {
        affectedPerson: "Betroffene Person",
        teamLead: "Teamleitung",
        decisionOwner: "Entscheidungsträger",
        independentSupport: "Ombudsperson / unabhängige Unterstützung",
        hrLegal: "HR / Recht",
        executiveSponsor: "GL-Patenschaft",
      },
      orgKinds: {
        team: "Teamweg",
        independent: "Unabhängig",
        formal: "Formal",
        protection: "Schutz",
      },
      contextTitle: "Kontext erfassen",
      contextIntro:
        "Erfassen Sie den grundlegenden Arbeitskontext für diesen Schutzweg. Diese Felder speisen Prompts und Einseiter.",
      contextFields: {
        teamName: "Name des Teams / Gremiums",
        rhythm: "Überprüfungsrhythmus",
        situations: "Sensible Situationen",
        power: "Machtasymmetrien",
        protection: "Schutzbedürftige Rollen",
        channels: "Bestehende Kanäle",
        redLines: "Rote Linien",
        openQuestions: "Offene Fragen",
      },
      contextPlaceholders: {
        teamName: "Forschungsethik-Gremium",
        rhythm: "Quartalsweise, plus nach grösseren Eskalationen",
        situations: "Wo trifft das Team sensible oder druckvolle Entscheidungen?",
        power: "Welche Hierarchien, Finanzierungen oder Rollenunterschiede zählen?",
        protection: "Wer braucht besonderen Schutz, um sicher sprechen zu können?",
        channels: "Welche formellen oder informellen Wege existieren bereits?",
        redLines: "Was muss sofort Schutz oder eine Pause auslösen?",
        openQuestions: "Was ist noch ungeklärt oder muss vereinbart werden?",
      },
      levelsTitle: "Eskalationsstufen",
      levelsIntro:
        "Beschreiben Sie, wie jede der fünf Stufen im Alltag des Teams aussieht.",
      triggersTitle: "Auslöser",
      triggersIntro:
        "Wählen Sie die Signale, die einen Wechsel auf eine höhere Stufe rechtfertigen, oder ergänzen Sie eigene.",
      selectedTriggers: "Ausgewählte Auslöser",
      noTriggers: "Noch keine Auslöser ausgewählt.",
      customTriggerPlaceholder: "Eigenen Auslöser ergänzen",
      addTrigger: "Hinzufügen",
      remove: "Entfernen",
      sectionLabels: {
        context: "Kontext",
        triggers: "Auslöser",
        levels: "Stufen",
      },
      fields: {
        name: "Name",
        purpose: "Zweck",
        triggers: "Auslöser",
        safeFirstStep: "Sicherer erster Schritt",
        roles: "Rollen / Kontakte",
        safeguards: "Schutzmassnahmen",
        documentation: "Dokumentation",
        deEscalation: "De-Eskalation",
      },
      triggerLabels: {
        powerImbalance: "Machtgefälle",
        retaliationConcern: "Vergeltungsrisiko",
        confidentialityNeed: "Vertraulichkeitsbedarf",
        conflictedDecisionMaker: "Befangene Entscheidungsperson",
        safetyRisk: "Sicherheitsrisiko",
        legalExposure: "Rechtliches Risiko",
        repeatedSilence: "Wiederholtes Schweigen",
        unresolvedFacts: "Ungeklärte Fakten",
      },
    },
    reflect: {
      note: "Diese Prompts sind für einen Workshop gedacht oder zum Einfügen in einen KI-Assistenten. Das Denken und die Entscheidungen bleiben im Team.",
      sharpenTitle: "Modell schärfen",
      sharpenDescription:
        "Nutzen Sie diesen Prompt, um den aktuellen Schutzweg klarer, praktischer und besser besprechbar zu machen.",
      riskTitle: "Risikoprüfung",
      riskDescription:
        "Nutzen Sie diesen Prompt, um blinde Flecken, Machtrisiken, Vergeltungsrisiken und unklare Schutzmassnahmen zu prüfen.",
      promptLabel: "Prompt",
      copy: "Prompt kopieren",
      copied: "Kopiert",
      resetToGenerated: "Auf generierten Stand zurücksetzen",
      edited: "Bearbeitet",
    },
    output: {
      previewTitle: "Live-Einseiter",
      previewIntro:
        "Diese Vorschau aktualisiert sich aus Kontext, Auslösern und Eskalationsstufen.",
      previewEyebrow: "Vorschau",
      brand: "Schutzweg",
      documentTitle: "Schutz- & Eskalationsmodell",
      draft: "Entwurf",
      purpose: "Zweck",
      context: "Kontext",
      guidingPrinciples: "Leitprinzipien",
      levels: "Stufen",
      triggers: "Auslöser",
      roles: "Rollen",
      reviewRhythm: "Überprüfungsrhythmus",
      noContent: "Noch nicht festgelegt",
      principles: [
        "Eskalation ist ein Schutzweg, keine Bestrafung.",
        "Bedenken in gutem Glauben dürfen keine Nachteile erzeugen.",
        "Vertraulichkeit folgt dem Need-to-know-Prinzip.",
        "De-Eskalation ist bewusst und dokumentiert.",
      ],
    },
    export: {
      copyText: "Text kopieren",
      markdown: "Markdown herunterladen",
      word: "Word exportieren",
      print: "Drucken / PDF",
      copied: "Kopiert",
    },
  },
};
