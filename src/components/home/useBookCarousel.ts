"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";

const PIXELS_PER_SECOND = 35;

export function useBookCarousel(bookCount: number) {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    const resize = () => setItemsPerPage(window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 2);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = () => {
      animationRef.current?.cancel();
      animationRef.current = null;
      if (bookCount <= 1) return;
      const first = track.firstElementChild as HTMLElement | null;
      if (!first) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = bookCount * (first.getBoundingClientRect().width + gap);
      if (!distance) return;
      const animation = track.animate([
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(-${distance}px, 0, 0)` },
      ], { duration: distance / PIXELS_PER_SECOND * 1000, iterations: Infinity, easing: "linear" });
      animationRef.current = animation;
      if (hoveredRef.current || focusedRef.current || reducedMotion.matches) animation.pause();
    };
    const observer = new ResizeObserver(start);
    observer.observe(track);
    reducedMotion.addEventListener("change", start);
    // Repeated covers remain clickable, with one keyboard stop per original action.
    track.querySelectorAll<HTMLElement>('[data-carousel-copy="true"] button, [data-carousel-copy="true"] a').forEach(element => { element.tabIndex = -1; });
    start();
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", start);
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [bookCount, itemsPerPage]);

  function syncPause() {
    const animation = animationRef.current;
    if (!animation) return;
    if (hoveredRef.current || focusedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) animation.pause();
    else animation.play();
  }
  function skip(direction: number) {
    const animation = animationRef.current;
    const track = trackRef.current;
    if (!animation || !track) return;
    const duration = Number(animation.effect?.getTiming().duration);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = (track.clientWidth + gap) / PIXELS_PER_SECOND * 1000;
    const nextTime = Number(animation.currentTime ?? 0) + direction * step;
    animation.currentTime = ((nextTime % duration) + duration) % duration;
  }

  return {
    trackRef,
    itemsPerPage,
    totalPages: Math.max(1, Math.ceil(bookCount / itemsPerPage)),
    handlePrev: () => skip(-1),
    handleNext: () => skip(1),
    interactionProps: {
      onMouseEnter: () => { hoveredRef.current = true; syncPause(); },
      onMouseLeave: () => { hoveredRef.current = false; syncPause(); },
      onFocusCapture: () => { focusedRef.current = true; syncPause(); },
      onBlurCapture: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { focusedRef.current = false; syncPause(); }
      },
    },
  };
}
