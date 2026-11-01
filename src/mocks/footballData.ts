import type {
  Match,
  MatchStatus,
  MatchesResponse,
  Standing,
  StandingsResponse,
  TableRow,
  Team,
} from '../lib/types';

const crest = (id: number) => `https://crests.football-data.org/${id}.png`;

const team = (id: number, name: string, shortName: string, tla: string): Team => ({
  id,
  name,
  shortName,
  tla,
  crest: crest(id),
});

export const demoTeams: Team[] = [
  team(5, 'FC Bayern München', 'Bayern', 'FCB'),
  team(86, 'Real Madrid CF', 'Real Madrid', 'RMA'),
  team(65, 'Manchester City FC', 'Man City', 'MCI'),
  team(524, 'Paris Saint-Germain FC', 'PSG', 'PSG'),
  team(64, 'Liverpool FC', 'Liverpool', 'LIV'),
  team(108, 'FC Internazionale Milano', 'Inter', 'INT'),
  team(4, 'Borussia Dortmund', 'Dortmund', 'BVB'),
  team(721, 'RB Leipzig', 'Leipzig', 'RBL'),
  team(81, 'FC Barcelona', 'Barcelona', 'BAR'),
  team(3, 'Bayer 04 Leverkusen', 'Leverkusen', 'B04'),
  team(78, 'Club Atlético de Madrid', 'Atlético', 'ATM'),
  team(57, 'Arsenal FC', 'Arsenal', 'ARS'),
  team(98, 'AC Milan', 'Milan', 'MIL'),
  team(109, 'Juventus FC', 'Juventus', 'JUV'),
  team(1903, 'SL Benfica', 'Benfica', 'BEN'),
  team(503, 'FC Porto', 'Porto', 'POR'),
  team(678, 'AFC Ajax', 'Ajax', 'AJA'),
  team(674, 'PSV Eindhoven', 'PSV', 'PSV'),
  team(675, 'Feyenoord Rotterdam', 'Feyenoord', 'FEY'),
  team(498, 'Sporting CP', 'Sporting', 'SCP'),
  team(851, 'Club Brugge KV', 'Club Brugge', 'CLB'),
  team(732, 'Celtic FC', 'Celtic', 'CEL'),
  team(941, 'Rangers FC', 'Rangers', 'RAN'),
  team(1875, 'FC Red Bull Salzburg', 'Salzburg', 'RBS'),
  team(1244, 'SK Sturm Graz', 'Sturm Graz', 'STU'),
  team(482, 'FC Shakhtar Donetsk', 'Shakhtar', 'SHK'),
  team(450, 'GNK Dinamo Zagreb', 'Dinamo Zagreb', 'DIN'),
  team(576, 'FK Crvena Zvezda', 'Crvena Zvezda', 'CZV'),
  team(644, 'BSC Young Boys', 'Young Boys', 'YB'),
  team(642, 'AC Sparta Praha', 'Sparta Prag', 'SPA'),
  team(749, 'SK Slavia Praha', 'Slavia Prag', 'SLA'),
  team(548, 'AS Monaco FC', 'Monaco', 'ASM'),
  team(521, 'LOSC Lille', 'Lille', 'LOS'),
  team(58, 'Aston Villa FC', 'Aston Villa', 'AVL'),
  team(103, 'Bologna FC 1909', 'Bologna', 'BOL'),
  team(10, 'VfB Stuttgart', 'Stuttgart', 'VFB'),
];

const strengthByTeamId = new Map(
  demoTeams.map((entry, index) => [entry.id, 94 - index * 1.15]),
);

const START = new Date();
START.setDate(START.getDate() - 42);
START.setUTCHours(16, 45, 0, 0);

const ROUND_DATES = [0, 7, 14, 28, 49, 56, 70, 77];
const TOTAL_ROUNDS = 8;
const PLAYED_ROUNDS = 4;

