import { cn, formatGoalDifference, getTableZone } from '../lib/utils';
import type { TableRow } from '../lib/types';
import { TeamBadge } from './TeamBadge';

interface StandingsRowProps {
  row: TableRow;
  teamCount: number;
}

const zoneStyles = {
  direct: 'bg-electric-500/10 text-electric-300 ring-electric-500/25',
  playoff: 'bg-gold-500/10 text-gold-300 ring-gold-500/25',
  out: 'bg-white/[0.04] text-slate-500 ring-white/10',
} as const;

const formLabels: Record<string, string> = {
  W: 'Sieg',
  D: 'Unentschieden',
  L: 'Niederlage',
};

const FormDots = ({ form }: { form: string | null }) => {
  const results = (form ?? '').slice(-5).split('');

  if (results.length === 0) {
    return <span className="text-slate-600">–</span>;
  }

  return (
    <span
      className="flex items-center gap-1"
      aria-label={`Form: ${results.map((result) => formLabels[result] ?? result).join(', ')}`}
    >
      {results.map((result, index) => (
        <span
          key={`${result}-${index}`}
          title={formLabels[result]}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold',
            result === 'W' && 'bg-pitch-500/15 text-pitch-400',
            result === 'D' && 'bg-white/10 text-slate-400',
            result === 'L' && 'bg-red-500/10 text-red-400',
          )}
        >
          {result}
        </span>
      ))}
    </span>
  );
};

export const StandingsRow = ({ row, teamCount }: StandingsRowProps) => {
  const zone = getTableZone(row.position, teamCount);

  return (
    <tr
      className="group border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.035]"
      data-testid={`standings-row-${row.team.id}`}
    >
      <td className="py-3 pl-3 pr-1 sm:pl-5">
        <span
          data-testid="standings-position"
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ring-1',
            zoneStyles[zone],
          )}
        >
          {row.position}
        </span>
      </td>
      <td className="py-3 pr-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <TeamBadge team={row.team} size="sm" className="sm:h-7 sm:w-7" />
          <div className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-slate-100 transition-colors group-hover:text-white sm:text-sm">
              <span className="sm:hidden">{row.team.shortName}</span>
              <span className="hidden sm:inline">{row.team.name}</span>
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {row.team.tla}
            </span>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-center text-xs font-medium text-slate-400 sm:text-sm">
        {row.played}
      </td>
      <td className="hidden px-2 py-3 text-center text-sm text-slate-400 md:table-cell">
        {row.won}
      </td>
      <td className="hidden px-2 py-3 text-center text-sm text-slate-400 md:table-cell">
        {row.draw}
      </td>
      <td className="hidden px-2 py-3 text-center text-sm text-slate-400 md:table-cell">
        {row.lost}
      </td>
      <td className="hidden px-2 py-3 text-center text-sm text-slate-400 lg:table-cell">
        {row.goalsFor}:{row.goalsAgainst}
      </td>
      <td className="hidden px-2 py-3 text-center text-sm font-medium text-slate-300 sm:table-cell">
        {formatGoalDifference(row.goalDifference)}
      </td>
      <td className="px-2 py-3 text-center">
        <span className="inline-flex min-w-7 justify-center rounded-md bg-white/[0.06] px-1.5 py-1 text-xs font-bold text-white sm:text-sm">
          {row.points}
        </span>
      </td>
      <td className="hidden px-3 py-3 pr-5 xl:table-cell">
        <FormDots form={row.form} />
      </td>
    </tr>
  );
};
