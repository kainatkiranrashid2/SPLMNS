"use client";
import { useState } from "react";
import { Sparkles, ArrowRight, Info, AlertCircle } from "lucide-react";
import AnimationContainer from "@/components/AnimationContainer";

interface FormState {
  value: string;
  isValid: boolean;
  error: string;
  touched: boolean;
}

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [form, setForm] = useState<FormState>({
    value: "",
    isValid: false,
    error: "",
    touched: false,
  });

  // Validate input
  const validateInput = (
    value: string
  ): { isValid: boolean; error: string } => {
    if (!value.trim()) {
      return { isValid: false, error: "Please enter some text to animate" };
    }
    if (value.length < 2) {
      return {
        isValid: false,
        error: "Text must be at least 2 characters long",
      };
    }
    if (value.length > 50) {
      return { isValid: false, error: "Text must be 50 characters or less" };
    }
    return { isValid: true, error: "" };
  };

  // Handle input changes
  const handleInputChange = (value: string) => {
    const validation = validateInput(value);
    setForm({
      value,
      isValid: validation.isValid,
      error: validation.error,
      touched: true,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.isValid) setShowAnimation(true);
  };

  // Reset to start
  const handleReset = () => {
    setShowAnimation(false);
    setForm({
      value: "",
      isValid: false,
      error: "",
      touched: false,
    });
  };

  // Get character count styling
  const getCharCountColor = () => {
    const length = form.value.length;
    if (length > 45) return "text-red-500 font-semibold";
    if (length > 35) return "text-amber-500 font-medium";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!showAnimation ? (
          <div className="max-w-2xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Text Animation Studio
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
                Transform your text into stunning animated experiences with
                professional-grade effects and smooth transitions
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    How to Create Amazing Animations
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>
                        Enter your text (works best with 2-50 characters)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>
                        Short phrases, product names, and call-to-actions work
                        perfectly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="text-input"
                  className="block text-sm font-semibold text-gray-700 mb-3">
                  What text would you like to animate?
                </label>
                <div className="relative">
                  <input
                    id="text-input"
                    type="text"
                    value={form.value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Try examples: Welcome, New Feature, Coming Soon, Sale 50% Off..."
                    className={`w-full px-5 py-3 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                      form.touched && form.error
                        ? "border-red-300 bg-red-50/70"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    maxLength={50}
                    aria-describedby={form.error ? "input-error" : "input-help"}
                    aria-invalid={form.touched && !form.isValid}
                  />

                  {/* Character Count */}
                  <div
                    className={`absolute right-4 top-4 text-sm ${getCharCountColor()}`}>
                    {form.value.length}/50
                  </div>
                </div>

                {/* Error Message */}
                {form.touched && form.error && (
                  <div
                    id="input-error"
                    className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{form.error}</span>
                  </div>
                )}

                {/* Enhanced Help Text */}
                {!form.error && (
                  <div
                    id="input-help"
                    className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">💡 Pro tip:</span> Keep it
                      short and punchy for the best visual impact. Perfect for
                      headlines, announcements, product launches, or any text
                      that needs to grab attention.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!form.isValid}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  form.isValid
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                <Sparkles className="w-5 h-5" />
                <span>Create Animation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Examples */}
            <div className="mt-8 p-4 bg-white/40 rounded-xl border border-gray-200/50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Popular examples to try:
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "Welcome!", desc: "Great for homepages" },
                  { text: "New Feature", desc: "Product announcements" },
                  { text: "Coming Soon", desc: "Launch teasers" },
                  { text: "Sale 50% Off", desc: "Promotional content" },
                  { text: "Subscribe Now", desc: "Call-to-action buttons" },
                ].map(({ text, desc }) => (
                  <button
                    key={text}
                    onClick={() => handleInputChange(text)}
                    className="px-3 py-1.5 text-sm bg-white/60 hover:bg-white/80 border border-gray-200/60 rounded-lg transition-all duration-200 hover:shadow-sm"
                    title={desc}>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="flex justify-center items-center gap-4 text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full ">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 ">
                Your Animation is Ready!
              </h2>
            </div>

            {/* Animation Container */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              <AnimationContainer
                initialText={form.value}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
