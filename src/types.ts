    export type Step = {
    id: string;
    target?: string;
    content: string;
    position?: "top"|"bottom"|"left"|"right"|"center";
    };

    export type OnboardConfig = {
    steps: Step[];
    tourId?: string;
    resume?: boolean;
    onEvent?: (evt: any) => void;
    analyticsEndpoint?: string;
    theme?: { primary?: string };
    };
