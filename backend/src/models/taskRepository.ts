import type { Prisma, Task } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import { getDueSoonEndExclusive } from '../services/dueState.js';

export type TaskStatus = 'todo' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type DueWindow = 'overdue' | 'dueSoon' | 'upcoming' | 'none';

export type ListTasksInput = {
  status?: TaskStatus;
  dueWindow?: DueWindow;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
};

export type ListTasksResult = {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
};

function toUtcDateStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function toPriorityValue(priority: TaskPriority): number {
  if (priority === 'low') return 1;
  if (priority === 'medium') return 2;
  return 3;
}

function sortTasks(tasks: Task[], sortBy: ListTasksInput['sortBy'], sortOrder: 'asc' | 'desc'): Task[] {
  if (!sortBy) {
    return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const factor = sortOrder === 'asc' ? 1 : -1;

  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return (toPriorityValue(a.priority as TaskPriority) - toPriorityValue(b.priority as TaskPriority)) * factor;
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (a.dueDate.getTime() - b.dueDate.getTime()) * factor;
    }

    return (a.createdAt.getTime() - b.createdAt.getTime()) * factor;
  });
}

export const taskRepository = {
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  },

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  },

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  },

  async list(input: ListTasksInput): Promise<ListTasksResult> {
    const now = new Date();
    const todayStart = toUtcDateStart(now);
    const dueSoonEndExclusive = getDueSoonEndExclusive(now);

    const where: Prisma.TaskWhereInput = {
      ...(input.status ? { status: input.status } : {})
    };

    if (input.dueWindow === 'none') {
      where.dueDate = null;
    }

    if (input.dueWindow === 'overdue') {
      where.dueDate = { lt: todayStart };
    }

    if (input.dueWindow === 'dueSoon') {
      where.dueDate = { gte: todayStart, lt: dueSoonEndExclusive };
    }

    if (input.dueWindow === 'upcoming') {
      where.dueDate = { gte: dueSoonEndExclusive };
    }

    const all = await prisma.task.findMany({ where });
    const sorted = sortTasks(all, input.sortBy, input.sortOrder ?? 'asc');

    const start = (input.page - 1) * input.pageSize;
    return {
      items: sorted.slice(start, start + input.pageSize),
      total: sorted.length,
      page: input.page,
      pageSize: input.pageSize
    };
  }
};
