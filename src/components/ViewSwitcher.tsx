// src/components/ViewSwitcher.tsx
import { useStore } from '../store/useStore';
import type { ViewType } from '../types';

const VIEWS: { id: ViewType; label: string }[] = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'list', label: 'List' },
  { id: 'timeline', label: 'Timeline' },
];

export default function ViewSwitcher() {
  const { view, setView } = useStore();

  return (
    <div className="flex gap-1 px-4 py-2 bg-white border-b border-gray-200">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => setView(v.id)}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors
            ${view === v.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}