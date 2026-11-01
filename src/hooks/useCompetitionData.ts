import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches, fetchStandings } from '../lib/api';
import type { DataResult, MatchesResponse, StandingsResponse } from '../lib/types';

interface ResourceState<T> {
  result: DataResult<T> | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

const initialState = <T,>(): ResourceState<T> => ({
  result: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
});

const useDataResource = <T,>(
  loader: (force: boolean) => Promise<DataResult<T>>,
) => {
  const [state, setState] = useState<ResourceState<T>>(initialState);
  const [requestId, setRequestId] = useState(0);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let active = true;

    setState((current) => ({
      ...current,
      isLoading: !hasLoaded.current,
      isRefreshing: hasLoaded.current,
      error: null,
    }));

    loader(requestId > 0)
      .then((result) => {
        if (!active) return;
        hasLoaded.current = true;
        setState({
          result,
          isLoading: false,
          isRefreshing: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState((current) => ({
          ...current,
          isLoading: false,
          isRefreshing: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unbekannter Fehler beim Laden der Daten.',
        }));
      });

    return () => {
      active = false;
    };
  }, [loader, requestId]);

  const reload = useCallback(() => {
    setRequestId((current) => current + 1);
  }, []);

  return {
    data: state.result?.data ?? null,
    source: state.result?.source ?? null,
    fetchedAt: state.result?.fetchedAt ?? null,
    warning: state.result?.warning,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    reload,
  };
};

export const useStandings = () => useDataResource<StandingsResponse>(fetchStandings);

export const useMatches = () => useDataResource<MatchesResponse>(fetchMatches);
