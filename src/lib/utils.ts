import type {
  Match,
  MatchStatus,
  Standing,
  StandingTable,
} from './types';

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
});

const longDateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
});

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatMatchDate = (isoDate: string) =>
  dateFormatter.format(new Date(isoDate));

export const formatLongDate = (isoDate: string) =>
  longDateFormatter.format(new Date(isoDate));

export const formatTime = (isoDate: string) => timeFormatter.format(new Date(isoDate));

export const formatDateTime = (isoDate: string) =>
  dateTimeFormatter.format(new Date(isoDate));

export const formatUpdatedAt = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'unbekannt';
  return `${timeFormatter.format(date)} Uhr`;
};

export const toDateKey = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface MatchDayGroup {
  key: string;
  label: string;
  matches: Match[];
}

export const groupMatchesByDate = (matches: Match[]): MatchDayGroup[] => {
  const groups = new Map<string, Match[]>();

  for (const match of [...matches].sort(
    (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
  )) {
    const key = toDateKey(match.utcDate);
    const bucket = groups.get(key) ?? [];
    bucket.push(match);
    groups.set(key, bucket);
  }

  return [...groups.entries()].map(([key, groupMatches]) => ({
    key,
    label: formatMatchDate(groupMatches[0].utcDate),
    matches: groupMatches,
  }));
};

export const getMatchdays = (matches: Match[]): number[] =>
  [...new Set(matches.map((match) => match.matchday).filter((day): day is number => day !== null))]
    .sort((a, b) => a - b);

export const statusLabels: Record<MatchStatus, string> = {
  SCHEDULED: 'Angesetzt',
  TIMED: 'Angesetzt',
  IN_PLAY: 'Live',
  PAUSED: 'Halbzeit',
  FINISHED: 'Beendet',
  POSTPONED: 'Verschoben',
  SUSPENDED: 'Unterbrochen',
  CANCELLED: 'Abgesagt',
  AWARDED: 'Gewertet',
};

const liveStatuses: MatchStatus[] = ['IN_PLAY', 'PAUSED'];
const finishedStatuses: MatchStatus[] = ['FINISHED', 'AWARDED'];

export const isLive = (status: MatchStatus) => liveStatuses.includes(status);

export const isFinished = (status: MatchStatus) => finishedStatuses.includes(status);

export const isUpcoming = (status: MatchStatus) =>
  status === 'SCHEDULED' ||
  status === 'TIMED' ||
  status === 'POSTPONED' ||
  status === 'SUSPENDED';

export const getStatusLabel = (status: MatchStatus) => statusLabels[status] ?? status;

export const getScore = (match: Match) => ({
  home: match.score.fullTime.home ?? null,
  away: match.score.fullTime.away ?? null,
});

export const getStageLabel = (stage: string | null | undefined) => {
  if (!stage) return 'Champions League';
  const labels: Record<string, string> = {
    LEAGUE_STAGE: 'Ligaphase',
    GROUP_STAGE: 'Gruppenphase',
    PLAYOFFS: 'Play-offs',
    ROUND_OF_16: 'Achtelfinale',
    QUARTER_FINALS: 'Viertelfinale',
    SEMI_FINALS: 'Halbfinale',
    FINAL: 'Finale',
    QUALIFICATION: 'Qualifikation',
    FIRST_QUALIFYING_ROUND: '1. Qualifikationsrunde',
    SECOND_QUALIFYING_ROUND: '2. Qualifikationsrunde',
    THIRD_QUALIFYING_ROUND: '3. Qualifikationsrunde',
    PLAY_OFF_ROUND: 'Play-off-Runde',
  };
  if (labels[stage]) return labels[stage];

  return stage
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getMatchdayLabel = (match: Match) =>
  match.matchday
    ? `Spieltag ${match.matchday}`
    : getStageLabel(match.stage);

export type TableZone = 'direct' | 'playoff' | 'out';

export const getTableZone = (position: number, teamCount: number): TableZone => {
  if (teamCount <= 8) {
    if (position <= 2) return 'direct';
    if (position === 3) return 'playoff';
    return 'out';
  }
  if (position <= 8) return 'direct';
  if (position <= 24) return 'playoff';
  return 'out';
};

export const normalizeStandings = (standings: Standing[]): StandingTable[] => {
  if (!standings || standings.length === 0) return [];

  const totalTables = standings.filter((entry) => entry.type === 'TOTAL');
  const source = totalTables.length > 0 ? totalTables : standings;

  return source
    .map((entry, index) => ({
      key: entry.group ?? `${entry.stage}-${index}`,
      label:
        entry.stage === 'LEAGUE_STAGE'
          ? 'Ligaphase'
          : entry.group
            ? `Gruppe ${entry.group}`
            : getStageLabel(entry.stage),
      rows: [...entry.table].sort((a, b) => a.position - b.position),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
};

export const formatGoalDifference = (difference: number) =>
  difference > 0 ? `+${difference}` : String(difference);

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const isSameDay = (isoDate: string, reference: Date) =>
  toDateKey(isoDate) === toDateKey(reference.toISOString());

export const pluralizeTeams = (count: number) =>
  count === 1 ? '1 Team' : `${count} Teams`;
