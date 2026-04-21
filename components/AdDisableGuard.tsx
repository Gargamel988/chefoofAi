"use client";

import { useEffect } from "react";

export default function AdDisableGuard() {
  useEffect(() => {
    document.body.dataset.adsDisabled = "true";
    return () => {
      delete document.body.dataset.adsDisabled;
    };
  }, []);

  return null;
}
