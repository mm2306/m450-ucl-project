import { describe, expect, it } from 'vitest';
import type { Standing } from './types';
import {
  formatGoalDifference,
  formatMatchDate,
  formatTime,
  formatUpdatedAt,
  getInitials,
  getMatchdayLabel,
  getStageLabel,
  getStatusLabel,
  getTableZone,
  groupMatchesByDate,
  getMatchdays,
  isFinished,
  isLive,
  isSameDay,
  isUpcoming,
  normalizeStandings,
  toDateKey,
} from './utils';
import { buildMatch, buildTableRow } from '../test/fixtures';

describe('date and time formatting', () => {
  it('formats match dates in German short format', () => {
    const localDate = new Date(2026, 10, 3, 20, 0).toISOString();
    expect(formatMatchDate(localDate)).toContain('03.11.');
  });

  it('formats the kickoff time using local time', () => {
    const localDate = new Date(2026, 10, 3, 20, 0).toISOString();
    expect(formatTime(localDate)).toBe('20:00');
  });

  it('returns a readable fallback for invalid update timestamps', () => {
    expect(formatUpdatedAt('not-a-date')).toBe('unbekannt');
    expect(formatUpdatedAt(new Date(2026, 10, 3, 18, 42).toISOString())).toBe('18:42 Uhr');
  });

  it('builds local date keys and compares days', () => {
    const iso = new Date(2026, 10, 3, 20, 0).toISOString();
    expect(toDateKey(iso)).toBe('2026-11-03');
    expect(isSameDay(iso, new Date(2026, 10, 3, 8, 0))).toBe(true);
    expect(isSameDay(iso, new Date(2026, 10, 4, 8, 0))).toBe(false);
  });
});

describe('match helpers', () => {
  it('groups and sorts matches by calendar day', () => {
    const firstDayLate = new Date(2026, 10, 3, 21, 0).toISOString();
    const firstDayEarly = new Date(2026, 10, 3, 18, 45).toISOString();
    const secondDay = new Date(2026, 10, 4, 18, 45).toISOString();

    const groups = groupMatchesByDate([
      buildMatch({ id: 3, utcDate: secondDay }),
      buildMatch({ id: 2, utcDate: firstDayLate }),
      buildMatch({ id: 1, utcDate: firstDayEarly }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].key).toBe('2026-11-03');
    expect(groups[0].matches.map((match) => match.id)).toEqual([1, 2]);
    expect(groups[1].matches.map((match) => match.id)).toEqual([3]);
  });

  it('collects unique matchdays in ascending order', () => {
    const matchdays = getMatchdays([
      buildMatch({ id: 1, matchday: 3 }),
      buildMatch({ id: 2, matchday: 1 }),
      buildMatch({ id: 3, matchday: 3 }),
    ]);

    expect(matchdays).toEqual([1, 3]);
  });

  it('labels matchdays and stages', () => {
    expect(getMatchdayLabel(buildMatch({ matchday: 4 }))).toBe('Spieltag 4');
    expect(getStageLabel('LEAGUE_STAGE')).toBe('Ligaphase');
    expect(getStageLabel('ROUND_OF_16')).toBe('Achtelfinale');
    expect(getStageLabel(null)).toBe('Champions League');
  });

  it('maps statuses to German labels and groups', () => {
    expect(getStatusLabel('IN_PLAY')).toBe('Live');
    expect(getStatusLabel('TIMED')).toBe('Angesetzt');
    expect(isLive('IN_PLAY')).toBe(true);
    expect(isLive('PAUSED')).toBe(true);
    expect(isFinished('FINISHED')).toBe(true);
    expect(isUpcoming('TIMED')).toBe(true);
    expect(isUpcoming('FINISHED')).toBe(false);
  });
});

describe('standings helpers', () => {
  it('keeps only TOTAL tables and sorts rows by position', () => {
    const standings: Standing[] = [
      {
        stage: 'GROUP_STAGE',
        type: 'TOTAL',
        group: 'A',
        table: [buildTableRow({ position: 2, team: { ...buildTableRow().team, id: 2 } }), buildTableRow({ position: 1 })],
      },
      {
        stage: 'GROUP_STAGE',
        type: 'HOME',
        group: 'A',
        table: [buildTableRow({ position: 1 })],
      },
    ];

    const tables = normalizeStandings(standings);

    expect(tables).toHaveLength(1);
    expect(tables[0].label).toBe('Gruppe A');
    expect(tables[0].rows.map((row) => row.position)).toEqual([1, 2]);
  });

  it('labels the league phase correctly even if the API sends a group name', () => {
    const tables = normalizeStandings([
      {
        stage: 'LEAGUE_STAGE',
        type: 'TOTAL',
        group: 'League phase',
        table: [buildTableRow()],
      },
    ]);

    expect(tables[0].label).toBe('Ligaphase');
  });

  it('returns an empty list when no standings are available', () => {
    expect(normalizeStandings([])).toEqual([]);
  });

  it('assigns the correct table zones for league and group phases', () => {
    expect(getTableZone(8, 36)).toBe('direct');
    expect(getTableZone(9, 36)).toBe('playoff');
    expect(getTableZone(24, 36)).toBe('playoff');
    expect(getTableZone(25, 36)).toBe('out');
    expect(getTableZone(2, 4)).toBe('direct');
    expect(getTableZone(3, 4)).toBe('playoff');
    expect(getTableZone(4, 4)).toBe('out');
  });

  it('formats goal differences and initials', () => {
    expect(formatGoalDifference(7)).toBe('+7');
    expect(formatGoalDifference(0)).toBe('0');
    expect(formatGoalDifference(-3)).toBe('-3');
    expect(getInitials('FC Bayern München')).toBe('FM');
    expect(getInitials('Arsenal')).toBe('AR');
    expect(getInitials('')).toBe('?');
  });
});
