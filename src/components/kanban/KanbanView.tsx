import { useStore, selectFilteredTasks } from '../../store/useStore';
import KanbanColumn from './KanbanColumn';
import type { Status } from '../../types';

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'in-review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

export default function KanbanView() {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const filtered = selectFilteredTasks(tasks, filters);

  return (
    <div className="flex gap-4 p-4 h-full overflow-x-auto">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={filtered.filter((t) => t.status === col.id)}
        />
      ))}
    </div>
  );
}