// make flexible to accept custom styles later
export const Tooltip = ({
    step, 
    index, 
    total,
    onNext,
    onBack,
    onSkip,
}: {
        step: any, 
        index: number, 
        total: number,
        onNext: () => void,
        onBack: () => void,
        onSkip: () => void
    }) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .tooltip {
              position: fixed;
              z-index: 2147483647;
              left: 50%;
              top: 20%;
              transform: translateX(-50%) translateY(0);
              max-width: 320px;
              padding: 10px;
              box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
              background: white;
              border-radius: 10px;
              opacity: 0;
              transition: opacity 0.22s ease, transform 0.22s ease;
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            }
            .tooltip.show {
              opacity: 1;
            }
            .tooltip .controls {
              display: flex;
              gap: 8px;
              justify-content: flex-end;
              margin-top: 10px;
            }
            .tooltip .controls button {
              padding: 6px 10px;
              border-radius: 6px;
              border: 1px solid #ddd;
              background: #fff;
              cursor: pointer;
            }
            .tooltip .progress {
              font-size: 12px;
              color: #666;
              margin-top: 8px;
              text-align: right;
            }
            @media (prefers-reduced-motion: reduce) {
              .tooltip {
                transition: none;
              }
            }
          `,
        }}
      />
    
    <div className="tooltip-inner tooltip show">
      <div className="content">{step.content}</div>
      <div className="progress">Step {index+1} of {total}</div>
      <div className="controls">
        <button id="onback" onClick={onBack} aria-label="Back">Back</button>
        <button id="onnext" onClick={onNext} aria-label="Next">{index+1===total ? "Finish" : "Next"}</button>
        <button id="onskip" onClick={onSkip} aria-label="Skip">Skip</button>
      </div>
    </div>
    </>
  )
}

