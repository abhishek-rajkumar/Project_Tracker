import { useStore } from '../store/useStore';

export default function CollabBar() {
  const collabUsers = useStore((s) => s.collabUsers);
  const active = collabUsers.filter((u) => u.taskId !== null);

  return (
    <div className="bg-indigo-600 text-white px-4 py-1.5 flex items-center gap-3 text-sm">
      <div className="flex -space-x-1.5">
        {active.map((u) => (
          <div
            key={u.id}
            className="w-6 h-6 rounded-full border-2 border-indigo-600 flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: u.color }}
            title={u.name}
          >
            {u.name[0]}
          </div>
        ))}
      </div>
      <span className="text-indigo-100 text-xs">
        {active.length > 0
          ? `${active.length} ${active.length === 1 ? 'person is' : 'people are'} viewing this board`
          : 'You are the only one here'}
      </span>
    </div>
  );
}