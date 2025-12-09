import { AnimatePresence, motion } from "framer-motion"; // make sure it's framer-motion
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
        step: Step, 
        index: number, 
        total: number,
        onNext: () => void,
        onBack: () => void,
        onSkip: () => void
        styles?: TooltipStyles; 
    }) => {

    const mergedStyles = {
        tooltip: { ...defaultTooltipStyles.tooltip, ...styles?.tooltip },
        controls: { ...defaultTooltipStyles.controls, ...styles?.controls },
        button: { ...defaultTooltipStyles.button, ...styles?.button },
        progress: { ...defaultTooltipStyles.progress, ...styles?.progress },
    };

    // position logic
    let targetRect: DOMRect | null = null;
    if (step.target) {
        const el = document.querySelector(step.target);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            targetRect = el.getBoundingClientRect();
        }
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.01 }}
                className="onboard-tooltip tooltip show"
                style={{
                    ...mergedStyles.tooltip,
                    ...(targetRect
                        ? {
                            left: `${targetRect.left + targetRect.width / 2}px`,
                            top: `${targetRect.bottom + 10 + window.scrollY}px`,
                            transform: 'translateX(-50%)',
                        }
                        : {}
                    ),
                }}
            >
                {step.title && <h4 style={{ marginBottom: 8 }}>{step.title}</h4>}
                <div className="content">{step.content}</div>
                <div style={mergedStyles.progress} className="progress">
                    Step {index + 1} of {total}
                </div>
                <div style={mergedStyles.controls} className="controls">
                    <button style={mergedStyles.button} onClick={onBack} aria-label="Back">
                        Back
                    </button>
                    <button style={mergedStyles.button} onClick={onNext} aria-label="Next">
                        {index + 1 === total ? 'Finish' : 'Next'}
                    </button>
                    <button style={mergedStyles.button} onClick={onSkip} aria-label="Skip">
                        Skip
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
