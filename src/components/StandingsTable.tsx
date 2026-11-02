import { useEffect, useMemo, useState } from 'react';
import { cn } from '../lib/utils';
import type { StandingTable } from '../lib/types';
import { SearchIcon } from './icons';
import { StandingsRow } from './StandingsRow';

interface StandingsTableProps {
  tables: StandingTable[];
  currentMatchday?: number | null;
}

const legend = [
  { label: 'Achtelfinale', className: 'bg-electric-400' },
  { label: 'Play-offs', className: 'bg-gold-400' },
  { label: 'Ausgeschieden', className: 'bg-slate-600' },
];

export const StandingsTable = ({ tables, currentMatchday }: StandingsTableProps) => {
  const [activeKey, setActiveKey] = useState(tables[0]?.key ?? '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!tables.some((table) => table.key === activeKey)) {
      setActiveKey(tables[0]?.key ?? '');
    }
  }, [activeKey, tables]);

  const activeTable = tables.find((table) => table.key === activeKey) ?? tables[0];

  const rows = useMemo(() => {
    if (!activeTable) return [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return activeTable.rows;

    return activeTable.rows.filter(
      (row) =>
        row.team.name.toLowerCase().includes(normalizedQuery) ||
        row.team.shortName.toLowerCase().includes(normalizedQuery) ||
        row.team.tla.toLowerCase().includes(normalizedQuery),
    );
  }, [activeTable, query]);

  if (!activeTable) return null;

  const isLeaguePhase = activeTable.rows.length > 8;
  const legendItems = isLeaguePhase
    ? legend
    : [
        { label: 'Achtelfinale', className: 'bg-electric-400' },
        { label: 'Europa League', className: 'bg-gold-400' },
        { label: 'Ausgeschieden', className: 'bg-slate-600' },
      ];

  return (
    <section className="surface overflow-hidden" aria-labelledby="standings-title">
      <div className="flex flex-col gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div>
            <h2 id="standings-title" className="text-base font-semibold text-white">
              Tabelle
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {currentMatchday
                ? `Aktueller Stand · vor Spieltag ${currentMatchday}`
                : 'Aktueller Tabellenstand'}
            </p>
          </div>

          {tables.length > 1 ? (
            <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
              {tables.map((table) => (
                <button
                  key={table.key}
                  type="button"
                  onClick={() => setActiveKey(table.key)}
                  aria-pressed={table.key === activeTable.key}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-semibold transition',
                    table.key === activeTable.key
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-200',
                  )}
                >
                  {table.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="pill">{activeTable.label}</span>
          )}
        </div>

        <label className="relative block w-full lg:w-56">
          <span className="sr-only">Team suchen</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Team suchen …"
            className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 transition focus:border-electric-500/40"
          />
        </label>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full border-collapse" aria-describedby="standings-legend">
          <caption className="sr-only">
            Tabelle der UEFA Champions League, {activeTable.label}
          </caption>
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <th scope="col" className="py-3 pl-3 pr-1 text-left font-semibold sm:pl-5">
                #
              </th>
              <th scope="col" className="py-3 pr-3 text-left font-semibold">
                Team
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold" title="Spiele">
                Sp
              </th>
              <th
                scope="col"
                className="hidden px-2 py-3 text-center font-semibold md:table-cell"
                title="Siege"
              >
                S
              </th>
              <th
                scope="col"
                className="hidden px-2 py-3 text-center font-semibold md:table-cell"
                title="Unentschieden"
              >
                U
              </th>
              <th
                scope="col"
                className="hidden px-2 py-3 text-center font-semibold md:table-cell"
                title="Niederlagen"
              >
                N
              </th>
              <th
                scope="col"
                className="hidden px-2 py-3 text-center font-semibold lg:table-cell"
                title="Tore"
              >
                Tore
              </th>
              <th
                scope="col"
                className="hidden px-2 py-3 text-center font-semibold sm:table-cell"
                title="Tordifferenz"
              >
                Diff
              </th>
              <th scope="col" className="px-2 py-3 text-center font-semibold" title="Punkte">
                Pkt
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3 pr-5 text-left font-semibold xl:table-cell"
              >
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <StandingsRow key={row.team.id} row={row} teamCount={activeTable.rows.length} />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-sm text-slate-500">
                  Kein Team gefunden. Passe deine Suche an.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        id="standings-legend"
        className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-500 sm:px-6"
      >
        {legendItems.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', item.className)} />
            {item.label}
          </span>
        ))}
        <span className="ml-auto hidden text-slate-600 sm:inline">
          Sp = Spiele · Pkt = Punkte
        </span>
      </div>
    </section>
  );
};
