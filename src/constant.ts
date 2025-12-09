import type { TooltipStyles } from "./types";

export const defaultTooltipStyles = {
  tooltip: {
    position: 'fixed',
    zIndex: 2147483647,
    left: '50%',
    top: '20%',
    // transform: 'translateX(-50%) translateY(0)',
    maxWidth: '320px',
    padding: '12px 16px',
    borderRadius: '12px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    background: '#333',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    transition:
      'opacity 0.5s ease, transform 0.5s ease, left 0.5s ease, top 0.5s ease',
    transform: 'translateX(-50%) translateY(10px)'

  },
  controls: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  button: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    background: '#fff',  
    color: '#333',
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
  },
  progress: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#ccc',
    marginTop: '8px',
    textAlign: 'right',
  },
} as TooltipStyles;
