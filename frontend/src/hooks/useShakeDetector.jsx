import { useEffect, useRef } from "react";

// Calls onShake when the phone is shaken hard 3 times quickly.
export default function useShakeDetector(onShake, enabled) {
  const cb = useRef(onShake);
  cb.current = onShake;

  useEffect(() => {
    if (!enabled) return;
    let count = 0, last = 0, first = 0;
    const handler = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const force = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
      const now = Date.now();
      if (force > 35 && now - last > 200) {
        if (now - first > 2000) { count = 0; first = now; }
        count++; last = now;
        if (count >= 3) { count = 0; cb.current(); }
      }
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [enabled]);
}
