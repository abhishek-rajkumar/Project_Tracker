import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Aarav Shah', color: '#6366f1' },
  { id: 'u2', name: 'Priya Mehta', color: '#ec4899' },
  { id: 'u3', name: 'Rohan Verma', color: '#f59e0b' },
  { id: 'u4', name: 'Sneha Gupta', color: '#10b981' },
  { id: 'u5', name: 'Karan Joshi', color: '#3b82f6' },
  { id: 'u6', name: 'Divya Nair', color: '#ef4444' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

const TITLES = [
  'Fix login bug', 'Design homepage', 'Write unit tests', 'Code review',
  'Deploy to staging', 'Update documentation', 'Performance audit',
  'Refactor auth module', 'Add dark mode', 'API integration',
  'Database migration', 'Mobile responsive fix', 'Security patch',
  'Feature: notifications', 'Setup CI/CD pipeline', 'User research',
  'Wireframe dashboard', 'Implement search', 'Fix memory leak',
  'Add export feature', 'Onboarding flow', 'A/B testing setup',
];

function randomDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTasks(count = 500): Task[] {
  return Array.from({ length: count }, (_, i) => {
    const hasStart = Math.random() > 0.15; // 15% tasks have no start date
    const dueOffset = Math.floor(Math.random() * 60) - 20; // -20 to +40 days
    const startOffset = dueOffset - Math.floor(Math.random() * 14) - 1;

    return {
      id: `task-${i + 1}`,
      title: `${pick(TITLES)} #${i + 1}`,
      assigneeId: pick(USERS).id,
      priority: pick(PRIORITIES),
      status: pick(STATUSES),
      startDate: hasStart ? randomDate(startOffset) : null,
      dueDate: randomDate(dueOffset),
    };
  });
}