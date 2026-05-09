import type { ReactNode } from "react";
import { ExportButtons } from "../../../components/ExportButtons";
import { buildOutputModel, getLevelFieldOrder, type OutputLevel } from "../output";
import type { ToolState } from "../schema";
import type { TranslationSet } from "../translations";

type OutputScreenProps = {
  state: ToolState;
  translations: TranslationSet;
};

export function OutputScreen({ state, translations: t }: OutputScreenProps) {
  const model = buildOutputModel(state, state.language);

  return (
    <div className="space-y-5">
      <div className="no-print card flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
        <div>
          <p className="eyebrow">{t.output.previewEyebrow}</p>
          <h3 className="display-3 mt-1">{t.output.previewTitle}</h3>
          <p className="mt-1 text-[13.5px] leading-6 text-ink-2">
            {t.output.previewIntro}
          </p>
        </div>
        <ExportButtons state={state} translations={t} />
      </div>

      <article className="print-document card-elevated p-7 md:p-12">
        <header className="mb-9 flex flex-col justify-between gap-4 border-b border-hairline-strong pb-6 md:flex-row md:items-start">
          <div>
            <p className="eyebrow">{t.output.brand}</p>
            <h3 className="mt-2 text-[26px] font-semibold tracking-tightest text-ink md:text-[32px]">
              {model.title}
            </h3>
            <p className="mt-2 text-[13.5px] tracking-tight text-ink-2">
              {model.subtitle}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
              v1.0 — {model.date}
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              Folio 01 / 01
            </p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <aside className="space-y-7 lg:border-r lg:border-hairline lg:pr-8">
            <OutputBlock title={t.output.guidingPrinciples}>
              <OutputList items={model.principles} empty={t.output.noContent} />
            </OutputBlock>
            <OutputBlock title={t.output.triggers}>
              <OutputPills items={model.triggers} empty={t.output.noContent} />
            </OutputBlock>
            <OutputBlock title={t.output.roles}>
              <OutputList items={model.roles} empty={t.output.noContent} />
            </OutputBlock>
          </aside>

          <section className="space-y-7">
            <OutputBlock title={t.output.purpose}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.purpose || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.context}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.context || t.output.noContent}
              </p>
            </OutputBlock>

            <OutputBlock title={t.output.levels}>
              <div className="space-y-3">
                {model.levels.map((level) => (
                  <OutputLevelCard
                    key={level.number}
                    empty={t.output.noContent}
                    fieldLabels={t.build.fields}
                    level={level}
                  />
                ))}
              </div>
            </OutputBlock>

            <OutputBlock title={t.output.reviewRhythm}>
              <p className="text-[14px] leading-7 text-ink-2">
                {model.rhythm || t.output.noContent}
              </p>
            </OutputBlock>
          </section>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-hairline pt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
          <span>{t.sideTitle}</span>
          <span>{t.brandLine}</span>
        </footer>
      </article>
    </div>
  );
}

function OutputBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-3">
        {title}
      </h4>
      {children}
    </section>
  );
}

function OutputList({ items, empty }: { items: string[]; empty: string }) {
  return (
    <ul className="space-y-1.5 text-[14px] leading-7 text-ink-2">
      {(items.length ? items : [empty]).map((item) => (
        <li className="flex gap-2.5" key={item}>
          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-ink-4" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OutputPills({ items, empty }: { items: string[]; empty: string }) {
  return items.length ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-2.5 py-1 text-[11.5px] font-medium tracking-tight text-sage-700"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-[14px] text-ink-3">{empty}</p>
  );
}

type OutputLevelCardProps = {
  level: OutputLevel;
  empty: string;
  fieldLabels: TranslationSet["build"]["fields"];
};

function OutputLevelCard({ level, empty, fieldLabels }: OutputLevelCardProps) {
  const fields = getLevelFieldOrder();

  return (
    <article className="break-inside-avoid rounded-xl border border-hairline bg-surface p-4">
      <header className="mb-3 flex items-baseline gap-2.5">
        <span className="font-mono text-[12px] font-semibold text-ink-3">
          {String(level.number).padStart(2, "0")}
        </span>
        <h5 className="text-[14px] font-semibold tracking-tight text-ink">
          {level.name || empty}
        </h5>
      </header>
      <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field}>
            <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-3">
              {fieldLabels[field]}
            </dt>
            <dd className="mt-0.5 text-[13px] leading-6 text-ink-2">
              {level[field] || empty}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
