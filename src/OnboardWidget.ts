import type { initOnboard as initOnboardProps, OnboardConfig } from "./types";
import { createWidget } from "./widget";

declare global {
  interface Window {
    initOnboard?: (cfg: OnboardConfig) => ReturnType<typeof createWidget> | null;
  }
}

export function initOnboard(config: initOnboardProps) {

  const widget = createWidget(config);

  window.OnboardWidget = widget;

  return widget;
}

// Attach globally for script-tag usage
window.initOnboard = initOnboard;

