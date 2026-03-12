import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

function dayOffset(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('Task query integration', () => {
  it('supports dueWindow and pagination behavior', async () => {
    await request(app).post('/tasks').send({ title: '期限なし' });
    await request(app).post('/tasks').send({ title: '期限切れ', dueDate: dayOffset(-1) });
    await request(app).post('/tasks').send({ title: '本日期限', dueDate: dayOffset(0) });
    await request(app).post('/tasks').send({ title: '期限あり', dueDate: dayOffset(1) });

    const none = await request(app).get('/tasks?dueWindow=none');
    expect(none.status).toBe(200);
    expect(none.body.items.map((task: { title: string }) => task.title)).toEqual(['期限なし']);

    const overdue = await request(app).get('/tasks?dueWindow=overdue');
    expect(overdue.body.items.map((task: { title: string }) => task.title)).toEqual(['期限切れ']);

    const today = await request(app).get('/tasks?dueWindow=today');
    expect(today.body.items.map((task: { title: string }) => task.title)).toEqual(['本日期限']);

    const upcoming = await request(app).get('/tasks?dueWindow=upcoming');
    expect(upcoming.body.items.map((task: { title: string }) => task.title)).toEqual(['期限あり']);

    const paged = await request(app).get('/tasks?sortBy=createdAt&sortOrder=asc&page=2&pageSize=2');
    expect(paged.status).toBe(200);
    expect(paged.body.page).toBe(2);
    expect(paged.body.pageSize).toBe(2);
    expect(paged.body.items).toHaveLength(2);
  });
});
