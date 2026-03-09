export type TaskStatus = 'todo' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type DueState = 'overdue' | 'dueSoon' | 'upcoming' | 'none';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  priority: TaskPriority;
  dueState: DueState;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type TaskListQuery = {
  status?: TaskStatus;
  dueWindow?: DueState;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export type TaskListResponse = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};
