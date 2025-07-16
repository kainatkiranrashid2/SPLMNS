"use client";
import { useState, useEffect, useRef } from "react";
import AnimatedTag from "./AnimatedTag";
import AddAnimationModal from "./AddAnimationModal";
import { AnimationItem, addAnimation } from "@/utils/animationManager";
import gsap from "gsap";
import {
  Plus,
  RotateCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AnimationContainerProps {
  initialText: string;
  onReset: () => void;
}

interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

export default function AnimationContainer({
  initialText,
  onReset,
}: AnimationContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animations, setAnimations] = useState<AnimationItem[]>([]);
  const [masterTimeline, setMasterTimeline] =
    useState<gsap.core.Timeline | null>(null);
  const [cycleKey, setCycleKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showControls, setShowControls] = useState(false);

  const MAX_ANIMATIONS = 5;

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

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleReset = () => {
    if (masterTimeline) {
      masterTimeline.kill();
    }
    setAnimations([]);
    setMasterTimeline(null);
    setCycleKey(0);
    onReset();
    setToast({
      message: "All animations reset",
      type: "info",
    });
  };

  const handleModalSubmit = (text: string) => {
    if (animations.length < MAX_ANIMATIONS) {
      const newAnim = addAnimation(text);
      setAnimations((prev) => [...prev, newAnim]);
      setShowAddModal(false);
      setToast({
        message: "Animation added successfully",
        type: "success",
      });
    }
  };

  const removeAnimation = (id: string) => {
    const animationToRemove = animations.find((anim) => String(anim.id) === id);
    setAnimations((prev) => prev.filter((anim) => String(anim.id) !== id));

    if (animationToRemove) {
      setToast({
        message: `Animation removed`,
        type: "info",
      });
    }
  };

  const getProgressColor = () => {
    const ratio = animations.length / MAX_ANIMATIONS;
    if (ratio <= 0.6) return "bg-blue-500";
    if (ratio <= 0.8) return "bg-amber-500";
    return "bg-orange-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}>
          {toast.type === "success" && <CheckCircle size={16} />}
          {toast.type === "error" && <AlertCircle size={16} />}
          {toast.type === "info" && <AlertCircle size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Animation Display Area */}
        <div className="relative">
          <div
            ref={containerRef}
            className="aspect-video w-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
            {animations.map((anim) => (
              <AnimatedTag
                key={`${anim.id}-${cycleKey}`}
                animation={anim}
                containerRef={containerRef}
                masterTimeline={masterTimeline}
              />
            ))}

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {animations.length > 0 && (
                <button
                  onClick={handleReset}
                  className="w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl z-10 group"
                  title="Reset all animations">
                  <RotateCcw
                    size={16}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                </button>
              )}

              <button
                onClick={() => setShowAddModal(true)}
                disabled={animations.length >= MAX_ANIMATIONS}
                className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl z-10 group ${
                  animations.length >= MAX_ANIMATIONS
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                title={
                  animations.length >= MAX_ANIMATIONS
                    ? `Maximum limit reached (${MAX_ANIMATIONS} animations)`
                    : `Add new animation (${animations.length}/${MAX_ANIMATIONS})`
                }>
                <Plus
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
            </div>

            {/* Empty state */}
            {animations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <p className="text-lg font-medium">
                    Add some text to see animations
                  </p>
                  <p className="text-sm mt-2">
                    Click the <Plus size={16} className="inline mx-1" /> button
                    to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Controls Bar */}
        <div className="border-t border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center justify-between">
            {/* Progress & Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {animations.length}/{MAX_ANIMATIONS}
                </span>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor()}`}
                    style={{
                      width: `${(animations.length / MAX_ANIMATIONS) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {animations.length >= MAX_ANIMATIONS && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">At capacity</span>
                </div>
              )}
            </div>

            {/* Toggle Controls */}
            {animations.length > 0 && (
              <button
                onClick={() => setShowControls(!showControls)}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100">
                {showControls ? "Hide" : "Click to Manage Animations"} (
                {animations.length})
              </button>
            )}
          </div>

          {/* Expandable Animation List */}
          {showControls && animations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-32 overflow-y-auto">
                {animations.map((anim) => (
                  <div
                    key={anim.id}
                    className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 group transition-all duration-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-800 truncate flex-1">
                      {anim.text}
                    </span>
                    <button
                      onClick={() => removeAnimation(String(anim.id))}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 hover:bg-red-50 rounded flex-shrink-0"
                      aria-label={`Remove animation: ${anim.text}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  💡 Tip: Hover over animation items to reveal remove options
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Animation Modal */}
      <AddAnimationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleModalSubmit}
        currentCount={animations.length}
        maxCount={MAX_ANIMATIONS}
      />
    </div>
  );
}
