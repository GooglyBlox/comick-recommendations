interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({
  current,
  total,
  label,
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto">
      {label && (
        <div className="text-[#9ca3af] text-sm mb-6 text-center font-medium tracking-wide">
          {label}
        </div>
      )}

      <div className="relative">
        <div className="w-full bg-[#1a1a1a] rounded-full h-2 border border-[#2a2a2a] overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-700 ease-out progress-glow relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white rounded-full"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent rounded-r-full opacity-75"></div>
          </div>
        </div>

        <div className="absolute -top-1 -bottom-1 left-0 right-0 rounded-full border border-white/5 pointer-events-none"></div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-[#6b7280] text-xs font-mono">
          {current.toLocaleString()}
        </div>
        <div className="text-[#9ca3af] text-xs font-medium">
          {percentage.toFixed(1)}%
        </div>
        <div className="text-[#6b7280] text-xs font-mono">
          {total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
