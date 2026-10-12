// Anti-Tamper & DevTools Protection for Aptiverse
// Prevents students from opening Inspect Element, Console, View Source, and executing browser scripts

export const initAntiTamperProtection = () => {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Block Context Menu (Right Click Inspect)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Block DevTools Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // F12 key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    // Ctrl+Shift+I / Cmd+Opt+I (DevTools Elements/Inspect)
    // Ctrl+Shift+J / Cmd+Opt+J (DevTools Console)
    // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element cursor)
    // Ctrl+Shift+K (Firefox console)
    if (isCtrlOrCmd && e.shiftKey) {
      const key = e.key.toUpperCase();
      if (['I', 'J', 'C', 'K'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl+U / Cmd+U (View Page Source)
    if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. Clear Console periodically
  setInterval(() => {
    try {
      console.clear();
    } catch {}
  }, 2000);

  // 4. DevTools Trap (Freezes debugger if DevTools is opened)
  const devToolsTrap = () => {
    try {
      const start = performance.now();
      // Dynamically invokes debugger statement
      Function('debugger')();
      const diff = performance.now() - start;
      if (diff > 100) {
        // DevTools was opened and hit debugger
        try {
          console.clear();
        } catch {}
      }
    } catch {}
  };

  setInterval(devToolsTrap, 1000);

  // 5. Suppress console output in production
  if (import.meta.env.PROD) {
    const noop = () => {};
    try {
      window.console.log = noop;
      window.console.info = noop;
      window.console.debug = noop;
      window.console.dir = noop;
    } catch {}
  }
};
