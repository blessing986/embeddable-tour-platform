    export type Step = {
    id: string;
    title?: string;
    target?: string;
    content: string;
    position?: "top"|"bottom"|"left"|"right"|"center";
    };

    export type OnboardConfig = {
    steps: Step[];
    tourId?: number;
    secret_key: string;
    resume?: boolean;
    onEvent?: (evt: any) => void;
    analyticsEndpoint?: string;
    theme?: { primary?: string };
    };

    export type initOnboard = {
    tourId?: number;
    secret_key: string;
    resume?: boolean;
    onEvent?: (evt: any) => void;
    analyticsEndpoint?: string;
    theme?: { primary?: string };
    styles?: TooltipStyles 
    };

 export type TooltipStyles = {
  tooltip?: React.CSSProperties;
  controls?: React.CSSProperties;
  button?: React.CSSProperties;
  progress?: React.CSSProperties;
} & {
  [key: string]: React.CSSProperties | undefined;
};

export type Tour = {
  id: number;                 
  secret_key: string;           
  name: string;
  description: string;
  steps: Step[];       
  created_at: string; 
};
