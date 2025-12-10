import { AnimatePresence, motion } from "framer-motion";
import { defaultTooltipStyles } from "./constant";
import type { Step, TooltipStyles } from "./types";

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
  const mergedStyles = {
    tooltip: { ...defaultTooltipStyles.tooltip, ...styles?.tooltip },
    controls: { ...defaultTooltipStyles.controls, ...styles?.controls },
    button: { ...defaultTooltipStyles.button, ...styles?.button },
    progress: { ...defaultTooltipStyles.progress, ...styles?.progress },
  };

    let targetRect: DOMRect | null = null;
    let tooltipPosition: React.CSSProperties = {};

if (step.target) {
  const el = document.querySelector(step.target) as HTMLElement;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    targetRect = el.getBoundingClientRect();
    el.style.position = "relative";
      el.style.zIndex = "1001";
      el.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.9)"; 
      el.style.borderRadius = "8px";

    tooltipPosition = {
      position: "sticky",
      left: `${targetRect.left + targetRect.width / 2}px`,
      top: `${targetRect.bottom + 12 + window.scrollY}px`, 
      transform: "translateX(-50%)", 
    };
  }
}

    return (
        <AnimatePresence mode="wait">
        <>
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
                zIndex: 9998,
            }}
            />

            {/* Tooltip */}
            <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="onboard-tooltip tooltip show"
            style={{
                ...mergedStyles.tooltip,
                zIndex: 9999, // tooltip above overlay
                ...(targetRect
                ? {
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    top: `${targetRect.bottom + 10 + window.scrollY}px`,
                    transform: "translateX(-50%)",
                    }
                : {}),
            }}
            >
            {step.title && <h4 style={{ marginBottom: 8 , fontWeight: 800}}>{step.title}</h4>}
            <div className="content">{step.content}</div>

            <div style={mergedStyles.progress} className="progress">
                Step {index + 1} of {total}
            </div>

            <div style={mergedStyles.controls} className="controls">
                <button style={mergedStyles.button} onClick={onBack}>Back</button>
                <button style={mergedStyles.button} onClick={onNext}>
                {index + 1 === total ? "Finish" : "Next"}
                </button>
                <button style={mergedStyles.button} onClick={onSkip}>Skip</button>
            </div>
            </motion.div>
        </>
        </AnimatePresence>
    );
    };
