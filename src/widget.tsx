import { createRoot, type Root } from "react-dom/client";
import type { initOnboard } from "./types";
import OnboardingWidget from "./OnboardingWidget";

export function createWidget(config: initOnboard) {

   // call the fxn to fetch from BE here
  const tourId = config.tourId;
  const userId  = config.userId
  const storeKey = `onboard:${tourId}${userId}:state`;
  const steps = [ //from Server
        { id: 's1', target: '#logo', content: 'Welcome to the site!' },
        { id: 's2', content: 'We will show you around.', target: '#startDemo' },
        { id: 's3', content: 'You can skip anytime.', target: '#pickMe' },
        { id: 's4', content: 'Resume is supported.',target: '#logo', },
        { id: 's5', content: 'Done — thanks!' }
    ];
  const customStyles = config.styles

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

// save state
  function saveState() {
    if (config.resume === false) return;
    localStorage.setItem(storeKey, JSON.stringify({ index: currentIndex }));
  }

  // action
  function fire(event: string, extra?: any) {
    const payload = {
      tourId,
      stepId: steps[currentIndex]?.id,
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
      steps={steps}
      startIndex={currentIndex} 
      fireEvent={fire} 
      onChange={(i) => {
          currentIndex = i;
          saveState();
        }} 
      onEnd={() => destroy()}
      styles={customStyles}
      />
    );
  }

// start tour
  function start() {
    fire("start");
    render();
  }

// move to specific step
  function goTo(stepIdOrIndex: number | string) {
    if (typeof stepIdOrIndex === "number") {
      currentIndex = stepIdOrIndex;
    } else {
      const idx = steps.findIndex((s) => s.id === stepIdOrIndex);
      if (idx >= 0) currentIndex = idx;
    }
    render();
  }

// end tour
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
