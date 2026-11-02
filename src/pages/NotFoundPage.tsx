import { Link } from 'react-router-dom';
import { StarBall } from '../components/icons';

export const NotFoundPage = () => (
  <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
    <div className="opacity-80">
      <StarBall className="h-20 w-20" />
    </div>
    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-electric-400">
      Fehler 404
    </p>
    <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
      Abseits.
    </h1>
    <p className="mt-3 max-w-md text-sm text-slate-400">
      Diese Seite gibt es nicht. Vielleicht wurde sie verschoben – oder der Schiedsrichter hat
      sie zurückgepfiffen.
    </p>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <Link
        to="/"
        className="rounded-lg bg-electric-500 px-4 py-2.5 text-sm font-semibold text-night-950 transition hover:bg-electric-400"
      >
        Zur Tabelle
      </Link>
      <Link
        to="/spiele"
        className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-electric-500/30 hover:text-electric-300"
      >
        Zum Spielplan
      </Link>
    </div>
  </div>
);
