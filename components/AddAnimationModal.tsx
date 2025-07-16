"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface AddAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  currentCount: number;
  maxCount: number;
}

export default function AddAnimationModal({
  isOpen,
  onClose,
  onSubmit,
  currentCount,
  maxCount,
}: AddAnimationModalProps) {
  const [text, setText] = useState("");

  const getProgressColor = () => {
    if (currentCount <= 2) return "bg-green-500";
    if (currentCount <= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && currentCount < maxCount) {
      onSubmit(text.trim());
      setText("");
    }
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Add New Animation
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="modal-text-input"
                className="block text-sm font-medium text-gray-700 mb-2">
                Animation Text
              </label>
              <div className="relative">
                <input
                  id="modal-text-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to animate..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  maxLength={50}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {text.length}/50
                </div>
              </div>
            </div>

            {/* Progress indicator in modal */}
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-700">
                {currentCount} / {maxCount} animations
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${(currentCount / maxCount) * 100}%` }}
                />
              </div>
            </div>

            {currentCount >= maxCount && (
              <div className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-2 rounded-lg">
                Maximum limit reached
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim() || currentCount >= maxCount}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2">
                <Plus size={20} />
                Add Animation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
