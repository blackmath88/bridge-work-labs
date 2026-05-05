import { useState } from "react";
import { downloadDocx } from "../lib/exportDocx";
import { downloadTextFile } from "../lib/exportMarkdown";
import {
  buildMarkdownOutput,
  buildOutputModel,
  buildPlainTextOutput,
} from "../tools/protection-path/output";
import type { Language, ToolState } from "../tools/protection-path/schema";
import type { TranslationSet } from "../tools/protection-path/translations";

type ExportButtonsProps = {
  state: ToolState;
  translations: TranslationSet;
};

export function ExportButtons({ state, translations: t }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const language: Language = state.language;

  async function copyText() {
    const text = buildPlainTextOutput(state, language);

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadMarkdown() {
    downloadTextFile(
      buildMarkdownOutput(state, language),
      "protection-path-model.md",
      "text/markdown;charset=utf-8",
    );
  }

  async function exportWord() {
    const model = buildOutputModel(state, language);

    await downloadDocx(
      {
        title: model.title,
        subtitle: `${model.subtitle} - ${model.date}`,
        sections: [
          { heading: t.output.purpose, body: model.purpose },
          { heading: t.output.context, body: model.context || t.output.noContent },
          { heading: t.output.guidingPrinciples, body: model.principles },
          {
            heading: t.output.levels,
            body: model.levels.map(
              (level) =>
                `${level.number}. ${level.name}: ${level.purpose || t.output.noContent} (${level.roles || t.output.noContent})`,
            ),
          },
          {
            heading: t.output.triggers,
            body: model.triggers.length ? model.triggers : [t.output.noContent],
          },
          {
            heading: t.output.roles,
            body: model.roles.length ? model.roles : [t.output.noContent],
          },
          {
            heading: t.output.reviewRhythm,
            body: model.rhythm || t.output.noContent,
          },
        ],
      },
      "protection-path-model.docx",
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-lg border border-sage bg-white px-4 py-2 text-xs font-bold text-sage shadow-sage transition-colors hover:bg-sage hover:text-white"
        onClick={copyText}
        type="button"
      >
        {copied ? t.export.copied : t.export.copyText}
      </button>
      <button
        className="rounded-lg border border-sage bg-white px-4 py-2 text-xs font-bold text-sage shadow-sage transition-colors hover:bg-sage hover:text-white"
        onClick={downloadMarkdown}
        type="button"
      >
        {t.export.markdown}
      </button>
      <button
        className="rounded-lg border border-sage bg-white px-4 py-2 text-xs font-bold text-sage shadow-sage transition-colors hover:bg-sage hover:text-white"
        onClick={exportWord}
        type="button"
      >
        {t.export.word}
      </button>
      <button
        className="rounded-lg border border-sage bg-white px-4 py-2 text-xs font-bold text-sage shadow-sage transition-colors hover:bg-sage hover:text-white"
        onClick={() => window.print()}
        type="button"
      >
        {t.export.print}
      </button>
    </div>
  );
}
