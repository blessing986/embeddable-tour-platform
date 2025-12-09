
import { createRoot, type Root } from "react-dom/client";
import type { OnboardConfig } from "./types";
import OnboardingWidget from "./OnboardingWidget";

export function createWidget(config: OnboardConfig) {
  const tourId = config.tourId;
  const storeKey = `onboard:${tourId}:state`;

  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  let currentIndex = 0;

  // Resume feature
  if (config.resume !== false) {
    try {
      const saved = localStorage.getItem(storeKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.index === "number") {
          currentIndex = parsed.index;
        }
      }
    } catch {}
  }

  function saveState() {
    if (config.resume === false) return;
    localStorage.setItem(storeKey, JSON.stringify({ index: currentIndex }));
  }

  function fire(event: string, extra?: any) {
    const payload = {
      tourId,
      stepId: config.steps[currentIndex]?.id,
      event,
      timestamp: new Date().toISOString(),
      extra: extra || {},
    };

    try {
      config.onEvent?.(payload);
    } catch {}

    console.log("Onboard event:", payload);
  }

  function render() {
    if (!container) {
      container = document.createElement("div");
      container.id = `onboard-widget-${tourId}`;
      document.body.appendChild(container);
      root = createRoot(container);
    }

    root!.render(
      <OnboardingWidget 
      startIndex={currentIndex} 
      fireEvent={fire} 
      onChange={(i) => {
          currentIndex = i;
          saveState();
        }} 
      onEnd={() => destroy()}/>
    );
  }

  function start() {
    fire("start");
    render();
  }

  function goTo(stepIdOrIndex: number | string) {
    if (typeof stepIdOrIndex === "number") {
      currentIndex = stepIdOrIndex;
    } else {
      const idx = config.steps.findIndex((s) => s.id === stepIdOrIndex);
      if (idx >= 0) currentIndex = idx;
    }
    render();
  }

  function destroy() {
    fire("end");
    localStorage.removeItem(storeKey);

    if (root) {
      root.unmount();
      root = null;
    }
    if (container) {
      container.remove();
      container = null;
    }
  }

  return { start, goTo, destroy, config };
}
