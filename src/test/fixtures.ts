import type { Match, MatchStatus, TableRow, Team } from '../lib/types';

export const bayern: Team = {
  id: 5,
  name: 'FC Bayern München',
  shortName: 'Bayern',
  tla: 'FCB',
  crest: '',
};

export const realMadrid: Team = {
  id: 86,
  name: 'Real Madrid CF',
  shortName: 'Real Madrid',
  tla: 'RMA',
  crest: '',
};

interface MatchOptions {
  id?: number;
  status?: MatchStatus;
  home?: number | null;
  away?: number | null;
  utcDate?: string;
  matchday?: number;
  venue?: string | null;
}

export const buildMatch = ({
  id = 4711,
  status = 'FINISHED',
  home = 2,
  away = 1,
  utcDate = new Date(2026, 10, 3, 20, 0).toISOString(),
  matchday = 4,
  venue = 'Allianz Arena',
}: MatchOptions = {}): Match => {
  const isPlayed = status === 'FINISHED' || status === 'AWARDED';
  const isActive = status === 'IN_PLAY' || status === 'PAUSED';
  const played = isPlayed || isActive;

  return {
    id,
    utcDate,
    status,
    matchday,
    stage: 'LEAGUE_STAGE',
    group: null,
    lastUpdated: '2026-11-03T20:00:00.000Z',
    venue,
    homeTeam: bayern,
    awayTeam: realMadrid,
    score: {
      winner:
        played && home !== null && away !== null
          ? home > away
            ? 'HOME_TEAM'
            : away > home
              ? 'AWAY_TEAM'
              : 'DRAW'
          : null,
      duration: 'REGULAR',
      fullTime: {
        home: played ? home : null,
        away: played ? away : null,
      },
      halfTime: {
        home: played && home !== null ? Math.max(0, home - 1) : null,
        away: played && away !== null ? away : null,
      },
    },
    referees: [
      {
        id: 1,
        name: 'Felix Zwayer',
        type: 'REFEREE',
        nationality: 'Germany',
      },
    ],
  };
};

export const buildTableRow = (overrides: Partial<TableRow> = {}): TableRow => ({
  position: 1,
  team: bayern,
  played: 8,
  won: 7,
  draw: 1,
  lost: 0,
  goalsFor: 21,
  goalsAgainst: 6,
  goalDifference: 15,
  points: 22,
  form: 'WWDWW',
  ...overrides,
});
