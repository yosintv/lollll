"use client";

import { useEffect } from "react";

type GoogleAdProps = {
  className?: string;
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function GoogleAd({ className = "", label }: GoogleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore ad push issues during hydration or local development.
    }
  }, []);

  return (
    <div className={`ad-shell ${className}`.trim()}>
      {label ? <div className="ad-label">{label}</div> : null}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5525538810839147"
        data-ad-slot="4345862479"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
