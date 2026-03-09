import type { Task } from '@prisma/client';

import { NotFoundError } from '../middleware/errorHandler.js';
import type { TaskListQuery } from '../api/schemas/taskQuerySchemas.js';
import type { CreateTaskBody, UpdateTaskBody } from '../api/schemas/taskSchemas.js';
import { taskRepository } from '../models/taskRepository.js';
import { classifyDueState, type DueState } from './dueState.js';

export type TaskDto = {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'done';
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  dueState: DueState;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

function toDateOnly(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'todo' | 'done',
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    priority: task.priority as 'low' | 'medium' | 'high',
    dueState: classifyDueState(task.dueDate),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    completedAt: task.completedAt ? task.completedAt.toISOString() : null
  };
}

export const taskService = {
  async createTask(input: CreateTaskBody): Promise<TaskDto> {
    const task = await taskRepository.create({
      title: input.title.trim(),
      description: input.description,
      priority: input.priority ?? 'medium',
      dueDate: toDateOnly(input.dueDate)
    });

    return toTaskDto(task);
  },

  async updateTask(taskId: string, input: UpdateTaskBody): Promise<TaskDto> {
    const existing = await taskRepository.findById(taskId);
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません。');
    }

    const nextStatus = input.status ?? (existing.status as 'todo' | 'done');
    const statusChange = input.status && input.status !== existing.status;

    const task = await taskRepository.update(taskId, {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.dueDate !== undefined ? { dueDate: toDateOnly(input.dueDate) } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(statusChange
        ? {
            completedAt: nextStatus === 'done' ? new Date() : null
          }
        : {})
    });

    return toTaskDto(task);
  },

  async deleteTask(taskId: string): Promise<void> {
    const existing = await taskRepository.findById(taskId);
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません。');
    }

    await taskRepository.delete(taskId);
  },

  async listTasks(input: TaskListQuery): Promise<{ items: TaskDto[]; page: number; pageSize: number; total: number }> {
    const result = await taskRepository.list(input);
    return {
      items: result.items.map(toTaskDto),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    };
  }
};
