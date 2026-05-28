export type Locale = "ru" | "uz";

export const EASE = [0.2, 0.8, 0.2, 1] as const;

export const settle = (delay: number, reduce = false) =>
  reduce
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: EASE, delay },
      };
