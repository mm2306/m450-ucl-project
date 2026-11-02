import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CalendarIcon, StarBall, TableIcon } from './icons';

const navItems = [
  { to: '/', label: 'Tabelle', icon: TableIcon, end: true },
  { to: '/spiele', label: 'Spiele', icon: CalendarIcon, end: false },
];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <ScrollToTop />
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-night-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-night-900 shadow-glow transition group-hover:border-electric-500/40">
            <StarBall className="h-6 w-6" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-extrabold tracking-[0.22em] text-white">
              UCL CENTER
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Champions League
            </span>
          </span>
        </Link>

        <nav
          aria-label="Hauptnavigation"
          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
        >
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm',
                  isActive
                    ? 'bg-electric-500 text-night-950 shadow-[0_0_24px_rgba(24,212,245,0.28)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="pill">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            Saison 2026/27
          </span>
        </div>
      </div>
    </header>

    <main className="flex-1">
      <Outlet />
    </main>

    <footer className="mt-16 border-t border-white/[0.06] bg-night-950/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-night-900">
            <StarBall className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-300">UCL CENTER</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Inoffizielles Fan-Projekt · nicht mit der UEFA verbunden.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
          <a
            href="https://www.football-data.org"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-electric-300"
          >
            Daten: football-data.org
          </a>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span>Gebaut mit React, TypeScript &amp; Vite</span>
        </div>
      </div>
    </footer>
  </div>
);
