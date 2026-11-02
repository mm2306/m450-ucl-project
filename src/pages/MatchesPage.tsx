import { useMemo, useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchFilters, type StatusFilter } from '../components/MatchFilters';
import { CalendarIcon, ClockIcon, StarBall, TrophyIcon } from '../components/icons';
import { RefreshButton } from '../components/RefreshButton';
import { DataWarning, EmptyState, ErrorState, MatchesSkeleton, SourceBadge } from '../components/States';
import { useMatches } from '../hooks/useCompetitionData';
import {
  formatUpdatedAt,
  getMatchdays,
  groupMatchesByDate,
  isFinished,
  isLive,
  isUpcoming,
  toDateKey,
} from '../lib/utils';
import type { Match } from '../lib/types';

const matchesFilter = (match: Match, status: StatusFilter) => {
  if (status === 'upcoming') return isUpcoming(match.status);
  if (status === 'results') return isFinished(match.status) || isLive(match.status);
  return true;
};

export const MatchesPage = () => {
  const { data, source, fetchedAt, warning, isLoading, isRefreshing, error, reload } =
    useMatches();
  const [selectedMatchday, setSelectedMatchday] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const allMatches = data?.matches ?? [];

  const matchdays = useMemo(() => getMatchdays(allMatches), [allMatches]);

  const filteredMatches = useMemo(
    () =>
      allMatches.filter(
        (match) =>
          (selectedMatchday === 'all' || match.matchday === selectedMatchday) &&
          matchesFilter(match, statusFilter),
      ),
    [allMatches, selectedMatchday, statusFilter],
  );

  const groups = useMemo(() => groupMatchesByDate(filteredMatches), [filteredMatches]);

  const upcomingCount = allMatches.filter((match) => isUpcoming(match.status)).length;
  const resultCount = allMatches.filter(
    (match) => isFinished(match.status) || isLive(match.status),
  ).length;
  const liveCount = allMatches.filter((match) => isLive(match.status)).length;

  const resetFilters = () => {
    setSelectedMatchday('all');
    setStatusFilter('all');
  };

  const todayKey = toDateKey(new Date().toISOString());

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pitch-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-16 -top-24 opacity-[0.06] sm:right-6">
          <StarBall className="h-72 w-72 sm:h-80 sm:w-80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill border-gold-500/20 bg-gold-500/[0.07] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Spielplan &amp; Ergebnisse
            </span>
            {source ? (
              <SourceBadge
                source={source}
                fetchedAt={fetchedAt ? formatUpdatedAt(fetchedAt) : null}
              />
            ) : null}
            <div className="ml-auto">
              <RefreshButton
                onClick={reload}
                isRefreshing={isRefreshing}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-end">
            <div className="animate-fade-up">
              <h1 className="max-w-2xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Jeder Spieltag. <span className="text-gradient">Jedes Tor.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Alle Partien der Champions League auf einen Blick – filtere nach Spieltag und
                wechsle zwischen kommenden Begegnungen und Ergebnissen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="surface-soft flex items-center gap-3 p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-300">
                  <CalendarIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {isLoading ? '–' : allMatches.length}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Spiele
                  </p>
                </div>
              </div>
              <div className="surface-soft flex items-center gap-3 p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-300">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {isLoading ? '–' : upcomingCount}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Kommende
                  </p>
                </div>
              </div>
              <div className="surface-soft col-span-2 flex items-center gap-3 p-3.5 sm:col-span-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pitch-500/10 text-pitch-400">
                  <TrophyIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {isLoading ? '–' : resultCount}
                    {liveCount > 0 ? (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-pitch-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pitch-400" />
                        {liveCount} live
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Ergebnisse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <DataWarning warning={warning} source={source ?? 'demo'} />

        {error && !data ? (
          <ErrorState message={error} onRetry={reload} />
        ) : isLoading || !data ? (
          <MatchesSkeleton />
        ) : (
          <>
            <MatchFilters
              matchdays={matchdays}
              selectedMatchday={selectedMatchday}
              onMatchdayChange={setSelectedMatchday}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              resultCount={filteredMatches.length}
            />

            {groups.length > 0 ? (
              <div className="space-y-7">
                {groups.map((group) => (
                  <section key={group.key} aria-labelledby={`day-${group.key}`}>
                    <div className="mb-3 flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-electric-400" />
                      <h2
                        id={`day-${group.key}`}
                        className="text-sm font-semibold text-white"
                      >
                        {group.key === todayKey ? `Heute · ${group.label}` : group.label}
                      </h2>
                      <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        {group.matches.length}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {group.matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Keine Spiele gefunden"
                message="Für diese Kombination aus Spieltag und Status gibt es aktuell keine Partien."
                action={
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-electric-500/30 hover:text-electric-300"
                  >
                    Filter zurücksetzen
                  </button>
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
