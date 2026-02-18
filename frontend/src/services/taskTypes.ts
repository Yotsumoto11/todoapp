export type TaskStatus = 'todo' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type TaskListQuery = {
  status?: TaskStatus;
  dueWindow?: 'overdue' | 'today' | 'upcoming' | 'none';
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
