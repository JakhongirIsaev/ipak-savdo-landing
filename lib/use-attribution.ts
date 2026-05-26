"use client";

import { useEffect, useState } from "react";

export interface Attribution {
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function useAttribution(): Attribution {
  const [attribution, setAttribution] = useState<Attribution>({});
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      source: params.get("source") || undefined,
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    });
  }, []);
  return attribution;
}
