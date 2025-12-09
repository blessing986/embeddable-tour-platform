// import { useState } from "react"
// import { Tooltip } from "../components/Tooltip"

const steps = [
        { id: 's1', target: '#logo', content: 'Welcome to the site!' },
        { id: 's2', content: 'We will show you around.', target: '#startDemo' },
        { id: 's3', content: 'You can skip anytime.', target: '#pickMe' },
        { id: 's4', content: 'Resume is supported.',target: '#logo', },
        { id: 's5', content: 'Done — thanks!' }
    ];

//     // fetch this from the api

// function OnboardingWidget() {
//     const [step, setStep] = useState(0)
//     console.log(step);
    
//   return (
//         <Tooltip 
//         step={{content: steps[step].content}} 
//         index={step} 
//         total={steps.length}
//         onNext={() => setStep(step + 1)}
//         onBack={() => setStep(step - 1)}
//         onSkip={() => setStep(steps.length - 1)}
//         />
//   )
// }

// export default OnboardingWidget

import { useState, useEffect } from "react";
import { Tooltip } from "./tooltip";

interface Props {
  startIndex: number;
  fireEvent: (event: string) => void;
  onChange: (index: number) => void;
  onEnd: () => void;
}

export default function OnboardingWidget({
  startIndex,
  fireEvent,
  onChange,
  onEnd,
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
      step={{ content: current.content }}
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
        setStep(steps.length - 1);
      }}
    />
  );
}
