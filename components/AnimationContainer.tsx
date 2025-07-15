"use client";
import { useState, useEffect, useRef } from "react";
import AnimatedTag from "./AnimatedTag";
import { AnimationItem, addAnimation } from "@/utils/animationManager";
import gsap from "gsap";
import { Trash2 } from "lucide-react";

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
  const [masterTimeline, setMasterTimeline] =
    useState<gsap.core.Timeline | null>(null);
  const [cycleKey, setCycleKey] = useState(0);

  // Add initial animation
  useEffect(() => {
    if (initialText) {
      const newAnim = addAnimation(initialText);
      setAnimations((prev) => [...prev, newAnim]);
    }
  }, [initialText]);

  // Create and manage master timeline
  useEffect(() => {
    if (animations.length > 0) {
      // Kill existing timeline
      if (masterTimeline) {
        masterTimeline.kill();
      }
      const newMasterTimeline = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          setCycleKey((prev) => prev + 1);
        },
      });

      setMasterTimeline(newMasterTimeline);

      return () => {
        newMasterTimeline.kill();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animations.length, cycleKey]);

  const handleReset = () => {
    if (masterTimeline) {
      masterTimeline.kill();
    }
    setAnimations([]);
    setMasterTimeline(null);
    setCycleKey(0);
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

  const removeAnimation = (id: string) => {
    setAnimations((prev) => prev.filter((anim) => String(anim.id) !== id));
  };

  const getProgressColor = () => {
    if (animations.length <= 2) return "bg-green-500";
    if (animations.length <= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Animation Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="aspect-video w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shadow-lg">
          {animations.map((anim) => (
            <AnimatedTag
              key={`${anim.id}-${cycleKey}`}
              animation={anim}
              containerRef={containerRef}
              masterTimeline={masterTimeline}
            />
          ))}

          {/* Empty state */}
          {animations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-lg">Add some text to see animations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className="mt-6 space-y-4">
        {/* Add Animation Form */}
        <form
          onSubmit={handleAddAnimation}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text to animate..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50 disabled:text-gray-400"
              maxLength={50}
              disabled={animations.length >= 5}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {newText.length}/50
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={animations.length >= 5 || !newText.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium whitespace-nowrap flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium whitespace-nowrap flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </form>

        {/* Progress and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-700">
              {animations.length} / 5 animations
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${(animations.length / 5) * 100}%` }}
              />
            </div>
          </div>

          {animations.length >= 5 && (
            <div className="text-sm text-orange-600 font-medium">
              Maximum limit reached
            </div>
          )}
        </div>

        {/* Active Animations List */}
        {animations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Active Animations:
            </h3>
            <div className="flex flex-wrap gap-6">
              {animations.map((anim) => (
                <div
                  key={anim.id}
                  className="bg-green-600 px-6 py-2 rounded-full  flex items-center gap-3 group">
                  <span className="truncate text-md text-white max-w-[150px]">
                    {anim.text}
                  </span>
                  <button
                    onClick={() => removeAnimation(String(anim.id))}
                    className=" opacity-100 text-white hover:text-red-700 transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
