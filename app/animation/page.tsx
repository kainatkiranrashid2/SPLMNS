"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";

type Animation = {
  id: number;
  text: string;
  element: HTMLDivElement | null;
};

export default function AnimationPage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "Default";
  const containerRef = useRef<HTMLDivElement>(null);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const animationIdRef = useRef(0);

  useEffect(() => {
    if (animations.length >= 5) {
      alert("Maximum 5 animations reached!");
      return;
    }

    const id = animationIdRef.current++;
    const element = document.createElement("div");
    element.textContent = text;
    element.className =
      "absolute text-xl font-bold text-blue-600 pointer-events-none";
    containerRef.current?.appendChild(element);

    const newAnimation: Animation = { id, text, element };
    setAnimations((prev) => [...prev, newAnimation]);

    const containerWidth = containerRef.current?.offsetWidth || 0;
    const containerHeight = containerRef.current?.offsetHeight || 0;

    gsap.to(element, {
      x: `+=${
        Math.random() * containerWidth * 0.5 * (Math.random() > 0.5 ? 1 : -1)
      }`,
      y: `+=${
        Math.random() * containerHeight * 0.5 * (Math.random() > 0.5 ? 1 : -1)
      }`,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      ease: "power2.inOut",
      onComplete: () => {
        if (element && containerRef.current?.contains(element)) {
          containerRef.current?.removeChild(element);
        }
        setAnimations((prev) => prev.filter((anim) => anim.id !== id));
      },
    });

    return () => {
      if (element && containerRef.current?.contains(element)) {
        containerRef.current?.removeChild(element);
      }
    };
  }, [text]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        ref={containerRef}
        className="relative w-[80vw] max-w-4xl bg-white rounded-lg shadow-md overflow-hidden"
        style={{ aspectRatio: "16 / 9" }}
      />
    </div>
  );
}
