import { useEffect, useRef, useState } from 'react';

export function AnimatedStat({ value, suffix = '', label }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let started = false;

    const count = () => {
      if (started) return;
      started = true;
      if (reducedMotion) {
        setDisplayValue(value);
        return;
      }

      const start = performance.now();
      const duration = 1100;
      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - ((1 - progress) ** 3);
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(update);
      };
      frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        count();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return <div ref={ref}><strong>{String(displayValue).padStart(2, '0')}{suffix}</strong><span>{label}</span></div>;
}
