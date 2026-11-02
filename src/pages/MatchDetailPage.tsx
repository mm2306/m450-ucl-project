import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarBall,
  TrophyIcon,
  UsersIcon,
  WhistleIcon,
} from '../components/icons';
import { StatusBadge } from '../components/StatusBadge';
import { TeamBadge } from '../components/TeamBadge';
import {
  DataWarning,
  DetailSkeleton,
  EmptyState,
  ErrorState,
  SourceBadge,
} from '../components/States';
import { RefreshButton } from '../components/RefreshButton';
import { useMatches } from '../hooks/useCompetitionData';
import {
  formatDateTime,
  formatLongDate,
  formatTime,
  formatUpdatedAt,
  getMatchdayLabel,
  getScore,
  getStageLabel,
  isFinished,
  isLive,
} from '../lib/utils';

export const MatchDetailPage = () => {
  const { matchId } = useParams();
  const { data, source, fetchedAt, warning, isLoading, isRefreshing, error, reload } =
    useMatches();

  const match = data?.matches.find((entry) => String(entry.id) === matchId);

  const backLink = (
    <Link
      to="/spiele"
      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-electric-300"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Zurück zum Spielplan
    </Link>
  );

  if (error && !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {backLink}
        <div className="mt-6">
          <ErrorState message={error} onRetry={reload} />
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {backLink}
        <div className="mt-6">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {backLink}
        <div className="mt-6">
          <EmptyState
            title="Spiel nicht gefunden"
            message="Dieses Spiel existiert nicht oder wurde aus dem Spielplan entfernt."
          />
        </div>
      </div>
    );
  }

  const score = getScore(match);
  const showScore = isFinished(match.status) || isLive(match.status);
  const halfTime = match.score.halfTime;
  const hasHalfTime = halfTime.home !== null && halfTime.away !== null;
  const referee = match.referees?.find((entry) => entry.type === 'REFEREE');

  const infoItems = [
    {
      icon: CalendarIcon,
      label: 'Datum',
      value: formatLongDate(match.utcDate),
    },
    {
      icon: ClockIcon,
      label: 'Anstoß',
      value: formatDateTime(match.utcDate),
    },
    {
      icon: TrophyIcon,
      label: 'Phase',
      value: `${getStageLabel(match.stage)}${match.matchday ? ` · ${match.matchday}. Spieltag` : ''}`,
    },
    {
      icon: MapPinIcon,
      label: 'Stadion',
      value: match.venue || 'Wird noch bekannt gegeben',
    },
    {
      icon: WhistleIcon,
      label: 'Schiedsrichter',
      value: referee?.name || 'Wird noch bekannt gegeben',
    },
    {
      icon: UsersIcon,
      label: 'Halbzeitstand',
      value: hasHalfTime ? `${halfTime.home} : ${halfTime.away}` : 'Noch kein Halbzeitstand',
    },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-glow" />
      <div className="pitch-grid pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-50" />

      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {backLink}
          <div className="flex items-center gap-3">
            {source ? (
              <SourceBadge
                source={source}
                fetchedAt={fetchedAt ? formatUpdatedAt(fetchedAt) : null}
              />
            ) : null}
            <RefreshButton
              onClick={reload}
              isRefreshing={isRefreshing}
              disabled={isLoading}
            />
          </div>
        </div>

        <DataWarning warning={warning} source={source ?? 'demo'} className="mt-4" />

        <article className="surface relative mt-5 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric-500/[0.06] via-transparent to-gold-500/[0.05]" />
          <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.06]">
            <StarBall className="h-48 w-48" />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {getMatchdayLabel(match)}
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {getStageLabel(match.stage)}
              </span>
            </div>
            <StatusBadge status={match.status} />
          </div>

          <div className="relative px-4 py-8 sm:px-8 sm:py-10">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
              <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                <TeamBadge team={match.homeTeam} size="xl" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white sm:text-lg">
                    {match.homeTeam.shortName}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {match.homeTeam.tla}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                {showScore ? (
                  <>
                    <div className="flex items-center gap-2 text-4xl font-extrabold tabular-nums text-white sm:gap-3 sm:text-6xl">
                      <span>{score.home ?? '–'}</span>
                      <span className="text-xl font-medium text-slate-600 sm:text-3xl">:</span>
                      <span>{score.away ?? '–'}</span>
                    </div>
                    {hasHalfTime ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        Halbzeit {halfTime.home} : {halfTime.away}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Anstoß
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums text-electric-300 sm:text-3xl">
                        {formatTime(match.utcDate)}
                      </p>
                      <p className="text-[10px] text-slate-500">Uhr</p>
                    </div>
                  </>
                )}
                <span className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {formatLongDate(match.utcDate)}
                </span>
              </div>

              <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                <TeamBadge team={match.awayTeam} size="xl" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white sm:text-lg">
                    {match.awayTeam.shortName}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {match.awayTeam.tla}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid gap-3 border-t border-white/[0.06] bg-black/10 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="surface-soft flex items-start gap-3 p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric-500/10 text-electric-300">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-medium leading-snug text-slate-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-white">Mehr aus der Königsklasse</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Entdecke alle Spieltage, Ergebnisse und die aktuelle Tabelle.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/spiele"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-electric-500/30 hover:text-electric-300"
            >
              Spielplan
            </Link>
            <Link
              to="/"
              className="rounded-lg bg-electric-500 px-3 py-2 text-xs font-semibold text-night-950 transition hover:bg-electric-400"
            >
              Zur Tabelle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
