export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface User {
  id: string;
  name: string;
  color: string; // for avatar background
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate: string | null; // ISO string
  dueDate: string;          // ISO string
}

export interface Filter {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dateFrom: string;
  dateTo: string;
}

export type ViewType = 'kanban' | 'list' | 'timeline';