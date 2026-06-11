import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/Reveal";

/* ──────────────────────────────────────────────────────────────
   Shared bold/premium UI primitives for the BirLiy landing.
   One visual language across every section: green eyebrow pills,
   bold headlines, glowing green CTAs, and photo frames with a
   green depth block. Real photography — no drawn mockups.
   ────────────────────────────────────────────────────────────── */

export function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-green-800">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  center = false,
  maxTitle = "20ch",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
  maxTitle?: string;
}) {
  return (
    <Reveal as="div" className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <EyebrowPill>{eyebrow}</EyebrowPill>
      <h2
        style={{ maxWidth: maxTitle }}
        className={cn(
          "mt-5 text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl",
          center && "mx-auto",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-700", center && "mx-auto")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export function PrimaryCTA({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "group/cta inline-flex items-center gap-2 rounded-full bg-green-700 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(3,183,61,0.55)] transition-colors duration-200 ease-birliy hover:bg-green-800",
    className,
  );
  const content = (
    <>
      {children}
      <ArrowRight
        size={18}
        strokeWidth={2}
        className="transition-transform duration-200 ease-birliy group-hover/cta:translate-x-0.5"
      />
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

/** Photo in a premium rounded frame with an offset green depth block. */
export function PhotoFrame({
  src,
  alt,
  imgClassName = "aspect-[4/3]",
  blockSide = "br",
  className,
}: {
  src: string;
  alt: string;
  imgClassName?: string;
  blockSide?: "br" | "bl";
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute hidden h-full w-full rounded-[2rem] bg-green-500 sm:block",
          blockSide === "br" ? "-bottom-5 -right-5" : "-bottom-5 -left-5",
        )}
      />
      <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-ink-900/10 shadow-[0_34px_80px_-34px_rgba(11,24,38,0.45)]">
        <img src={src} alt={alt} className={cn("block w-full object-cover", imgClassName)} loading="lazy" />
      </div>
    </div>
  );
}
