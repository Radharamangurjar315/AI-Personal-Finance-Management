interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-white/20 rounded-full h-4">
      <div
        className="h-4 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
