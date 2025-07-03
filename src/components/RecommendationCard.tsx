import Image from "next/image";
import { ProcessedRecommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: ProcessedRecommendation;
  rank: number;
}

export default function RecommendationCard({
  recommendation,
  rank,
}: RecommendationCardProps) {
  return (
    <div className="card group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden">
        {recommendation.coverUrl ? (
          <div className="relative overflow-hidden rounded-t-xl">
            <Image
              src={recommendation.coverUrl}
              alt={recommendation.title}
              width={300}
              height={400}
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>
        ) : (
          <div className="w-full h-80 bg-[#0f0f0f] border border-[#1f1f1f] rounded-t-xl flex items-center justify-center relative overflow-hidden">
            <div className="text-[#6b7280] text-6xl font-light">?</div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]"></div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm font-mono border border-white/10">
          <span className="text-[#9ca3af]">#</span>
          {rank}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 relative">
        <h3 className="text-white font-semibold text-lg mb-5 line-clamp-2 leading-tight group-hover:text-white/90 transition-colors duration-200">
          {recommendation.title}
        </h3>

        <a
          href={`https://comick.io/comic/${recommendation.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-[#9ca3af] hover:text-white transition-all duration-200 group/link relative"
        >
          <span className="relative z-10">View on Comick</span>
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/link:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover/link:w-full"></div>
        </a>
      </div>
    </div>
  );
}
