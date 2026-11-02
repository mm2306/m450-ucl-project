import { cn } from '../lib/utils';

export type StatusFilter = 'all' | 'upcoming' | 'results';

interface MatchFiltersProps {
  matchdays: number[];
  selectedMatchday: number | 'all';
  onMatchdayChange: (matchday: number | 'all') => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  resultCount: number;
}

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Alle Spiele' },
  { value: 'upcoming', label: 'Kommende' },
  { value: 'results', label: 'Ergebnisse' },
];

export const MatchFilters = ({
  matchdays,
  selectedMatchday,
  onMatchdayChange,
  statusFilter,
  onStatusFilterChange,
  resultCount,
}: MatchFiltersProps) => (
  <div className="surface space-y-4 p-4 sm:p-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">
          Spieltag
        </span>
        <div
          className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-1"
          role="group"
          aria-label="Spieltag filtern"
        >
          <button
            type="button"
            onClick={() => onMatchdayChange('all')}
            aria-pressed={selectedMatchday === 'all'}
            className={cn(
              'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
              selectedMatchday === 'all'
                ? 'border-electric-500/40 bg-electric-500/15 text-electric-300'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white',
            )}
          >
            Alle
          </button>
          {matchdays.map((matchday) => (
            <button
              key={matchday}
              type="button"
              onClick={() => onMatchdayChange(matchday)}
              aria-pressed={selectedMatchday === matchday}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
                selectedMatchday === matchday
                  ? 'border-electric-500/40 bg-electric-500/15 text-electric-300'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white',
              )}
            >
              {matchday}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1"
        role="group"
        aria-label="Spiele nach Status filtern"
      >
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onStatusFilterChange(filter.value)}
            aria-pressed={statusFilter === filter.value}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-3 sm:text-xs',
              statusFilter === filter.value
                ? 'bg-white/10 text-white'
                : 'text-slate-500 hover:text-slate-200',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
      <p className="text-[11px] text-slate-500">
        {resultCount === 1 ? '1 Spiel' : `${resultCount} Spiele`} gefunden
      </p>
      <p className="hidden text-[10px] text-slate-600 sm:block">
        Tippe auf ein Spiel für Details
      </p>
    </div>
  </div>
);
