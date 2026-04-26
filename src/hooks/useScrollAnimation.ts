import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * useScrollProgress — returns a ref and a normalized 0→1 scroll progress
 * Attach the ref to the scroll container element.
 */
export function useScrollProgress(
  onUpdate: (progress: number) => void,
  options?: { start?: string; end?: string; scrub?: number }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: options?.start ?? 'top top',
      end: options?.end ?? 'bottom bottom',
      scrub: options?.scrub ?? 0.5,
      onUpdate: (self) => onUpdate(self.progress),
    });

    return () => trigger.kill();
  }, [onUpdate, options?.start, options?.end, options?.scrub]);

  return ref;
}

/**
 * useGsapTimeline — creates and returns a GSAP timeline
 * with automatic cleanup
 */
export function useGsapTimeline() {
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    return () => {
      tl.current?.kill();
    };
  }, []);

  return tl;
}
