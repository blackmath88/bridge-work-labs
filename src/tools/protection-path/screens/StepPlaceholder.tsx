import type { TranslationSet } from "../translations";

export function StepPlaceholder({ translations: t }: { translations: TranslationSet }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong bg-surface-2 p-10 text-center">
      <p className="text-[14px] font-semibold tracking-tight text-ink">
        {t.placeholderTitle}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-[13.5px] leading-6 text-ink-2">
        {t.placeholderText}
      </p>
    </div>
  );
}
