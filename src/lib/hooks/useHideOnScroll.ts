import { useEffect, useRef, useState } from "react";

export default function useHideOnScroll({
  nearTopThreshold = 20,
  enabled = true,
}: { nearTopThreshold?: number; enabled?: boolean } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(() => {
          const delta = y - lastY.current;
          const nearTop = y <= nearTopThreshold;
          if (enabled) {
            const shouldHide = delta > 0 && !nearTop;
            const shouldShow = delta < 0 || nearTop;
            setHidden((prev) => (shouldHide ? true : shouldShow ? false : prev));
          } else {
            setHidden(false);
          }
          lastY.current = y;
          ticking.current = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nearTopThreshold, enabled]);

  return hidden;
}
