import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { buildReflectionPrompt } from "../prompts";
import type { ToolState } from "../schema";
import type { TranslationSet } from "../translations";

type ReflectScreenProps = {
  state: ToolState;
  translations: TranslationSet;
};

type PromptKind = "sharpen" | "risk";

export function ReflectScreen({ state, translations: t }: ReflectScreenProps) {
  const [copied, setCopied] = useState<PromptKind | null>(null);
  const cards: Array<{
    id: PromptKind;
    title: string;
    description: string;
    prompt: string;
  }> = [
    {
      id: "sharpen",
      title: t.reflect.sharpenTitle,
      description: t.reflect.sharpenDescription,
      prompt: buildReflectionPrompt("sharpen", state, state.language),
    },
    {
      id: "risk",
      title: t.reflect.riskTitle,
      description: t.reflect.riskDescription,
      prompt: buildReflectionPrompt("risk", state, state.language),
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

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-accent-400/40 bg-accent-400/10 p-4">
        <p className="text-[13.5px] font-medium leading-6 tracking-tight text-ink">
          {t.reflect.note}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card, index) => (
          <article
            className="card flex min-h-[32rem] flex-col p-6"
            key={card.id}
          >
            <div>
              <p className="eyebrow">
                {t.reflect.promptLabel} {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="display-3 mt-2">{card.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-ink-2">
                {card.description}
              </p>
            </div>

            <pre className="mt-5 min-h-0 flex-1 overflow-auto rounded-xl border border-hairline bg-surface-2 p-4 font-mono text-[12px] leading-5 text-ink-2">
              {card.prompt}
            </pre>

            <button
              className="btn-secondary mt-5 self-start"
              onClick={() => copyPrompt(card.id, card.prompt)}
              type="button"
            >
              {copied === card.id ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-sage-500" />
              ) : (
                <Copy aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {copied === card.id ? t.reflect.copied : t.reflect.copy}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
