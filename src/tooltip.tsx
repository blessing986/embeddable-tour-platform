// import { AnimatePresence, motion } from "framer-motion";
// import { defaultTooltipStyles } from "./constant";
// import type { Step, TooltipStyles } from "./types";

// export const Tooltip = ({
//   step,
//   index,
//   total,
//   onNext,
//   onBack,
//   onSkip,
//   styles
// }: {
//   step: Step;
//   index: number;
//   total: number;
//   onNext: () => void;
//   onBack: () => void;
//   onSkip: () => void;
//   styles?: TooltipStyles;
// }) => {
//   const mergedStyles = {
//     tooltip: { ...defaultTooltipStyles.tooltip, ...styles?.tooltip },
//     controls: { ...defaultTooltipStyles.controls, ...styles?.controls },
//     button: { ...defaultTooltipStyles.button, ...styles?.button },
//     progress: { ...defaultTooltipStyles.progress, ...styles?.progress },
//   };

//     let targetRect: DOMRect | null = null;
//     let tooltipPosition: React.CSSProperties = {};

// if (step.target) {
//   const el = document.querySelector(step.target);
//   if (el) {
//     el.scrollIntoView({ behavior: "smooth", block: "center" });
//     targetRect = el.getBoundingClientRect();

//     tooltipPosition = {
//       position: "absolute",
//       left: `${targetRect.left + targetRect.width / 2}px`,
//       top: `${targetRect.bottom + 12 + window.scrollY}px`, 
//       transform: "translateX(-50%)", 
//     };
//   }
// }

//     return (
//         <AnimatePresence mode="wait">
//         <>
//             <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             style={{
//                 position: "fixed",
//                 left: 0,
//                 top: 0,
//                 width: "100vw",
//                 height: "100vh",
//                 background: "rgba(0,0,0,0.8)",
//                 zIndex: 9998,
//             }}
//             />

//             {/* Tooltip */}
//             <motion.div
//             key={step.id}
//             initial={{ opacity: 0, y: 20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//             className="onboard-tooltip tooltip show"
//             style={{
//                 ...mergedStyles.tooltip,
//                 zIndex: 9999, // tooltip above overlay
//                 ...(targetRect
//                 ? {
//                     left: `${targetRect.left + targetRect.width / 2}px`,
//                     top: `${targetRect.bottom + 10 + window.scrollY}px`,
//                     transform: "translateX(-50%)",
//                     }
//                 : {}),
//             }}
//             >
//             {step.title && <h4 style={{ marginBottom: 8 , fontWeight: 800}}>{step.title}</h4>}
//             <div className="content">{step.content}</div>

//             <div style={mergedStyles.progress} className="progress">
//                 Step {index + 1} of {total}
//             </div>

//             <div style={mergedStyles.controls} className="controls">
//                 <button style={mergedStyles.button} onClick={onBack}>Back</button>
//                 <button style={mergedStyles.button} onClick={onNext}>
//                 {index + 1 === total ? "Finish" : "Next"}
//                 </button>
//                 <button style={mergedStyles.button} onClick={onSkip}>Skip</button>
//             </div>
//             </motion.div>
//         </>
//         </AnimatePresence>
//     );
//     };

import { AnimatePresence, motion } from "framer-motion";
import { defaultTooltipStyles } from "./constant";
import type { Step, TooltipStyles } from "./types";
import { useEffect, useRef } from "react";

export const Tooltip = ({
  step,
  index,
  total,
  onNext,
  onBack,
  onSkip,
  styles
}: {
  step: Step;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  styles?: TooltipStyles;
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const prevTargetRef = useRef<HTMLElement | null>(null);

  const mergedStyles = {
    tooltip: { ...defaultTooltipStyles.tooltip, ...styles?.tooltip },
    controls: { ...defaultTooltipStyles.controls, ...styles?.controls },
    button: { ...defaultTooltipStyles.button, ...styles?.button },
    progress: { ...defaultTooltipStyles.progress, ...styles?.progress },
  };

  const updatePosition = () => {
    const el = document.querySelector(step.target!) as HTMLElement | null;
    const tooltipEl = tooltipRef.current;
    if (!el || !tooltipEl) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // remove highlight from previous target
    if (prevTargetRef.current && prevTargetRef.current !== el) {
      prevTargetRef.current.style.position = "";
      prevTargetRef.current.style.zIndex = "";
      prevTargetRef.current.style.boxShadow = "";
      prevTargetRef.current.style.borderRadius = "";
    }

    // highlight current target
    el.style.position = "relative";
    el.style.zIndex = "1002";
    el.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.9)";
    el.style.borderRadius = "8px";

    prevTargetRef.current = el;

    // position tooltip
    const rect = el.getBoundingClientRect();
    tooltipEl.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    tooltipEl.style.top = `${rect.bottom + 12 + window.scrollY}px`;
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    // cleanup fxn
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);

      if (prevTargetRef.current) {
        prevTargetRef.current.style.position = "";
        prevTargetRef.current.style.zIndex = "";
        prevTargetRef.current.style.boxShadow = "";
        prevTargetRef.current.style.borderRadius = "";
        prevTargetRef.current = null;
      }
    };
  }, [step.target]);

  return (
    <AnimatePresence mode="wait">
      <>
        {/* dark overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 1001,
          }}
        />
          <button
          onClick={onSkip}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 10,
            transition: "transform 0.15s ease",
          }}
        >
          x
        </button>
        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="onboard-tooltip tooltip show"
          style={{
            ...mergedStyles.tooltip,
            position: "absolute",
            transform: "translateX(-50%)",
            zIndex: 2002,
          }}
        >
          {step.title && (
            <h4 style={{ marginBottom: 8, fontWeight: 800 }}>{step.title}</h4>
          )}
          <div className="content">{step.content}</div>

          <div style={mergedStyles.progress} className="progress">
            Step {index + 1} of {total}
          </div>

          <div style={mergedStyles.controls} className="controls">
            <button style={mergedStyles.button} onClick={onBack}>
              Back
            </button>
            <button style={mergedStyles.button} onClick={onNext}>
              {index + 1 === total ? "Finish" : "Next"}
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};
