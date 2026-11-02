import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { buildMatch } from '../test/fixtures';
import { MatchCard } from './MatchCard';

const renderCard = (match = buildMatch()) =>
  render(
    <MemoryRouter>
      <MatchCard match={match} />
    </MemoryRouter>,
  );

describe('MatchCard', () => {
  it('renders a finished match with score, teams and status', () => {
    renderCard();

    const link = screen.getByRole('link', {
      name: /FC Bayern München gegen Real Madrid CF, Beendet/i,
    });

    expect(link).toHaveAttribute('href', '/spiele/4711');
    expect(screen.getByLabelText('Spielstand 2 zu 1')).toBeInTheDocument();
    expect(screen.getByText('Beendet')).toBeInTheDocument();
    expect(screen.getByText('Spieltag 4')).toBeInTheDocument();
    expect(screen.getByText('Allianz Arena')).toBeInTheDocument();
    expect(screen.getByText(/20:00 Uhr/)).toBeInTheDocument();
  });

  it('shows kickoff time instead of a score for upcoming matches', () => {
    renderCard(buildMatch({ status: 'TIMED', home: null, away: null }));

    expect(screen.getByText('Angesetzt')).toBeInTheDocument();
    expect(screen.queryByText('Endstand')).not.toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });

  it('marks live matches with a live score', () => {
    renderCard(buildMatch({ status: 'IN_PLAY', home: 1, away: 0 }));

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByLabelText('Spielstand 1 zu 0')).toBeInTheDocument();
  });
});
