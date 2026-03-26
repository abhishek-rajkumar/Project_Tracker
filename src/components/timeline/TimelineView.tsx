import { useStore, selectFilteredTasks } from '../../store/useStore';
import { USERS } from '../../data/seedData';

const PRIORITY_BAR_COLOR = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export default function TimelineView() {
  const tasks   = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const filtered = selectFilteredTasks(tasks, filters);

  const today     = new Date();
  const year      = today.getFullYear();
  const month     = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const DAY_WIDTH  = 36; // px per day
  const ROW_H      = 40;

  const todayCol = today.getDate() - 1; // 0-based

  // Only show tasks that fall within current month
  const monthStart = new Date(year, month, 1).toISOString().split('T')[0];
  const monthEnd   = new Date(year, month, daysInMonth).toISOString().split('T')[0];

  const visible = filtered.filter(
    (t) => t.dueDate >= monthStart && t.dueDate <= monthEnd
  );

  return (
    <div className="overflow-x-auto p-4 h-full">
      <div style={{ minWidth: daysInMonth * DAY_WIDTH + 200 }}>
        {/* Day headers */}
        <div className="flex sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="w-48 shrink-0 text-xs font-semibold text-gray-500 px-3 py-2">
            Task
          </div>
          {Array.from({ length: daysInMonth }, (_, i) => (
            <div
              key={i}
              className={`text-xs text-center py-2 border-l border-gray-100
                ${i === todayCol ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-400'}`}
              style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Rows */}
        {visible.map((task) => {
          const assignee = USERS.find((u) => u.id === task.assigneeId)!;
          const startDay = task.startDate
            ? Math.max(0, new Date(task.startDate).getDate() - 1)
            : new Date(task.dueDate).getDate() - 1;
          const endDay   = Math.min(daysInMonth - 1, new Date(task.dueDate).getDate() - 1);
          const barLeft  = startDay * DAY_WIDTH;
          const barWidth = Math.max(DAY_WIDTH, (endDay - startDay + 1) * DAY_WIDTH);

          return (
            <div
              key={task.id}
              className="flex items-center border-b border-gray-50 hover:bg-gray-50"
              style={{ height: ROW_H }}
            >
              {/* Task label */}
              <div className="w-48 shrink-0 px-3 flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: assignee.color }}
                >
                  {assignee.name[0]}
                </div>
                <span className="text-xs text-gray-700 truncate">{task.title}</span>
              </div>

              {/* Timeline area */}
              <div className="flex-1 relative" style={{ height: ROW_H }}>
                {/* Today line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-indigo-400 z-10"
                  style={{ left: todayCol * DAY_WIDTH + DAY_WIDTH / 2 }}
                />
                {/* Task bar */}
                <div
                  className="absolute top-2 rounded text-white text-xs px-1.5 flex items-center truncate"
                  style={{
                    left: barLeft,
                    width: barWidth - 2,
                    height: ROW_H - 16,
                    backgroundColor: PRIORITY_BAR_COLOR[task.priority],
                    opacity: 0.85,
                  }}
                >
                  {barWidth > 60 ? task.title : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}