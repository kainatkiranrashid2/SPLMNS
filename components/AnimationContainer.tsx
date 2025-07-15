"use client";
import { useState, useEffect, useRef } from "react";
import AnimatedTag from "./AnimatedTag";
import { AnimationItem, addAnimation } from "@/utils/animationManager";

interface AnimationContainerProps {
  initialText: string;
  onReset: () => void;
}

export default function AnimationContainer({
  initialText,
  onReset,
}: AnimationContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animations, setAnimations] = useState<AnimationItem[]>([]);
  const [newText, setNewText] = useState("");
  const initialAnimationAdded = useRef(false);

  useEffect(() => {
    if (initialText) {
      const newAnim = addAnimation(initialText);
      setAnimations((prev) => [...prev, newAnim]);
      initialAnimationAdded.current = true;
    }
  }, [initialText]);

  const handleReset = () => {
    setAnimations([]);
    onReset();
  };

  const handleAddAnimation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newText.trim() && animations.length < 5) {
      const newAnim = addAnimation(newText);
      setAnimations((prev) => [...prev, newAnim]);
      setNewText("");
    }
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative border-2 border-gray-300">
        {animations.map((anim) => (
          <AnimatedTag
            key={anim.id}
            animation={anim}
            containerRef={containerRef}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <form
          onSubmit={handleAddAnimation}
          className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter new text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
            disabled={animations.length >= 5}
          />
          <button
            type="submit"
            disabled={animations.length >= 5 || !newText.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors whitespace-nowrap">
            Add Animation
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
            Reset All
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          {animations.length} of 5 animations active
        </div>
      </div>
    </div>
  );
}
