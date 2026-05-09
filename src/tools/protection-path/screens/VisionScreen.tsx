import { Check, PlayCircle, Wrench } from "lucide-react";
import { conceptKeys, pathwayColors } from "../config";
import type { TranslationSet } from "../translations";

type VisionScreenProps = {
  demoMode: boolean;
  translations: TranslationSet;
  onLoadDemo: () => void;
  onBuildOwn: () => void;
};

export function VisionScreen({
  demoMode,
  translations: t,
  onLoadDemo,
  onBuildOwn,
}: VisionScreenProps) {
  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow-accent">{t.vision.heroEyebrow}</p>
          <h2 className="display-1 mt-4 max-w-3xl">{t.vision.heroTitle}</h2>
          <p className="mt-5 max-w-2xl text-[20px] font-medium leading-[1.45] tracking-tight text-ink-2">
            {t.vision.heroSub}
          </p>
          <p className="lede mt-5 max-w-2xl">{t.vision.heroLead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <button
              className="btn-primary btn-lg"
              onClick={onLoadDemo}
              type="button"
            >
              <PlayCircle aria-hidden="true" className="h-4 w-4" />
              {t.vision.startDemo}
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={onBuildOwn}
              type="button"
            >
              <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
              {t.vision.buildOwn}
            </button>
            {demoMode ? (
              <span className="chip chip-active">
                <Check aria-hidden="true" className="h-3 w-3" />
                {t.vision.demoLoaded}
              </span>
            ) : null}
          </div>
        </div>

        <figure className="card-elevated relative overflow-hidden bg-gradient-to-br from-sage-700 to-sage-900 p-8 text-white md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sage-400/20 blur-2xl"
          />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sage-200">
            {t.vision.coreLabel}
          </p>
          <blockquote className="mt-4 text-[19px] font-medium leading-[1.5] tracking-tight">
            “{t.vision.coreQuote}”
          </blockquote>
          <p className="mt-6 text-[12.5px] leading-relaxed text-sage-100/80">
            {t.steps.vision.educationText}
          </p>
        </figure>
      </section>

      <Pathway translations={t} />

      <section>
        <p className="eyebrow-accent">{t.vision.conceptTag}</p>
        <h3 className="display-3 mt-2">{t.vision.conceptTitle}</h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-2">
          {t.vision.conceptDesc}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {conceptKeys.map((key) => {
            const concept = t.vision.concepts[key];
            return (
              <article
                className="card group p-5 transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-e2"
                key={key}
              >
                <h4 className="text-[14px] font-semibold tracking-tight text-ink">
                  {concept.title}
                </h4>
                <p className="mt-2 text-[13.5px] leading-6 text-ink-2">
                  {concept.text}
                </p>
                <p className="mt-4 border-t border-dashed border-hairline pt-3 text-[12.5px] font-medium leading-5 text-sage-600">
                  {concept.question}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Pathway({ translations: t }: { translations: TranslationSet }) {
  return (
    <section className="card p-6 md:p-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow-accent">{t.vision.pathTitle}</p>
          <h3 className="display-3 mt-2">{t.vision.pathSubtitle}</h3>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 md:inline">
          0 → 4
        </span>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-6 sm:grid-cols-5">
        <div
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-gradient-to-r from-hairline-strong via-sage-300 to-hairline-strong sm:block"
        />
        {t.vision.pathway.map((level, index) => (
          <div
            className="relative z-10 flex flex-col items-center text-center"
            key={level.label}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-surface font-mono text-[12px] font-semibold tracking-tight text-ink shadow-e2"
              style={{
                background: `linear-gradient(180deg, ${pathwayColors[index]}22, transparent), white`,
                borderColor: pathwayColors[index],
              }}
            >
              {index}
            </div>
            <p className="mt-3 text-[12.5px] font-semibold tracking-tight text-ink">
              {level.label}
            </p>
            <p className="mt-1 text-[11.5px] text-ink-3">{level.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
