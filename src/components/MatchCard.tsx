import { Link } from 'react-router-dom';
import { cn, formatMatchDate, formatTime, getMatchdayLabel, getScore, getStatusLabel, isFinished, isLive } from '../lib/utils';
import type { Match } from '../lib/types';
import { ChevronRightIcon, ClockIcon, MapPinIcon } from './icons';
import { StatusBadge } from './StatusBadge';
import { TeamBadge } from './TeamBadge';

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const score = getScore(match);
  const showScore = isFinished(match.status) || isLive(match.status);
  const live = isLive(match.status);

  return (
    <Link
      to={`/spiele/${match.id}`}
      className="surface group relative block overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:border-electric-500/30 hover:bg-night-850/90 sm:p-5"
      aria-label={`${match.homeTeam.name} gegen ${match.awayTeam.name}, ${getStatusLabel(match.status)}`}
      data-testid={`match-card-${match.id}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {getMatchdayLabel(match)}
        </span>
        <StatusBadge status={match.status} compact />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <TeamBadge team={match.homeTeam} size="md" className="sm:h-9 sm:w-9" />
          <span className="truncate text-[13px] font-semibold text-slate-100 sm:text-sm">
            <span className="sm:hidden">{match.homeTeam.shortName}</span>
            <span className="hidden sm:inline">{match.homeTeam.name}</span>
          </span>
        </div>

        <div className="flex w-[68px] shrink-0 flex-col items-center justify-center">
          {showScore ? (
            <span
              className={cn(
                'flex items-center gap-1.5 text-lg font-extrabold tabular-nums text-white sm:text-xl',
                live && 'text-pitch-400',
              )}
              aria-label={`Spielstand ${score.home ?? 0} zu ${score.away ?? 0}`}
            >
              <span>{score.home ?? '–'}</span>
              <span className="text-xs font-medium text-slate-600">:</span>
              <span>{score.away ?? '–'}</span>
            </span>
          ) : (
            <span className="text-base font-bold tabular-nums text-electric-300 sm:text-lg">
              {formatTime(match.utcDate)}
            </span>
          )}
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-600">
            {live ? 'Spielstand' : showScore ? 'Endstand' : 'Uhr'}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 text-right">
          <span className="truncate text-[13px] font-semibold text-slate-100 sm:text-sm">
            <span className="sm:hidden">{match.awayTeam.shortName}</span>
            <span className="hidden sm:inline">{match.awayTeam.name}</span>
          </span>
          <TeamBadge team={match.awayTeam} size="md" className="sm:h-9 sm:w-9" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
          <ClockIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {formatMatchDate(match.utcDate)} · {formatTime(match.utcDate)} Uhr
          </span>
          {match.venue ? (
            <>
              <span className="mx-1 hidden h-3 w-px bg-white/10 sm:block" />
              <span className="hidden min-w-0 items-center gap-1 truncate sm:inline-flex">
                <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{match.venue}</span>
              </span>
            </>
          ) : null}
        </span>
        <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-slate-500 transition group-hover:text-electric-300">
          Details
          <ChevronRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};
