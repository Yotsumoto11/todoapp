import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, vi } from 'vitest';

import { TaskListPage } from '../../src/pages/TaskListPage.js';
import type { DueState, Task, TaskListQuery, TaskPriority, TaskStatus } from '../../src/services/taskTypes.js';

type SeedTask = {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
};

type FetchMock = ReturnType<typeof vi.fn>;

let root: Root | null = null;
let fetchMock: FetchMock | null = null;

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function addDays(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnly(date);
}

function classifyDueState(dueDate: string | null): DueState {
  if (!dueDate) {
    return 'none';
  }

  const today = addDays(0);
  const tomorrow = addDays(1);

  if (dueDate < today) {
    return 'overdue';
  }

  if (dueDate < tomorrow) {
    return 'today';
  }

  return 'upcoming';
}

function createTask(index: number, seed: SeedTask): Task {
  const now = new Date(Date.UTC(2026, 2, 9, 0, 0, index)).toISOString();
  const dueDate = seed.dueDate ?? null;
  const status = seed.status ?? 'todo';

  return {
    id: `task-${index + 1}`,
    title: seed.title,
    description: seed.description ?? null,
    dueDate,
    priority: seed.priority ?? 'medium',
    status,
    dueState: classifyDueState(dueDate),
    createdAt: now,
    updatedAt: now,
    completedAt: status === 'done' ? now : null
  };
}

function sortTasks(tasks: Task[], sortBy: TaskListQuery['sortBy'], sortOrder: 'asc' | 'desc'): Task[] {
  const factor = sortOrder === 'asc' ? 1 : -1;

  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeight = { low: 1, medium: 2, high: 3 } as const;
      return (priorityWeight[a.priority] - priorityWeight[b.priority]) * factor;
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate) * factor;
    }

    return a.createdAt.localeCompare(b.createdAt) * factor;
  });
}

function applyQuery(tasks: Task[], query: URLSearchParams): Task[] {
  const status = query.get('status');
  const dueWindow = query.get('dueWindow');
  const sortBy = (query.get('sortBy') as TaskListQuery['sortBy']) ?? 'createdAt';
  const sortOrder = (query.get('sortOrder') as 'asc' | 'desc') ?? 'desc';
  const page = Number(query.get('page') ?? '1');
  const pageSize = Number(query.get('pageSize') ?? '50');

  let filtered = [...tasks];

  if (status === 'todo' || status === 'done') {
    filtered = filtered.filter((task) => task.status === status);
  }

  if (dueWindow === 'overdue' || dueWindow === 'today' || dueWindow === 'upcoming' || dueWindow === 'none') {
    filtered = filtered.filter((task) => task.dueState === dueWindow);
  }

  const sorted = sortTasks(filtered, sortBy, sortOrder);
  const start = (page - 1) * pageSize;

  return sorted.slice(start, start + pageSize);
}

function countQueryTotal(tasks: Task[], query: URLSearchParams): number {
  const status = query.get('status');
  const dueWindow = query.get('dueWindow');

  return tasks.filter((task) => {
    if ((status === 'todo' || status === 'done') && task.status !== status) {
      return false;
    }

    if (
      (dueWindow === 'overdue' || dueWindow === 'today' || dueWindow === 'upcoming' || dueWindow === 'none') &&
      task.dueState !== dueWindow
    ) {
      return false;
    }

    return true;
  }).length;
}

export function installTaskApiMock(seeds: SeedTask[]): { tasks: Task[]; fetchMock: FetchMock } {
  const tasks = seeds.map((seed, index) => createTask(index, seed));

  fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' ? input : input.toString(), 'http://localhost');
    const method = init?.method ?? 'GET';

    if (method === 'GET' && url.pathname === '/tasks') {
      const items = applyQuery(tasks, url.searchParams);
      const page = Number(url.searchParams.get('page') ?? '1');
      const pageSize = Number(url.searchParams.get('pageSize') ?? '50');

      return new Response(
        JSON.stringify({
          items,
          page,
          pageSize,
          total: countQueryTotal(tasks, url.searchParams)
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (method === 'POST' && url.pathname === '/tasks') {
      const body = JSON.parse(String(init?.body ?? '{}')) as SeedTask;
      const task = createTask(tasks.length, body);
      tasks.unshift(task);
      return new Response(JSON.stringify(task), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'PATCH' && url.pathname.startsWith('/tasks/')) {
      const taskId = url.pathname.split('/').pop();
      const body = JSON.parse(String(init?.body ?? '{}')) as Partial<Task>;
      const task = tasks.find((item) => item.id === taskId);

      if (!task) {
        return new Response(JSON.stringify({ message: 'タスクが見つかりません。' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      task.title = body.title ?? task.title;
      task.description = body.description === undefined ? task.description : body.description;
      task.dueDate = body.dueDate === undefined ? task.dueDate : body.dueDate;
      task.priority = body.priority ?? task.priority;
      task.status = body.status ?? task.status;
      task.completedAt = task.status === 'done' ? task.updatedAt : null;
      task.dueState = classifyDueState(task.dueDate);
      task.updatedAt = new Date().toISOString();

      return new Response(JSON.stringify(task), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE' && url.pathname.startsWith('/tasks/')) {
      const taskId = url.pathname.split('/').pop();
      const index = tasks.findIndex((item) => item.id === taskId);
      if (index >= 0) {
        tasks.splice(index, 1);
      }

      return new Response(null, { status: 204 });
    }

    return new Response(JSON.stringify({ message: '未対応のリクエストです。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  });

  vi.stubGlobal('fetch', fetchMock);
  return { tasks, fetchMock };
}

export async function renderTaskListPage() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(<TaskListPage />);
  });

  return container;
}

export async function waitFor(assertion: () => void, timeoutMs = 2000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      await act(async () => {
        await Promise.resolve();
      });
      assertion();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  assertion();
}

export function getButton(container: HTMLElement, label: string): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll('button')).find((element) => element.textContent?.trim() === label);

  if (!button) {
    throw new Error(`ボタンが見つかりません: ${label}`);
  }

  return button as HTMLButtonElement;
}

export function getSelect(container: HTMLElement, id: string): HTMLSelectElement {
  const element = container.querySelector(`#${id}`);
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`select が見つかりません: ${id}`);
  }
  return element;
}

export function getInput(container: HTMLElement, id: string): HTMLInputElement {
  const element = container.querySelector(`#${id}`);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`input が見つかりません: ${id}`);
  }
  return element;
}

export function getTextarea(container: HTMLElement, id: string): HTMLTextAreaElement {
  const element = container.querySelector(`#${id}`);
  if (!(element instanceof HTMLTextAreaElement)) {
    throw new Error(`textarea が見つかりません: ${id}`);
  }
  return element;
}

export async function changeInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  await act(async () => {
    const prototype = element instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export async function changeSelectValue(element: HTMLSelectElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export async function click(element: HTMLElement) {
  await act(async () => {
    element.click();
  });
}

afterEach(() => {
  if (root) {
    act(() => {
      root?.unmount();
    });
  }
  root = null;
  fetchMock?.mockRestore?.();
  fetchMock = null;
});
