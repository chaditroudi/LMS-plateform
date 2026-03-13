interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: string;
}

export default function ProgressBar({ progress, showLabel = true, height = "h-2" }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className={`bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1 block">{progress}% complete</span>
      )}
    </div>
  );
}
