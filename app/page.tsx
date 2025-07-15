"use client";
import { useState } from "react";
import { Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import AnimationContainer from "@/components/AnimationContainer";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) setShowAnimation(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 max-w-6xl mx-auto">
        {!showAnimation ? (
          <div className="w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold  mb-3">Animated Tags</h1>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="text-input"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your text
                  </label>
                  <div className="relative">
                    <input
                      id="text-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type something magical..."
                      className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 placeholder-gray-400"
                      maxLength={50}
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                      {inputValue.length}/50
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="group w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2">
                  <span>Start Animation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <button
                onClick={() => setShowAnimation(false)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4">
                <RotateCcw className="w-4 h-4" />
                <span>Back to input</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                Watch your text come alive
              </h2>
            </div>

            <AnimationContainer
              initialText={inputValue}
              onReset={() => setShowAnimation(false)}
            />
          </div>
        )}
      </div>
    </main>
  );
}
