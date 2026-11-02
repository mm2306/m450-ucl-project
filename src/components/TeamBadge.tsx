import { useEffect, useState } from 'react';
import { cn, getInitials } from '../lib/utils';
import type { Team } from '../lib/types';

type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-6 w-6 text-[8px]',
  md: 'h-8 w-8 text-[10px]',
  lg: 'h-12 w-12 text-xs',
  xl: 'h-20 w-20 text-lg sm:h-24 sm:w-24 sm:text-xl',
};

interface TeamBadgeProps {
  team: Team;
  size?: BadgeSize;
  className?: string;
}

export const TeamBadge = ({ team, size = 'md', className }: TeamBadgeProps) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [team.crest]);

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-night-700 to-night-850 font-bold tracking-wide text-electric-300',
        sizeClasses[size],
        className,
      )}
      data-testid={`team-badge-${team.id}`}
    >
      <span aria-hidden="true">{getInitials(team.shortName)}</span>
      {!failed && team.crest ? (
        <img
          src={team.crest}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-0.5"
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
};
