interface IconProps {
  size?: number;
  className?: string;
}

/** Telegram paper-plane glyph. Monochrome (currentColor) to stay inside the BirLiy ink/paper palette. */
export function TelegramIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.94 4.51 18.9 19.2c-.23 1.08-.87 1.34-1.77.84l-4.9-3.62-2.36 2.28c-.26.26-.48.48-.99.48l.35-5.02 9.13-8.25c.4-.35-.09-.55-.62-.2L6.45 13.1l-4.86-1.52c-1.06-.33-1.08-1.06.22-1.57L20.6 3.04c.88-.33 1.65.2 1.34 1.47Z" />
    </svg>
  );
}
