import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

describe('Task query contract', () => {
  it('returns list payload shape', async () => {
    await request(app).post('/tasks').send({ title: 'A', priority: 'medium' });
    const response = await request(app).get('/tasks?page=1&pageSize=20');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        page: 1,
        pageSize: 20,
        total: 1
      })
    );
  });

  it('filters by status', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Done me' });
    await request(app).patch(`/tasks/${created.body.id}`).send({ status: 'done' });
    await request(app).post('/tasks').send({ title: 'Still todo' });

    const response = await request(app).get('/tasks?status=todo');

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].title).toBe('Still todo');
  });

  it('sorts by priority ascending', async () => {
    await request(app).post('/tasks').send({ title: 'High', priority: 'high' });
    await request(app).post('/tasks').send({ title: 'Low', priority: 'low' });
    await request(app).post('/tasks').send({ title: 'Medium', priority: 'medium' });

    const response = await request(app).get('/tasks?sortBy=priority&sortOrder=asc');

    expect(response.status).toBe(200);
    expect(response.body.items.map((task: { priority: string }) => task.priority)).toEqual([
      'low',
      'medium',
      'high'
    ]);
  });

  it('returns 400 when sortOrder is used without sortBy', async () => {
    const response = await request(app).get('/tasks?sortOrder=asc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: expect.any(String)
      })
    );
  });
});
