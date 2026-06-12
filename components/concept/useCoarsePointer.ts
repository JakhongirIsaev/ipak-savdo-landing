"use client";

import { useEffect, useState } from "react";

// In-app browsers (Telegram, Instagram) fire IntersectionObserver unreliably,
// which can leave whileInView entrances stuck at opacity 0 (sections look like
// blank white voids). On touch devices we render entrances statically instead;
// self-animating scenes manage their own loops and are unaffected.
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    setCoarse(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);
  return coarse;
}
