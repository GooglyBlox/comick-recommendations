"use client";

import { useState } from "react";
import { ProcessedRecommendation } from "@/types";
import {
  extractUserIdFromInput,
  fetchUserFollows,
  processRecommendations,
} from "@/lib/api";
import RecommendationCard from "@/components/RecommendationCard";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [recommendations, setRecommendations] = useState<
    ProcessedRecommendation[]
  >([]);
  const [error, setError] = useState("");
  const [userFollowsCount, setUserFollowsCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    setError("");
    setRecommendations([]);
    setProgress({ current: 0, total: 0 });

    try {
      const userId = extractUserIdFromInput(userInput);

      const follows = await fetchUserFollows(userId);
      if (follows.length === 0) {
        throw new Error("No follows found for this user");
      }

      setUserFollowsCount(follows.length);
      setProgress({ current: 0, total: follows.length });

      const processedRecommendations = await processRecommendations(
        follows,
        (current, total) => setProgress({ current, total })
      );

      setRecommendations(processedRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] cool-grid">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="max-w-3xl mx-auto text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight text-glow">
            Comick <span className="geometric-accent">Recommendations</span>
          </h1>
          <p className="text-[#9ca3af] text-xl leading-relaxed font-light">
            Discover new manga through analysis of your reading
            patterns
          </p>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        </header>

        <div className="max-w-xl mx-auto mb-20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="userInput"
                className="block text-sm font-medium text-white/90 tracking-wide uppercase text-xs letterspacing-widest"
              >
                Profile Link or User ID
              </label>
              <div className="relative group">
                <input
                  id="userInput"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="https://comick.io/user/your-id/list"
                  className="input w-full text-lg"
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none group-focus-within:border-white/20 transition-colors duration-200"></div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Processing..." : "Analyze Reading List"}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-16">
            <div className="card border-red-900/30 bg-red-950/20 p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-20">
            <ProgressBar
              current={progress.current}
              total={progress.total}
              label={`Analyzing ${userFollowsCount.toLocaleString()} comics`}
            />
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="relative">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center space-x-4 mb-4">
                <div className="w-8 h-[1px] bg-white/20"></div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Recommendations
                </h2>
                <div className="w-8 h-[1px] bg-white/20"></div>
              </div>
              <p className="text-[#9ca3af] text-lg">
                <span className="font-mono text-white">
                  {recommendations.length.toLocaleString()}
                </span>{" "}
                titles ranked by how frequently they are recommended
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.slug}
                  recommendation={recommendation}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
