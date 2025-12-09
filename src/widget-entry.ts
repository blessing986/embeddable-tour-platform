// import type { OnboardConfig } from "./types";
// import { createWidget } from "./widget";

import type { OnboardConfig } from "./types";
import { createWidget } from "./widget";


// declare global {
//   interface Window { initOnboard?: (cfg: OnboardConfig) => any; }
// }

// export function initOnboard(config: OnboardConfig) {
//   if (!config || !Array.isArray(config.steps) || config.steps.length < 5) {
//     console.error("Onboard: config.steps required (min 5)");
//     return null;
//   }
//   const widget = createWidget(config);
//   window.OnboardWidget = widget;
//   return widget;
// }

// window.initOnboard = initOnboard;


declare global {
  interface Window {
    initOnboard?: (cfg: OnboardConfig) => ReturnType<typeof createWidget> | null;
  }
}

export function initOnboard(config: OnboardConfig) {
  // Basic validation
  if (!config || !Array.isArray(config.steps) || config.steps.length < 1) {
    console.error("Onboard: config.steps required (min 1)");
    return null;
  }

  // Create widget instance
  const widget = createWidget(config);

  // Expose widget instance globally (optional but useful)
  window.OnboardWidget = widget;

  return widget;
}

// Attach globally for script-tag usage
window.initOnboard = initOnboard;
