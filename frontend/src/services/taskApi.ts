import { apiClient } from './apiClient.js';
import type { Task, TaskListQuery, TaskListResponse, TaskPriority } from './taskTypes.js';

export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: 'todo' | 'done';
};

function toQueryString(query: TaskListQuery): string {
  const params = new URLSearchParams();

  if (query.status) params.set('status', query.status);
  if (query.dueWindow) params.set('dueWindow', query.dueWindow);
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortOrder) params.set('sortOrder', query.sortOrder);
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));

  const search = params.toString();
  return search ? `?${search}` : '';
}

export async function listTasks(query: TaskListQuery = {}): Promise<TaskListResponse> {
  return apiClient<TaskListResponse>(`/tasks${toQueryString(query)}`);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return apiClient<Task>('/tasks', {
    method: 'POST',
    body: input
  });
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  return apiClient<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: input
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiClient<void>(`/tasks/${taskId}`, {
    method: 'DELETE'
  });
}
