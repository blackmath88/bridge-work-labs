import { Check, Copy, FileDown, Printer, FileText } from "lucide-react";
import { useState } from "react";
import { downloadDocx } from "../lib/exportDocx";
import { downloadTextFile } from "../lib/exportMarkdown";
import {
  buildMarkdownOutput,
  buildOutputModel,
  buildPlainTextOutput,
  getLevelFieldOrder,
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
    const empty = t.output.noContent;
    const fieldLabels = t.build.fields;
    const fieldOrder = getLevelFieldOrder();

    const levelSections = model.levels.flatMap((level) => [
      {
        heading: `${level.number}. ${level.name || empty}`,
        body: fieldOrder.map(
          (field) => `${fieldLabels[field]}: ${level[field] || empty}`,
        ),
      },
    ]);

    await downloadDocx(
      {
        title: model.title,
        subtitle: `${model.subtitle} - ${model.date}`,
        sections: [
          { heading: t.output.purpose, body: model.purpose },
          { heading: t.output.context, body: model.context || empty },
          { heading: t.output.guidingPrinciples, body: model.principles },
          { heading: t.output.levels, body: "" },
          ...levelSections,
          {
            heading: t.output.triggers,
            body: model.triggers.length ? model.triggers : [empty],
          },
          {
            heading: t.output.roles,
            body: model.roles.length ? model.roles : [empty],
          },
          {
            heading: t.output.reviewRhythm,
            body: model.rhythm || empty,
          },
        ],
      },
      "protection-path-model.docx",
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary" onClick={copyText} type="button">
        {copied ? (
          <Check aria-hidden="true" className="h-3.5 w-3.5 text-sage-500" />
        ) : (
          <Copy aria-hidden="true" className="h-3.5 w-3.5" />
        )}
        {copied ? t.export.copied : t.export.copyText}
      </button>
      <button
        className="btn-secondary"
        onClick={downloadMarkdown}
        type="button"
      >
        <FileText aria-hidden="true" className="h-3.5 w-3.5" />
        {t.export.markdown}
      </button>
      <button className="btn-secondary" onClick={exportWord} type="button">
        <FileDown aria-hidden="true" className="h-3.5 w-3.5" />
        {t.export.word}
      </button>
      <button
        className="btn-secondary"
        onClick={() => window.print()}
        type="button"
      >
        <Printer aria-hidden="true" className="h-3.5 w-3.5" />
        {t.export.print}
      </button>
    </div>
  );
}
