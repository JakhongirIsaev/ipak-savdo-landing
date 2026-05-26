interface TrustStripProps {
  t: { bank: string; catalogSize: string; pilot: string };
}

export function TrustStrip({ t }: TrustStripProps) {
  const items = [t.bank, t.catalogSize, t.pilot];
  return (
    <section className="border-y border-mist bg-paper py-5">
      <div className="section-shell">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-10">
              <span>{item}</span>
              {i < items.length - 1 && (
                <span aria-hidden className="hidden h-3 w-px bg-mist sm:inline-block" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
