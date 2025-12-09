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

  //  position logic (basic): if target exists, try to scroll into view and anchor tooltip near center
  
    let targetRect = null;
    if (step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        targetRect = el.getBoundingClientRect();
        console.log(targetRect, step.target);
      }
    }

    

  return (
    <>
     <style
        dangerouslySetInnerHTML={{
          __html: `
            .onboard-tooltip {
              opacity: 0;
              transform: translate(-50%, 20px) scale(0.95);
              transition:
                left 0.35s ease,
                top 0.35s ease;
              animation: onboardFadeIn 0.35s ease forwards;
            }

            @keyframes onboardFadeIn {
              0% {
                opacity: 0;
                transform: translate(-50%, 20px) scale(0.9);
              }
              60% {
                opacity: 1;
                transform: translate(-50%, -4px) scale(1.05);
              }
              100% {
                opacity: 1;
                transform: translate(-50%, 0) scale(1);
              }
            }
          `
        }}
      ></style>

    <div className="onboard-tooltip tooltip show" style={{
      ...mergedStyles.tooltip, 
      ...(targetRect
      ? {
          left: `${targetRect.left + targetRect.width / 2}px`,
          top: `${targetRect.bottom + 10 + window.scrollY}px`,
          transform: 'translateX(-50%)',
          animation: 'onboardFadeIn 0.35s ease forwards'
        }
      : {}),}}>
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
    </div>
    </>
  )
}

