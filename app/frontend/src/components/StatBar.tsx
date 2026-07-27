import Icon, { type IconName } from "./Icon";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: IconName;
  isLowest?: boolean;
}

export default function StatBar({ label, value, color, icon, isLowest }: StatBarProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={`stat-row ${isLowest ? "stat-row--attention" : ""}`}>
      <div className="stat-icon" style={{ color }}>
        <Icon name={icon} className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-stone-700">{label}</span>
          <span className="text-sm tabular-nums text-stone-500">{safeValue}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-200/80">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${safeValue}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
