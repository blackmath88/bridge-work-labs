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
    copy: string;
    copied: string;
  };
  output: {
    previewTitle: string;
    previewIntro: string;
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
    demoBadge: "Demo loaded",
    draftBadge: "Draft",
    learningPanel: "Learning panel",
    learningFallback:
      "Educational guidance for this step will appear here as the tool grows.",
    learningFooter: "Keep the path clear, visible, and agreed before difficult moments arrive.",
    placeholderTitle: "Placeholder screen for this step",
    placeholderText:
      "This area is reserved for a later issue. Forms, editors, prompts, preview, and exports are intentionally not implemented here.",
    steps: {
      vision: {
        label: "Vision",
        eyebrow: "Start here",
        title: "Escalation is a protection path",
        description:
          "A shared frame for sensitive teams before pressure, hierarchy, or uncertainty makes the next step harder.",
        educationTitle: "Why start with the path?",
        educationText:
          "A protection path turns escalation from a personal confrontation into a previously agreed route.",
      },
      build: {
        label: "Build",
        eyebrow: "Model builder",
        title: "Shape the protection model",
        description:
          "The context form and level editor will live here in later issues. For now, this is a clean shell placeholder.",
        educationTitle: "Build guidance",
        educationText:
          "Later, this area will help teams describe context, roles, signals, and safeguards.",
      },
      reflect: {
        label: "Reflect",
        eyebrow: "Thinking support",
        title: "Review the model before use",
        description:
          "Reflection prompts will appear here later, helping teams sharpen the model and review risks.",
        educationTitle: "Reflection guidance",
        educationText:
          "Later, this area will support model sharpening and risk review prompts.",
      },
      output: {
        label: "Output",
        eyebrow: "One-page model",
        title: "Preview the protection path",
        description:
          "The live one-page output and export controls will be added in later issues.",
        educationTitle: "Output guidance",
        educationText:
          "Later, this area will explain how to read and use the one-page model.",
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
        "In sensitive teams and committees, escalation is not a sign of failure. It is a pre-agreed protection path when people, roles, or decisions come under pressure.",
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
        "Edit the five default levels. Each card expands so the model can stay compact while you work.",
      triggersTitle: "Trigger selector",
      triggersIntro:
        "Choose predefined triggers or add your own. These signals remain separate from the later context form.",
      selectedTriggers: "Selected triggers",
      noTriggers: "No triggers selected yet.",
      customTriggerPlaceholder: "Add a custom trigger",
      addTrigger: "Add",
      remove: "Remove",
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
      note: "This is not an AI tool. It is a thinking aid.",
      sharpenTitle: "Sharpen model",
      sharpenDescription:
        "Use this prompt to make the current protection path clearer, more practical, and easier to discuss.",
      riskTitle: "Risk review",
      riskDescription:
        "Use this prompt to inspect blind spots, power risks, retaliation risks, and unclear safeguards.",
      copy: "Copy prompt",
      copied: "Copied",
    },
    output: {
      previewTitle: "Live one-page model",
      previewIntro:
        "This preview updates from the current context, triggers, and escalation levels.",
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
        "Confidentiality follows need-to-know.",
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
    demoBadge: "Demo geladen",
    draftBadge: "Entwurf",
    learningPanel: "Wissen",
    learningFallback:
      "Pädagogische Hinweise für diesen Schritt erscheinen hier, wenn das Tool wächst.",
    learningFooter:
      "Halten Sie den Weg klar, sichtbar und vereinbart, bevor schwierige Momente entstehen.",
    placeholderTitle: "Platzhalter für diesen Schritt",
    placeholderText:
      "Dieser Bereich ist für ein späteres Issue reserviert. Formulare, Editoren, Prompts, Vorschau und Exporte sind hier bewusst noch nicht umgesetzt.",
    steps: {
      vision: {
        label: "Vision",
        eyebrow: "Startpunkt",
        title: "Eskalation ist ein Schutzweg",
        description:
          "Ein gemeinsamer Rahmen für sensible Teams, bevor Druck, Hierarchie oder Unsicherheit den nächsten Schritt erschweren.",
        educationTitle: "Warum mit dem Weg beginnen?",
        educationText:
          "Ein Schutzweg macht Eskalation zu einer vorab vereinbarten Route statt zu einer persönlichen Konfrontation.",
      },
      build: {
        label: "Bauen",
        eyebrow: "Modellbau",
        title: "Schutzmodell formen",
        description:
          "Kontextformular und Stufeneditor kommen in späteren Issues. Vorerst bleibt dies ein sauberer Shell-Platzhalter.",
        educationTitle: "Hinweise zum Bauen",
        educationText:
          "Später hilft dieser Bereich, Kontext, Rollen, Signale und Schutzmassnahmen zu beschreiben.",
      },
      reflect: {
        label: "Reflektieren",
        eyebrow: "Denkhilfe",
        title: "Modell vor der Nutzung prüfen",
        description:
          "Reflexionsprompts erscheinen später hier, um das Modell zu schärfen und Risiken zu prüfen.",
        educationTitle: "Hinweise zur Reflexion",
        educationText:
          "Später unterstützt dieser Bereich beim Schärfen des Modells und bei der Risikoprüfung.",
      },
      output: {
        label: "Output",
        eyebrow: "Einseiter",
        title: "Schutzweg in der Vorschau",
        description:
          "Live-Einseiter und Exportfunktionen werden in späteren Issues ergänzt.",
        educationTitle: "Hinweise zum Output",
        educationText:
          "Später erklärt dieser Bereich, wie der Einseiter gelesen und genutzt werden kann.",
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
        "Bearbeiten Sie die fünf Standardstufen. Jede Karte lässt sich aufklappen, damit das Modell beim Arbeiten übersichtlich bleibt.",
      triggersTitle: "Trigger-Auswahl",
      triggersIntro:
        "Wählen Sie vordefinierte Trigger oder ergänzen Sie eigene. Diese Signale bleiben getrennt vom späteren Kontextformular.",
      selectedTriggers: "Ausgewählte Trigger",
      noTriggers: "Noch keine Trigger ausgewählt.",
      customTriggerPlaceholder: "Eigenen Trigger ergänzen",
      addTrigger: "Hinzufügen",
      remove: "Entfernen",
      fields: {
        name: "Name",
        purpose: "Zweck",
        triggers: "Trigger",
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
      note: "Dies ist kein KI-Tool. Es ist eine Denkhilfe.",
      sharpenTitle: "Modell schärfen",
      sharpenDescription:
        "Nutzen Sie diesen Prompt, um den aktuellen Schutzweg klarer, praktischer und besser besprechbar zu machen.",
      riskTitle: "Risikoprüfung",
      riskDescription:
        "Nutzen Sie diesen Prompt, um blinde Flecken, Machtrisiken, Vergeltungsrisiken und unklare Schutzmassnahmen zu prüfen.",
      copy: "Prompt kopieren",
      copied: "Kopiert",
    },
    output: {
      previewTitle: "Live-Einseiter",
      previewIntro:
        "Diese Vorschau aktualisiert sich aus Kontext, Triggern und Eskalationsstufen.",
      documentTitle: "Schutz- & Eskalationsmodell",
      draft: "Entwurf",
      purpose: "Zweck",
      context: "Kontext",
      guidingPrinciples: "Leitprinzipien",
      levels: "Stufen",
      triggers: "Trigger",
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
