import { useStore } from '../store/useStore';
import { USERS } from '../data/seedData';
import type { Status, Priority } from '../types';

const STATUSES: { v: Status; l: string }[] = [
  { v: 'todo', l: 'To Do' }, { v: 'in-progress', l: 'In Progress' },
  { v: 'in-review', l: 'In Review' }, { v: 'done', l: 'Done' },
];
const PRIORITIES: { v: Priority; l: string }[] = [
  { v: 'critical', l: 'Critical' }, { v: 'high', l: 'High' },
  { v: 'medium', l: 'Medium' }, { v: 'low', l: 'Low' },
];

function Toggle<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T[];
  options: { v: T; l: string }[];
  onChange: (v: T[]) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs text-gray-400 mr-1">{label}:</span>
      {options.map((o) => {
        const active = value.includes(o.v);
        return (
          <button
            key={o.v}
            onClick={() =>
              onChange(active ? value.filter((x) => x !== o.v) : [...value, o.v])
            }
            className={`text-xs px-2 py-0.5 rounded border transition-colors
              ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterBar() {
  const { filters, setFilters, clearFilters } = useStore();

  const hasActive =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    !!filters.dateFrom || !!filters.dateTo;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex flex-wrap gap-3 items-center">
      <Toggle
        label="Status" value={filters.statuses}
        options={STATUSES}
        onChange={(v) => setFilters({ statuses: v })}
      />
      <Toggle
        label="Priority" value={filters.priorities}
        options={PRIORITIES}
        onChange={(v) => setFilters({ priorities: v })}
      />
      {/* Assignee filter */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-gray-400 mr-1">Assignee:</span>
        {USERS.map((u) => {
          const active = filters.assignees.includes(u.id);
          return (
            <button
              key={u.id}
              onClick={() =>
                setFilters({
                  assignees: active
                    ? filters.assignees.filter((a) => a !== u.id)
                    : [...filters.assignees, u.id],
                })
              }
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors
                ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full inline-block"
                style={{ backgroundColor: u.color }}
              />
              {u.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
      {/* Date range */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">From:</span>
        <input type="date" value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5" />
        <span className="text-xs text-gray-400">To:</span>
        <input type="date" value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5" />
      </div>
      {hasActive && (
        <button onClick={clearFilters}
          className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">
          ✕ Clear all
        </button>
      )}
    </div>
  );
}