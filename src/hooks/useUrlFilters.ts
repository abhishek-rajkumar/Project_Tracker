import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Status, Priority } from '../types';

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useStore();

  // On mount: read URL → store
  useEffect(() => {
    setFilters({
      statuses: (searchParams.getAll('status') as Status[]),
      priorities: (searchParams.getAll('priority') as Priority[]),
      assignees: searchParams.getAll('assignee'),
      dateFrom: searchParams.get('from') ?? '',
      dateTo: searchParams.get('to') ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // When filters change → update URL
  useEffect(() => {
    const p = new URLSearchParams();
    filters.statuses.forEach((s) => p.append('status', s));
    filters.priorities.forEach((pr) => p.append('priority', pr));
    filters.assignees.forEach((a) => p.append('assignee', a));
    if (filters.dateFrom) p.set('from', filters.dateFrom);
    if (filters.dateTo) p.set('to', filters.dateTo);
    setSearchParams(p, { replace: true });
  }, [filters, setSearchParams]);
}