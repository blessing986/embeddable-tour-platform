declare global {interface Window {
    initOnboard?: (cfg: OnboardConfig) => ReturnType<typeof createWidget> | null;
    OnboardWidget: ReturnType<typeof createWidget> | null;
  }
}

export {};
