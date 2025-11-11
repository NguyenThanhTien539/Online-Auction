import { useEffect } from "react";

export function usePreventBodyLock() {
  useEffect(() => {
    const fixBody = () => {
      ['data-scroll-locked', 'data-radix-scroll-lock', 'data-radix-lock-scroll', 'data-modal-open']
        .forEach(attr => {
          if (document.body.hasAttribute(attr)) {
            document.body.removeAttribute(attr);
          }
        });

      // Reset
      if (document.body.style.pointerEvents) {
        document.body.style.pointerEvents = '';
      }
      if (document.body.style.paddingRight) {
        document.body.style.paddingRight = '';
      }
      if (document.documentElement.style.overflow) {
        document.documentElement.style.overflow = '';
      }

      // Ensure scrollbar gutter is stable
      document.documentElement.style.scrollbarGutter = 'stable';
    };

    
    fixBody();

    // Observe changes to body and html attributes/styles
    const bodyObserver = new MutationObserver(() => fixBody());
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    const htmlObserver = new MutationObserver(() => fixBody());
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    // Cleanup on unmount
    return () => {
      bodyObserver.disconnect();
      htmlObserver.disconnect();
    };
  }, []);
}
