"use client";
import { useState } from "react";
import AnimationContainer from "@/components/AnimationContainer";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) setShowAnimation(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Animated Tags</h1>

      {!showAnimation ? (
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to animate"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={50}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Animation
            </button>
          </form>
        </div>
      ) : (
        <AnimationContainer
          initialText={inputValue}
          onReset={() => setShowAnimation(false)}
        />
      )}
    </main>
  );
}
