import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

function dayOffset(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('Task due window integration', () => {
  it('classifies dueState and filters by dueWindow', async () => {
    await request(app).post('/tasks').send({ title: '期限なし' });
    await request(app).post('/tasks').send({ title: '期限切れ', dueDate: dayOffset(-1) });
    await request(app).post('/tasks').send({ title: '本日期限', dueDate: dayOffset(0) });
    await request(app).post('/tasks').send({ title: '期限あり', dueDate: dayOffset(1) });

    const all = await request(app).get('/tasks?sortBy=createdAt&sortOrder=asc');
    expect(all.status).toBe(200);
    expect(all.body.items.map((task: { dueState: string }) => task.dueState)).toEqual([
      'none',
      'overdue',
      'today',
      'upcoming'
    ]);

    const overdue = await request(app).get('/tasks?dueWindow=overdue');
    expect(overdue.body.items.map((task: { title: string }) => task.title)).toEqual(['期限切れ']);

    const today = await request(app).get('/tasks?dueWindow=today');
    expect(today.body.items.map((task: { title: string }) => task.title)).toEqual(['本日期限']);

    const upcoming = await request(app).get('/tasks?dueWindow=upcoming');
    expect(upcoming.body.items.map((task: { title: string }) => task.title)).toEqual(['期限あり']);

    const none = await request(app).get('/tasks?dueWindow=none');
    expect(none.body.items.map((task: { title: string }) => task.title)).toEqual(['期限なし']);
  });
});
