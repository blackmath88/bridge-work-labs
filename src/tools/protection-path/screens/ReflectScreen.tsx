import { ArrowRight, Check, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";
import { buildReflectionPrompt } from "../prompts";
import type { ToolState } from "../schema";
import type { TranslationSet } from "../translations";

type ReflectScreenProps = {
  state: ToolState;
  translations: TranslationSet;
  onAdvance: () => void;
};

type PromptKind = "sharpen" | "risk";

type Edits = Record<PromptKind, string | null>;

const initialEdits: Edits = { sharpen: null, risk: null };

export function ReflectScreen({
  state,
  translations: t,
  onAdvance,
}: ReflectScreenProps) {
  const [copied, setCopied] = useState<PromptKind | null>(null);
  const [edits, setEdits] = useState<Edits>(initialEdits);

  const cards: Array<{
    id: PromptKind;
    title: string;
    description: string;
    generated: string;
  }> = [
    {
      id: "sharpen",
      title: t.reflect.sharpenTitle,
      description: t.reflect.sharpenDescription,
      generated: buildReflectionPrompt("sharpen", state, state.language),
    },
    {
      id: "risk",
      title: t.reflect.riskTitle,
      description: t.reflect.riskDescription,
      generated: buildReflectionPrompt("risk", state, state.language),
    },
  ];

  async function copyPrompt(id: PromptKind, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function setEdit(id: PromptKind, value: string | null) {
    setEdits((current) => ({ ...current, [id]: value }));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-accent-400/40 bg-accent-400/10 p-4">
        <p className="text-[13.5px] font-medium leading-6 tracking-tight text-ink">
          {t.reflect.note}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card, index) => {
          const edited = edits[card.id] !== null;
          const value = edits[card.id] ?? card.generated;

          return (
            <article
              className="card flex min-h-[32rem] flex-col p-6"
              key={card.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow">
                    {t.reflect.promptLabel} {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display-3 mt-2">{card.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-ink-2">
                    {card.description}
                  </p>
                </div>
                {edited ? (
                  <span className="chip chip-muted shrink-0 text-[10px] uppercase tracking-[0.12em]">
                    {t.reflect.edited}
                  </span>
                ) : null}
              </div>

              <textarea
                aria-label={card.title}
                className="field mt-5 min-h-0 flex-1 resize-none font-mono text-[12px] leading-5 text-ink-2"
                onChange={(event) => setEdit(card.id, event.target.value)}
                value={value}
              />

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => copyPrompt(card.id, value)}
                  type="button"
                >
                  {copied === card.id ? (
                    <Check aria-hidden="true" className="h-3.5 w-3.5 text-sage-500" />
                  ) : (
                    <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                  {copied === card.id ? t.reflect.copied : t.reflect.copy}
                </button>
                {edited ? (
                  <button
                    className="btn-ghost"
                    onClick={() => setEdit(card.id, null)}
                    type="button"
                  >
                    <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                    {t.reflect.resetToGenerated}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn-primary btn-lg" onClick={onAdvance} type="button">
          {t.continueToStep(t.steps.output.label)}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
