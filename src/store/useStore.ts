import { create } from 'zustand';
import { generateTasks } from '../data/seedData';
import type { Task, Filter, ViewType, Status } from '../types';

interface DragState {
  draggingId: string | null;
  overColumn: Status | null;
}

interface CollabUser {
  id: string;
  name: string;
  color: string;
  taskId: string | null;
}

interface StoreState {
  tasks: Task[];
  filters: Filter;
  view: ViewType;
  dragState: DragState;
  collabUsers: CollabUser[];

  // Actions
  setView: (v: ViewType) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  setFilters: (f: Partial<Filter>) => void;
  clearFilters: () => void;
  setDragState: (d: Partial<DragState>) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setCollabUsers: (users: CollabUser[]) => void;
}

const DEFAULT_FILTERS: Filter = {
  statuses: [],
  priorities: [],
  assignees: [],
  dateFrom: '',
  dateTo: '',
};

export const useStore = create<StoreState>((set) => ({
  tasks: generateTasks(500),
  filters: DEFAULT_FILTERS,
  view: 'kanban',
  dragState: { draggingId: null, overColumn: null },
  collabUsers: [],

  setView: (view) => set({ view }),

  updateTask: (id, changes) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    })),

  setFilters: (f) =>
    set((s) => ({ filters: { ...s.filters, ...f } })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  setDragState: (d) =>
    set((s) => ({ dragState: { ...s.dragState, ...d } })),

  moveTask: (taskId, newStatus) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  setCollabUsers: (collabUsers) => set({ collabUsers }),
}));

// Filtered tasks selector (use outside store to avoid re-render loops)
export function selectFilteredTasks(
  tasks: Task[],
  filters: Filter
): Task[] {
  return tasks.filter((t) => {
    if (filters.statuses.length && !filters.statuses.includes(t.status))
      return false;
    if (filters.priorities.length && !filters.priorities.includes(t.priority))
      return false;
    if (filters.assignees.length && !filters.assignees.includes(t.assigneeId))
      return false;
    if (filters.dateFrom && t.dueDate < filters.dateFrom) return false;
    if (filters.dateTo && t.dueDate > filters.dateTo) return false;
    return true;
  });
}