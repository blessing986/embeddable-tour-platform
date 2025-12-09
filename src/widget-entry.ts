import type { initOnboard, OnboardConfig } from "./types";
import { createWidget } from "./widget";

declare global {
  interface Window {
    initOnboard?: (cfg: OnboardConfig) => ReturnType<typeof createWidget> | null;
  }
}

export function initOnboard(config: initOnboard) {

  const widget = createWidget(config);

  window.OnboardWidget = widget;

  return widget;
}

// Attach globally for script-tag usage
window.initOnboard = initOnboard;
