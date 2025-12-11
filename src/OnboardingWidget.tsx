import { useState, useEffect } from "react";
import { Tooltip } from "./tooltip";
import type { Step, TooltipStyles } from "./types";

interface Props {
  startIndex: number;
  fireEvent: (event: string) => void;
  onChange: (index: number) => void;
  onEnd: () => void;
  steps: Step[]
  styles?:  TooltipStyles 
  // onSkip: (i: number) => void
}

export default function OnboardingWidget({
steps,
  startIndex,
  fireEvent,
  onChange,
  onEnd,
  // onSkip
  styles
}: Props) {
  const [step, setStep] = useState(startIndex);

  useEffect(() => {
    onChange(step);
  }, [step]);

  const current = steps[step];

  if (!current) {
    onEnd();
    return null;
  }

  return (
    <Tooltip
      step={current}
      index={step}
      total={steps.length}
      onNext={() => {
        fireEvent("step_completed");
        if (step + 1 >= steps.length) return onEnd();
        setStep(step + 1);
      }}
      onBack={() => {
        if (step > 0) setStep(step - 1);
      }}
      onSkip={() => {
        fireEvent("skipped");
        onEnd();
      }}
      styles={styles}
    />
  );
}
