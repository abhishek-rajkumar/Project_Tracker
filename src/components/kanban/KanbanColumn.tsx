import { useStore } from '../../store/useStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import KanbanCard from './KanbanCard';
import type { Status, Task } from '../../types';

interface Props {
  column: { id: Status; label: string };
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: Props) {
  const { onDragOver, onDrop } = useDragAndDrop();
  const overColumn = useStore((s) => s.dragState.overColumn);
  const isOver = overColumn === column.id;

  return (
    <div
      className={`flex flex-col w-72 min-w-[18rem] rounded-xl border
        transition-colors duration-150
        ${isOver ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-100 border-gray-200'}`}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="font-semibold text-gray-700 text-sm">{column.label}</span>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-sm">
            <span className="text-2xl mb-1">📭</span>
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}