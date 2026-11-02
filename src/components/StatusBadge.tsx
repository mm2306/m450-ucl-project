import { cn, getStatusLabel, isFinished, isLive } from '../lib/utils';
import type { MatchStatus } from '../lib/types';

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
  compact?: boolean;
}

export const StatusBadge = ({ status, className, compact = false }: StatusBadgeProps) => {
  const live = isLive(status);
  const finished = isFinished(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
        live && 'border-pitch-500/40 bg-pitch-500/10 text-pitch-400',
        finished && 'border-white/10 bg-white/5 text-slate-400',
        !live && !finished && 'border-electric-500/25 bg-electric-500/10 text-electric-300',
        compact && 'px-2 py-0.5 text-[9px]',
        className,
      )}
      data-testid="status-badge"
    >
      {live ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pitch-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pitch-400" />
        </span>
      ) : null}
      {label}
    </span>
  );
};
