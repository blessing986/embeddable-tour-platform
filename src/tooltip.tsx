import { defaultTooltipStyles } from "./constant";
import type { TooltipStyles } from "./types";

export const Tooltip = ({
    step, 
    index, 
    total,
    onNext,
    onBack,
    onSkip,
    styles
}: {
        step: any, 
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

  return (
    <>
    <div style={mergedStyles.tooltip} className="tooltip show">
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

