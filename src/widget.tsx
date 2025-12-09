// import { createRoot, type Root } from "react-dom/client";
// import { type Tour, type initOnboard } from "./types";
// import OnboardingWidget from "./OnboardingWidget";
// import { fetchTour } from "./api";
// import { useState } from "react";

import { createRoot, type Root } from "react-dom/client";
import OnboardingWidget from "./OnboardingWidget";
import { fetchTour } from "./api";
import type { initOnboard, Tour } from "./types";

// export function createWidget(config: initOnboard) {

//   const [tour, setTour] = useState<Tour>();
//   const tourId = config.tourId;
//   const userId  = config.userId
//   const storeKey = `onboard:${tourId}${userId}:state`;
//   const customStyles = config.styles

//   const fetchTourApi = async ()=>{
//     if (!config.tourId || !config.userId) {
//     console.error("tourId and userId are required");
//     return null;
//   }

//   const data = await fetchTour({ tourId: 1, userId: '56462647-1e02-454e-8927-40d45ceda06a' });
//   if (!data) {
//     console.error("Tour not found or failed to fetch");
//     return null;
//   }
//   setTour(data)
//   return data
//   }
  
//   fetchTourApi();

//   const steps = tour?.steps || []
//   let root: Root | null = null;
//   let container: HTMLDivElement | null = null;

//   let currentIndex = 0;

//   // Resume feature
//   if (config.resume !== false) {
//     try {
//       const saved = localStorage.getItem(storeKey);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (typeof parsed.index === "number") {
//           currentIndex = parsed.index;
//         }
//       }
//     } catch {}
//   }

// // save state
//   function saveState() {
//     if (config.resume === false) return;
//     localStorage.setItem(storeKey, JSON.stringify({ index: currentIndex }));
//   }

//   // action
//   function fire(event: string, extra?: any) {
//     const payload = {
//       tourId,
//       stepId: steps[currentIndex]?.id,
//       event,
//       timestamp: new Date().toISOString(),
//       extra: extra || {},
//     };

//     try {
//       config.onEvent?.(payload);
//     } catch {}

//     console.log("Onboard event:", payload);
//   }

//   function render() {
//     if (!container) {
//       container = document.createElement("div");
//       container.id = `onboard-widget-${tourId}`;
//       document.body.appendChild(container);
//       root = createRoot(container);
//     }

//     root!.render(
//       <OnboardingWidget 
//       steps={steps}
//       startIndex={currentIndex} 
//       fireEvent={fire} 
//       onChange={(i) => {
//           currentIndex = i;
//           saveState();
//         }} 
//       onEnd={() => destroy()}
//       styles={customStyles}
//       />
//     );
//   }

// // start tour
//   function start() {
//     fire("start");
//     render();
//   }

// // move to specific step
//   function goTo(stepIdOrIndex: number | string) {
//     if (typeof stepIdOrIndex === "number") {
//       currentIndex = stepIdOrIndex;
//     } else {
//       const idx = steps.findIndex((s) => s.id === stepIdOrIndex);
//       if (idx >= 0) currentIndex = idx;
//     }
//     render();
//   }

// // end tour
//   function destroy() {
//     fire("end");
//     localStorage.removeItem(storeKey);

//     if (root) {
//       root.unmount();
//       root = null;
//     }
//     if (container) {
//       container.remove();
//       container = null;
//     }
//   }

//   return { start, goTo, destroy, config };
// }


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

    // fetch the tour data once
    const tour = await fetchTour({ tourId: config.tourId, userId: config.userId });
    if (!tour) return;
    steps = tour.steps;

    // restore previous index if resume is enabled
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
  }

  return { start, goTo, destroy, config };
}
