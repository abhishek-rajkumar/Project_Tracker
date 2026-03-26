import { useState } from 'react';
import { useStore, selectFilteredTasks } from '../../store/useStore';
import VirtualList from './VirtualList';
import { USERS } from '../../data/seedData';
import type { Task, Priority, Status } from '../../types';

type SortKey = 'title' | 'priority' | 'dueDate';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

export default function ListView() {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const updateTask = useStore((s) => s.updateTask);
  const clearFilters = useStore((s) => s.clearFilters);

  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = selectFilteredTasks(tasks, filters);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
    if (sortKey === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sortKey === 'dueDate') cmp = a.dueDate.localeCompare(b.dueDate);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const renderRow = (task: Task) => {
    const assignee = USERS.find((u) => u.id === task.assigneeId)!;
    const today = new Date().toISOString().split('T')[0];
    const overdue = task.dueDate < today;

    return (
      <div className="flex items-center gap-3 px-4 h-full border-b border-gray-100 hover:bg-gray-50 text-sm">
        <div className="flex-1 truncate font-medium text-gray-800">{task.title}</div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: assignee.color }}
          title={assignee.name}
        >
          {assignee.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <span className={`w-20 text-center text-xs font-medium px-2 py-0.5 rounded shrink-0
          ${task.priority === 'critical' ? 'bg-red-100 text-red-700' :
            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'}`}>
          {task.priority}
        </span>
        {/* Inline status dropdown */}
        <select
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
          className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-700 shrink-0"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className={`w-24 text-right shrink-0 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          {task.dueDate === today ? 'Due Today' : task.dueDate}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Table header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <button onClick={() => toggleSort('title')} className="flex-1 text-left hover:text-gray-800">
          Title <SortIcon col="title" />
        </button>
        <span className="w-7 shrink-0">Who</span>
        <button onClick={() => toggleSort('priority')} className="w-20 text-center hover:text-gray-800">
          Priority <SortIcon col="priority" />
        </button>
        <span className="w-24 shrink-0">Status</span>
        <button onClick={() => toggleSort('dueDate')} className="w-24 text-right hover:text-gray-800">
          Due <SortIcon col="dueDate" />
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-lg font-medium">No tasks match your filters</p>
          <button onClick={clearFilters} className="mt-3 text-sm text-indigo-600 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <VirtualList items={sorted} renderRow={renderRow} />
      )}
    </div>
  );
}