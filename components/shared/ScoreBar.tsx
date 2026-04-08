export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
