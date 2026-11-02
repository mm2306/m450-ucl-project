import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildTableRow } from '../test/fixtures';
import { StandingsRow } from './StandingsRow';

const renderRow = (row = buildTableRow()) =>
  render(
    <table>
      <tbody>
        <StandingsRow row={row} teamCount={36} />
      </tbody>
    </table>,
  );

describe('StandingsRow', () => {
  it('renders team, stats, points and form', () => {
    renderRow();

    expect(screen.getByText('FC Bayern München')).toBeInTheDocument();
    expect(screen.getByText('FCB')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('21:6')).toBeInTheDocument();
    expect(screen.getByText('+15')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Form: Sieg, Sieg, Unentschieden, Sieg, Sieg'),
    ).toBeInTheDocument();
  });

  it('highlights direct qualification places in the league phase', () => {
    renderRow(buildTableRow({ position: 1 }));

    expect(screen.getByTestId('standings-position')).toHaveClass('bg-electric-500/10');
  });

  it('highlights play-off places in amber', () => {
    renderRow(buildTableRow({ position: 12 }));

    expect(screen.getByTestId('standings-position')).toHaveClass('bg-gold-500/10');
    expect(screen.getByTestId('standings-position')).toHaveTextContent('12');
  });

  it('renders a dash when no form data exists', () => {
    renderRow(buildTableRow({ form: null }));

    expect(screen.getByText('–')).toBeInTheDocument();
  });
});
