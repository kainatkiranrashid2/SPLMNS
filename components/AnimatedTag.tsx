"use client";
import { useLayoutEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import type { AnimationItem } from "@/utils/animationManager";

export default function AnimatedTag({
  animation,
  containerRef,
}: {
  animation: AnimationItem;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const tagRef = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!tagRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Kill any existing animation
    animationInstance.current?.kill();

    // Create new looping animation timeline
    animationInstance.current = gsap.timeline({ repeat: -1 });

    // Function to create a single animation cycle
    const createAnimationCycle = () => {
      const startY = Math.random() * containerHeight;
      const endY = Math.random() * containerHeight;
      const duration = 5 + Math.random() * 10;
      const rotation = (Math.random() - 0.5) * 180;
      const scale = 0.8 + Math.random() * 0.5;

      // Create a timeline for this cycle
      const cycle = gsap.timeline();

      cycle
        .set(tagRef.current, {
          x: -100,
          y: startY,
          opacity: 0,
          scale: 0.5,
          rotate: -30,
        })
        .to(tagRef.current, {
          opacity: 1,
          scale,
          duration: 0.5,
        })
        .to(
          tagRef.current,
          {
            x: containerWidth + 100,
            y: endY,
            rotate: rotation,
            duration: duration,
            ease: "sine.inOut",
          },
          0
        ); // Start at the same time as the previous animation

      return cycle;
    };

    // Add the animation cycle to the main timeline
    animationInstance.current.add(createAnimationCycle());

    return () => {
      animationInstance.current?.kill();
    };
  }, [animation, containerRef]);

  return (
    <div
      ref={tagRef}
      className="absolute bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg font-medium whitespace-nowrap">
      {animation.text}
    </div>
  );
}
