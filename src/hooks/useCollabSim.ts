import { useEffect } from 'react';
import { useStore } from '../store/useStore';

const FAKE_USERS = [
  { id: 'c1', name: 'Amit Roy', color: '#8b5cf6' },
  { id: 'c2', name: 'Neha Singh', color: '#06b6d4' },
  { id: 'c3', name: 'Ravi Kumar', color: '#f97316' },
];

export function useCollabSim() {
  const setCollabUsers = useStore((s) => s.setCollabUsers);

  useEffect(() => {
    function moveUsers() {
      const tasks = useStore.getState().tasks;
      if (tasks.length === 0) return;

      const updated = FAKE_USERS.map((u) => ({
        ...u,
        taskId: Math.random() > 0.2
          ? tasks[Math.floor(Math.random() * Math.min(20, tasks.length))].id
          : null,
      }));
      setCollabUsers(updated);
    }

    moveUsers();
    const interval = setInterval(moveUsers, 3500);
    return () => clearInterval(interval);
  }, [setCollabUsers]);
}