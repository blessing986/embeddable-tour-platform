import { createRoot, type Root } from "react-dom/client";
import OnboardingWidget from "./OnboardingWidget";
import { fetchTour, updateTour } from "./api";
import type { initOnboard, Tour } from "./types";

export function createWidget(config: initOnboard) {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;
  let steps: Tour['steps'] = [];
  let currentIndex = 0;
  const storeKey = `onboard:${config.tourId}${config.userId}:state`;

  async function start() {
    if (!config.tourId || !config.userId) {
      console.error("tourId and userId are required");
      return;
    }

    const tour = await fetchTour({ tourId: config.tourId, userId: config.userId });
    if (!tour) return;
    steps = tour.steps;

    if (config.resume !== false) {
      try {
        const saved = localStorage.getItem(storeKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.index === "number") currentIndex = parsed.index;
        }
      } catch {}
    }

    render();
    fire("start");
  }

  function render() {
    if (!container) {
      container = document.createElement("div");
      container.id = `onboard-widget-${config.tourId}`;
      document.body.appendChild(container);
      root = createRoot(container);
    }

    root?.render(
      <OnboardingWidget
        steps={steps}
        startIndex={currentIndex}
        fireEvent={fire}
        onChange={(i) => { currentIndex = i; saveState(); }}
        onEnd={destroy}
        styles={config.styles}
      />
    );
  }

  function goTo(stepIdOrIndex: number | string) {
    if (typeof stepIdOrIndex === "number") currentIndex = stepIdOrIndex;
    else {
      const idx = steps.findIndex(s => s.id === stepIdOrIndex);
      if (idx >= 0) currentIndex = idx;
    }
    render();
  }

  function destroy() {
    fire("end");
    localStorage.removeItem(storeKey);
    if (root) { root.unmount(); root = null; }
    if (container) { container.remove(); container = null; }
  }

  function saveState() {
    if (config.resume === false) return;
    localStorage.setItem(storeKey, JSON.stringify({ index: currentIndex }));
  }

  function fire(event: string, extra?: any) {
    const payload = {
      tourId: config.tourId,
      stepId: steps[currentIndex]?.id,
      event,
      timestamp: new Date().toISOString(),
      extra: extra || {},
    };
    config.onEvent?.(payload);
    console.log("Onboard event:", payload);

     const updatedSteps = steps.map((step, idx) => 
    idx === currentIndex ? { ...step, step_viewed: (step.step_viewed || 0) + 1 } : step
  );
  console.log(updatedSteps, 'updatedSteps');
  
      try {
        const res = updateTour({steps: updatedSteps, tourId: config.tourId || 0, key: config.userId});
        console.log('triggered', res);
        
      } catch(error) {
        console.log(error);
        
      }
  }

  return { start, goTo, destroy, config };
}
