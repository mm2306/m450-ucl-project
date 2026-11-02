import { cn } from '../lib/utils';
import type { DataSource } from '../lib/types';
import { AlertIcon, InfoIcon, RefreshIcon } from './icons';

export const StandingsSkeleton = () => (
  <div className="surface overflow-hidden" aria-label="Tabelle wird geladen" role="status">
    <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6">
      <div className="skeleton h-5 w-32" />
      <div className="skeleton h-9 w-40 rounded-lg" />
    </div>
    <div className="divide-y divide-white/5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-3.5 sm:px-6"
          style={{ opacity: 1 - index * 0.06 }}
        >
          <div className="skeleton h-5 w-5" />
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-3.5 w-32 sm:w-48" />
          <div className="ml-auto hidden gap-6 sm:flex">
            <div className="skeleton h-3 w-6" />
            <div className="skeleton h-3 w-6" />
            <div className="skeleton h-3 w-6" />
            <div className="skeleton h-3 w-8" />
          </div>
          <div className="skeleton ml-4 h-4 w-7" />
        </div>
      ))}
    </div>
    <span className="sr-only">Daten werden geladen …</span>
  </div>
);

export const MatchesSkeleton = () => (
  <div className="space-y-6" aria-label="Spiele werden geladen" role="status">
    {[0, 1].map((group) => (
      <div key={group}>
        <div className="skeleton mb-3 h-4 w-36" />
        <div className="grid gap-3 lg:grid-cols-2">
          {[0, 1, 2, 3].map((card) => (
            <div key={card} className="surface p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-4 w-16 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="skeleton h-9 w-9 rounded-full" />
                <div className="skeleton h-3.5 w-24" />
                <div className="ml-auto flex gap-2">
                  <div className="skeleton h-6 w-6" />
                  <div className="skeleton h-6 w-6" />
                </div>
                <div className="skeleton h-9 w-9 rounded-full" />
                <div className="skeleton h-3.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
    <span className="sr-only">Spiele werden geladen …</span>
  </div>
);

export const DetailSkeleton = () => (
  <div className="surface overflow-hidden" aria-label="Spieldetails werden geladen" role="status">
    <div className="border-b border-white/5 px-5 py-4">
      <div className="skeleton h-3 w-32" />
    </div>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-10 sm:px-10">
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton h-20 w-20 rounded-full" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="skeleton h-12 w-24" />
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton h-20 w-20 rounded-full" />
        <div className="skeleton h-4 w-24" />
      </div>
    </div>
    <div className="grid gap-3 border-t border-white/5 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="surface-soft flex items-center gap-3 p-3">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <div className="skeleton h-2.5 w-16" />
            <div className="skeleton h-3.5 w-24" />
          </div>
        </div>
      ))}
    </div>
    <span className="sr-only">Spieldetails werden geladen …</span>
  </div>
);

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Etwas ist schiefgelaufen',
  message,
  onRetry,
}: ErrorStateProps) => (
  <div className="surface flex flex-col items-center gap-4 px-6 py-14 text-center" role="alert">
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-300">
      <AlertIcon className="h-7 w-7" />
    </span>
    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mx-auto max-w-md text-sm text-slate-400">{message}</p>
    </div>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-night-950 transition hover:bg-electric-400"
      >
        <RefreshIcon className="h-4 w-4" />
        Erneut versuchen
      </button>
    ) : null}
  </div>
);

interface EmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, message, action }: EmptyStateProps) => (
  <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400">
      <InfoIcon className="h-6 w-6" />
    </span>
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    <p className="max-w-md text-sm text-slate-400">{message}</p>
    {action}
  </div>
);

interface DataWarningProps {
  warning?: string;
  source: DataSource;
  className?: string;
}

export const DataWarning = ({ warning, source, className }: DataWarningProps) => {
  if (!warning) return null;

  const isDemo = source === 'demo';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        isDemo
          ? 'border-gold-500/25 bg-gold-500/[0.07] text-gold-300'
          : 'border-electric-500/20 bg-electric-500/[0.06] text-electric-300',
        className,
      )}
      role="status"
    >
      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-relaxed">{warning}</p>
    </div>
  );
};

const sourceLabels: Record<DataSource, string> = {
  live: 'Live-Daten',
  cache: 'Zwischengespeichert',
  demo: 'Demo-Daten',
};

export const SourceBadge = ({
  source,
  fetchedAt,
}: {
  source: DataSource;
  fetchedAt: string | null;
}) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-400">
    <span
      className={cn(
        'h-1.5 w-1.5 rounded-full',
        source === 'live' && 'bg-pitch-400 animate-pulse-soft',
        source === 'cache' && 'bg-electric-400',
        source === 'demo' && 'bg-gold-400',
      )}
    />
    {sourceLabels[source]}
    {fetchedAt ? <span className="text-slate-500">· {fetchedAt}</span> : null}
  </span>
);
