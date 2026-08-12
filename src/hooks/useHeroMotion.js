import { useEffect, useRef } from 'react';

export function useHeroMotion() {
  const ref = useRef(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const writePosition = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      hero.style.setProperty('--panel-x', `${currentX * 0.35}px`);
      hero.style.setProperty('--panel-y', `${currentY * 0.25}px`);
      hero.style.setProperty('--note-one-x', `${currentX * 0.8}px`);
      hero.style.setProperty('--note-one-y', `${currentY * 0.65}px`);
      hero.style.setProperty('--note-two-x', `${currentX * -0.55}px`);
      hero.style.setProperty('--note-two-y', `${currentY * -0.45}px`);
      hero.style.setProperty('--ambient-x', `${currentX * 0.25}px`);
      hero.style.setProperty('--ambient-y', `${currentY * 0.2}px`);
      hero.style.setProperty('--promo-x', `${currentX * 0.5}px`);
      hero.style.setProperty('--promo-y', `${currentY * 0.42}px`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = window.requestAnimationFrame(writePosition);
      } else {
        frame = 0;
      }
    };

    const requestPosition = () => {
      if (!frame) frame = window.requestAnimationFrame(writePosition);
    };

    const onPointerMove = (event) => {
      targetX = ((event.clientX / window.innerWidth) - 0.5) * 24;
      targetY = ((event.clientY / window.innerHeight) - 0.5) * 20;
      requestPosition();
    };

    const resetPosition = () => {
      targetX = 0;
      targetY = 0;
      requestPosition();
    };

    const onScroll = () => hero.classList.toggle('is-scrolled', window.scrollY > Math.min(hero.offsetHeight * 0.28, 220));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (finePointer && !reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', resetPosition);
      window.addEventListener('blur', resetPosition);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', resetPosition);
      window.removeEventListener('blur', resetPosition);
    };
  }, []);

  return ref;
}
