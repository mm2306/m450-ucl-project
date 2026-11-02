import { cn } from '../lib/utils';
import { RefreshIcon } from './icons';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing?: boolean;
  disabled?: boolean;
}

export const RefreshButton = ({
  onClick,
  isRefreshing = false,
  disabled = false,
}: RefreshButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isRefreshing}
    className={cn(
      'inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-slate-300 transition',
      'hover:border-electric-500/30 hover:bg-electric-500/10 hover:text-electric-300 disabled:cursor-not-allowed disabled:opacity-50',
    )}
    aria-label="Daten aktualisieren"
  >
    <RefreshIcon className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
    {isRefreshing ? 'Lädt …' : 'Aktualisieren'}
  </button>
);
