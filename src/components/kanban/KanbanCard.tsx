import { useStore } from '../../store/useStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { USERS } from '../../data/seedData';
import type { Task } from '../../types';

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

function formatDueDate(due: string): { text: string; overdue: boolean; today: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(due);
  const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / 86400000);

  if (diffDays === 0) return { text: 'Due Today', overdue: false, today: true };
  if (diffDays > 7) return { text: `${diffDays}d overdue`, overdue: true, today: false };
  if (diffDays > 0) return { text: `${diffDays}d overdue`, overdue: true, today: false };
  return { text: dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), overdue: false, today: false };
}

export default function KanbanCard({ task }: { task: Task }) {
  const { onDragStart, onDrag, onDragEnd } = useDragAndDrop();
  const draggingId = useStore((s) => s.dragState.draggingId);
  const collabUsers = useStore((s) => s.collabUsers);
  const assignee = USERS.find((u) => u.id === task.assigneeId)!;
  const activeCollab = collabUsers.filter((u) => u.taskId === task.id);
  const due = formatDueDate(task.dueDate);
  const isDragging = draggingId === task.id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id, task.status)}
      onDrag={onDrag}
      onDragEnd={(e) => onDragEnd(e, task.id)}
      className={`bg-white rounded-lg p-3 border border-gray-200 cursor-grab
        active:cursor-grabbing transition-opacity select-none
        ${isDragging ? 'opacity-30' : 'opacity-100 hover:shadow-md'}`}
    >
      {/* Title */}
      <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">
        {task.title}
      </p>

      {/* Priority badge */}
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}>
        {task.priority}
      </span>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2">
        {/* Assignee avatar */}
        <div className="flex items-center gap-1">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: assignee.color }}
          >
            {assignee.name.split(' ').map((n) => n[0]).join('')}
          </div>
          {/* Collab indicators */}
          {activeCollab.slice(0, 2).map((u) => (
            <div
              key={u.id}
              className="w-5 h-5 rounded-full border-2 border-white text-white text-xs flex items-center justify-center"
              style={{ backgroundColor: u.color, marginLeft: -6 }}
              title={u.name}
            >
              {u.name[0]}
            </div>
          ))}
          {activeCollab.length > 2 && (
            <div className="w-5 h-5 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center" style={{ marginLeft: -6 }}>
              +{activeCollab.length - 2}
            </div>
          )}
        </div>

        {/* Due date */}
        <span className={`text-xs ${due.overdue ? 'text-red-600 font-medium' : due.today ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
          {due.text}
        </span>
      </div>
    </div>
  );
}