import { createRoot, type Root } from "react-dom/client";
import OnboardingWidget from "./OnboardingWidget";
import { fetchTour, updateTour } from "./api";
import type { initOnboard, Tour } from "./types";

export function createWidget(config: initOnboard) {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;
  let steps: Tour['steps'] = [];
  let currentIndex = 0;
  const storeKey = `onboard:${config.tourId}${config.secret_key}:state`;

  async function start() {
    if (!config.tourId || !config.secret_key) {
      console.error("tourId and userId are required");
      return;
    }

    const tour = await fetchTour({ tourId: config.tourId, userId: config.secret_key });
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

    const onChange = async (i: number) => {
      currentIndex = i;
      saveState();

    const updatedSteps = steps.map((step, idx) => 
    idx === currentIndex ? { ...step, step_viewed: (step.step_viewed) + 1 } : step
  );
  
      try {
        const res = await updateTour({steps: updatedSteps, tourId: config.tourId, key: config.secret_key});
        console.log('triggered', res);
        
      } catch(error) {
        console.log(error);
        
      }
    }

    root?.render(
      <OnboardingWidget
        steps={steps}
        startIndex={currentIndex}
        fireEvent={fire}
        onChange={onChange}
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
  }

  return { start, goTo, destroy, config };
}
