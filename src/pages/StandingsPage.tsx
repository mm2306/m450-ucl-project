import { CalendarIcon, StarBall, TrophyIcon, UsersIcon } from '../components/icons';
import { RefreshButton } from '../components/RefreshButton';
import { DataWarning, ErrorState, SourceBadge, StandingsSkeleton } from '../components/States';
import { StandingsTable } from '../components/StandingsTable';
import { useStandings } from '../hooks/useCompetitionData';
import { formatUpdatedAt, normalizeStandings, pluralizeTeams } from '../lib/utils';

const phaseExplainer = [
  {
    rank: '1–8',
    title: 'Direkt ins Achtelfinale',
    text: 'Die besten acht Teams der Ligaphase qualifizieren sich ohne Umweg für das Achtelfinale.',
    accent: 'text-electric-300 border-electric-500/30 bg-electric-500/10',
  },
  {
    rank: '9–24',
    title: 'Play-offs',
    text: 'Teams auf den Plätzen 9 bis 24 spielen in Hin- und Rückspiel die weiteren Achtelfinal-Tickets aus.',
    accent: 'text-gold-300 border-gold-500/30 bg-gold-500/10',
  },
  {
    rank: '25–36',
    title: 'Ausgeschieden',
    text: 'Für die Teams ab Platz 25 endet die europäische Saison nach der Ligaphase.',
    accent: 'text-slate-400 border-white/10 bg-white/5',
  },
];

export const StandingsPage = () => {
  const { data, source, fetchedAt, warning, isLoading, isRefreshing, error, reload } =
    useStandings();

  const tables = data ? normalizeStandings(data.standings) : [];
  const teamCount = tables[0]?.rows.length ?? 0;
  const currentMatchday = data?.season?.currentMatchday ?? null;
  const isLeaguePhase = teamCount === 0 ? true : teamCount > 8;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pitch-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-16 -top-20 opacity-[0.07] sm:right-4 sm:top-0">
          <StarBall className="h-72 w-72 sm:h-80 sm:w-80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill border-electric-500/20 bg-electric-500/[0.07] text-electric-300">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-400" />
              UEFA Champions League · {isLeaguePhase ? 'Ligaphase' : 'Gruppenphase'}
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
                Die Tabelle der <span className="text-gradient">Königsklasse.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                {isLeaguePhase
                  ? '36 Teams, ein gemeinsames Tableau: Verfolge den Kampf um die Top 8 und die Play-off-Plätze in der Ligaphase.'
                  : 'Alle Gruppen im Blick: Verfolge, wer ins Achtelfinale einzieht und wer den Umweg über die Play-offs nehmen muss.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="surface-soft flex items-center gap-3 p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-300">
                  <UsersIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {isLoading ? '–' : teamCount || '–'}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    {isLoading ? 'Teams' : pluralizeTeams(teamCount)}
                  </p>
                </div>
              </div>
              <div className="surface-soft flex items-center gap-3 p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-300">
                  <CalendarIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {currentMatchday ?? '–'}
                    <span className="text-xs font-medium text-slate-500"> / 8</span>
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    Spieltag
                  </p>
                </div>
              </div>
              <div className="surface-soft col-span-2 flex items-center gap-3 p-3.5 sm:col-span-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pitch-500/10 text-pitch-400">
                  <TrophyIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-white">Top 8</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    direkt weiter
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
          <StandingsSkeleton />
        ) : (
          <>
            <StandingsTable tables={tables} currentMatchday={currentMatchday} />

            <section className="grid gap-4 md:grid-cols-3">
              {phaseExplainer.map((item) => (
                <div key={item.rank} className="surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-bold ${item.accent}`}
                    >
                      {item.rank}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                      Ligaphase
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.text}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
