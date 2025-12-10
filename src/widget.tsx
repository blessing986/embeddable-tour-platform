// import { createRoot, type Root } from "react-dom/client";
// import OnboardingWidget from "./OnboardingWidget";
// import { fetchTour, updateTour } from "./api";
// import type { initOnboard, Tour } from "./types";

// export function createWidget(config: initOnboard) {
//   let root: Root | null = null;
//   let container: HTMLDivElement | null = null;
//   let steps: Tour['steps'] = [];
//   let currentIndex = 0;
//   const storeKey = `onboard:${config.tourId}${config.secret_key}:state`;

//   async function start() {
//     if (!config.tourId || !config.secret_key) {
//       console.error("tourId and userId are required");
//       return;
//     }

//     const tour = await fetchTour({ tourId: config.tourId, userId: config.secret_key });
//     if (!tour) return;
//     steps = tour.steps;

//     if (config.resume !== false) {
//       try {
//         const saved = localStorage.getItem(storeKey);
//         if (saved) {
//           const parsed = JSON.parse(saved);
//           if (typeof parsed.index === "number") currentIndex = parsed.index;
//         }
//       } catch {}
//     }

//     render();
//     fire("start");
//   }

//   function render() {
//     if (!container) {
//       container = document.createElement("div");
//       container.id = `onboard-widget-${config.tourId}`;
//       document.body.appendChild(container);
//       root = createRoot(container);
//     }

//     const onChange = async (i: number) => {
//       currentIndex = i;
//       saveState();

//     steps = steps.map((step, idx) =>
//     idx === currentIndex ? { ...step, step_viewed: (step.step_viewed) + 1 } : step
//   );
  
//       try {
//         const res = await updateTour({steps, tourId: config.tourId, key: config.secret_key});
//         console.log('triggered', res);
//         steps = res || steps;
        
//       } catch(error) {
//         console.log(error);
//       }
//     }

//     root?.render(
//       <OnboardingWidget
//         steps={steps}
//         startIndex={currentIndex}
//         fireEvent={fire}
//         onChange={onChange}
//         onEnd={destroy}
//         styles={config.styles}
//       />
//     );
//   }

//   function goTo(stepIdOrIndex: number | string) {
//     if (typeof stepIdOrIndex === "number") currentIndex = stepIdOrIndex;
//     else {
//       const idx = steps.findIndex(s => s.id === stepIdOrIndex);
//       if (idx >= 0) currentIndex = idx;
//     }
//     render();
//   }

//   function destroy() {
//     fire("end");
//     localStorage.removeItem(storeKey);
//     if (root) { root.unmount(); root = null; }
//     if (container) { container.remove(); container = null; }
//   }

//   function saveState() {
//     if (config.resume === false) return;
//     localStorage.setItem(storeKey, JSON.stringify({ index: currentIndex }));
//   }

//   function fire(event: string, extra?: any) {
//     const payload = {
//       tourId: config.tourId,
//       stepId: steps[currentIndex]?.id,
//       event,
//       timestamp: new Date().toISOString(),
//       extra: extra || {},
//     };
//     config.onEvent?.(payload);
//   }

//   return { start, goTo, destroy, config };
// }


import { createRoot, type Root } from "react-dom/client";
import OnboardingWidget from "./OnboardingWidget";
import { fetchTour, updateTour } from "./api";
import type { initOnboard, Tour } from "./types";

export function createWidget(config: initOnboard) {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  let steps: Tour["steps"] = [];
  let currentIndex = 0;

  // :white_check_mark: Per-user local session tracking
  const storeKey = `onboard:${config.tourId}:${config.secret_key}:state`;
  const viewedSteps = new Set<string>(); // prevents double counting

  async function start() {
    if (!config.tourId || !config.secret_key || !config.secret_key) {
      console.error("tourId, user_id and secret_key are required");
      return;
    }

    const tour = await fetchTour({
      tourId: config.tourId,
      userId: config.secret_key,
    });

    if (!tour) return;
    steps = tour.steps || [];

    // :white_check_mark: Restore progress
    if (config.resume !== false) {
      try {
        const saved = localStorage.getItem(storeKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.index === "number") currentIndex = parsed.index;
          if (Array.isArray(parsed.viewed))
            parsed.viewed.forEach((id: string) => viewedSteps.add(id));
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
        onChange={onChange}
        onSkip={onSkip}
        onEnd={destroy}
        styles={config.styles}
      />
    );
  }

  // :white_check_mark: Handles both NEXT and NORMAL STEP CHANGES
  async function onChange(i: number) {
    if (i === currentIndex) return;

    currentIndex = i;
    saveState();

    await updateViewedSteps(i);
  }

  // :white_check_mark: Handles SKIP: updates ALL steps till this point & ends session
  async function onSkip(i: number) {
    currentIndex = i;

    await updateViewedSteps(i, true);

    fire("skip");
    destroy(); // :white_check_mark: Skip ends tour
  }

  // :white_check_mark: CORE STEP UPDATE LOGIC
  async function updateViewedSteps(index: number, isSkip = false) {
    const updatedSteps = steps.map((step, idx) => {
      const shouldCount = isSkip ? idx <= index : idx === index;

      if (!shouldCount) return step;
      if (viewedSteps.has(step.id)) return step;

      viewedSteps.add(step.id);

      return {
        ...step,
        step_viewed: (step.step_viewed || 0) + 1,
      };
    });

    steps = updatedSteps;
    saveState();

    try {
      const res = await updateTour({
        steps: updatedSteps,
        tourId: config.tourId,
        key: config.secret_key,
      });

      if (res) steps = res;
    } catch (error) {
      console.error("Failed updating steps:", error);
    }
  }

  function goTo(stepIdOrIndex: number | string) {
    if (typeof stepIdOrIndex === "number") currentIndex = stepIdOrIndex;
    else {
      const idx = steps.findIndex((s) => s.id === stepIdOrIndex);
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

  function saveState() {
    if (config.resume === false) return;

    localStorage.setItem(
      storeKey,
      JSON.stringify({
        index: currentIndex,
        viewed: Array.from(viewedSteps),
      })
    );
  }

  function fire(event: string, extra?: any) {
    const payload = {
      tourId: config.tourId,
      stepId: steps[currentIndex]?.id,
      event,
      user_id: config.secret_key,
      timestamp: new Date().toISOString(),
      extra: extra || {},
    };

    config.onEvent?.(payload);
  }

  return { start, goTo, destroy, config };
}