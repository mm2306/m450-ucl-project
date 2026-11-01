export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'AWARDED';

export type ScoreWinner = 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface ScoreLine {
  home: number | null;
  away: number | null;
}

export interface MatchScore {
  winner: ScoreWinner;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: ScoreLine;
  halfTime: ScoreLine;
}

export interface Referee {
  id: number;
  name: string;
  type: 'REFEREE' | 'ASSISTANT_REFEREE' | 'FOURTH_OFFICIAL';
  nationality?: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: 'LEAGUE' | 'CUP';
  emblem?: string;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner?: Team | null;
}

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  venue?: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  referees?: Referee[];
  competition?: Competition;
  season?: Season;
}

export interface TableRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string | null;
}

export interface Standing {
  stage: string;
  type: 'TOTAL' | 'HOME' | 'AWAY';
  group: string | null;
  table: TableRow[];
}

export interface StandingsResponse {
  competition?: Competition;
  season?: Season;
  standings: Standing[];
}

export interface MatchesResponse {
  competition?: Competition;
  season?: Season;
  matches: Match[];
}

export type DataSource = 'live' | 'cache' | 'demo';

export interface DataResult<T> {
  data: T;
  source: DataSource;
  fetchedAt: string;
  warning?: string;
}

export interface StandingTable {
  key: string;
  label: string;
  rows: TableRow[];
}