const mulberry32 = (seed: number) => {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const poisson = (random: () => number, lambda: number) => {
  const limit = Math.exp(-lambda);
  let product = 1;
  let goals = 0;
  do {
    goals += 1;
    product *= random();
  } while (product > limit && goals < 6);
  return goals - 1;
};

const rotate = (teams: Team[]) => [teams[0], teams[teams.length - 1], ...teams.slice(1, -1)];

interface FixtureSeed {
  home: Team;
  away: Team;
  round: number;
  index: number;
}

const buildFixtureSeeds = (): FixtureSeed[] => {
  let rotation = [...demoTeams];
  const fixtures: FixtureSeed[] = [];

  for (let round = 1; round <= TOTAL_ROUNDS; round += 1) {
    for (let index = 0; index < rotation.length / 2; index += 1) {
      const first = rotation[index];
      const second = rotation[rotation.length - 1 - index];
      const swap = (round + index) % 2 === 0;
      fixtures.push({
        home: swap ? second : first,
        away: swap ? first : second,
        round,
        index,
      });
    }
    rotation = rotate(rotation);
  }

  return fixtures;
};

const matchDate = (round: number, index: number) => {
  const date = new Date(START);
  date.setDate(date.getDate() + ROUND_DATES[round - 1]);
  date.setUTCHours(index % 2 === 0 ? 16 : 19, index % 2 === 0 ? 45 : 0, 0, 0);
  return date;
};

const buildMatches = (): Match[] => {
  return buildFixtureSeeds().map(({ home, away, round, index }, position) => {
    const id = 900_000 + position + 1;
    const isPlayed = round <= PLAYED_ROUNDS;
    const random = mulberry32(round * 997 + index * 131 + 17);
    const homeStrength = strengthByTeamId.get(home.id) ?? 70;
    const awayStrength = strengthByTeamId.get(away.id) ?? 70;
    const homeExpected = Math.max(0.25, 1.65 + (homeStrength - awayStrength) / 38);
    const awayExpected = Math.max(0.2, 1.25 + (awayStrength - homeStrength) / 42);
    const homeGoals = isPlayed ? poisson(random, homeExpected) : null;
    const awayGoals = isPlayed ? poisson(random, awayExpected) : null;
    const status: MatchStatus = isPlayed ? 'FINISHED' : 'TIMED';
    const winner =
      homeGoals === null || awayGoals === null
        ? null
        : homeGoals > awayGoals
          ? 'HOME_TEAM'
          : awayGoals > homeGoals
            ? 'AWAY_TEAM'
            : 'DRAW';

    return {
      id,
      utcDate: matchDate(round, index).toISOString(),
      status,
      matchday: round,
      stage: 'LEAGUE_STAGE',
      group: null,
      lastUpdated: new Date().toISOString(),
      venue: index % 3 === 0 ? 'Allianz Arena' : null,
      homeTeam: home,
      awayTeam: away,
      score: {
        winner,
        duration: 'REGULAR',
        fullTime: { home: homeGoals, away: awayGoals },
        halfTime: {
          home: homeGoals === null ? null : Math.min(homeGoals, Math.floor((homeGoals + 1) / 2)),
          away: awayGoals === null ? null : Math.min(awayGoals, Math.floor(awayGoals / 2)),
        },
      },
      referees:
        index === 0
          ? [
              {
                id: 1,
                name: 'Felix Zwayer',
                type: 'REFEREE',
                nationality: 'Germany',
              },
            ]
          : [],
    };
  });
};

const buildStandings = (matches: Match[]): Standing[] => {
  const rows = new Map<number, TableRow>();

  for (const entry of demoTeams) {
    rows.set(entry.id, {
      position: 0,
      team: entry,
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: '',
    });
  }

  for (const match of matches.filter((fixture) => fixture.status === 'FINISHED')) {
    const home = rows.get(match.homeTeam.id);
    const away = rows.get(match.awayTeam.id);
    const homeGoals = match.score.fullTime.home ?? 0;
    const awayGoals = match.score.fullTime.away ?? 0;

    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
      home.form += 'W';
      away.form += 'L';
    } else if (awayGoals > homeGoals) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
      away.form += 'W';
      home.form += 'L';
    } else {
      home.draw += 1;
      away.draw += 1;
      home.points += 1;
      away.points += 1;
      home.form += 'D';
      away.form += 'D';
    }
  }

  const sorted = [...rows.values()]
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
      form: (row.form ?? '').slice(-5),
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.team.name.localeCompare(b.team.name),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));

  return [
    {
      stage: 'LEAGUE_STAGE',
      type: 'TOTAL',
      group: null,
      table: sorted,
    },
  ];
};

const matches = buildMatches();

const season = {
  id: 2026,
  startDate: '2026-09-15',
  endDate: '2027-05-29',
  currentMatchday: PLAYED_ROUNDS + 1,
  winner: null,
};

const competition = {
  id: 2001,
  name: 'UEFA Champions League',
  code: 'CL',
  type: 'CUP' as const,
  emblem: 'https://crests.football-data.org/CL.png',
};

export const getDemoMatches = (): MatchesResponse => ({
  competition,
  season,
  matches,
});

export const getDemoStandings = (): StandingsResponse => ({
  competition,
  season,
  standings: buildStandings(matches),
});
