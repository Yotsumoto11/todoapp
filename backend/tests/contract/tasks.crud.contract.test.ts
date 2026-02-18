import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

describe('Task CRUD contract', () => {
  it('creates task and returns contract fields', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Buy milk', description: '2 liters', priority: 'high' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Buy milk',
        description: '2 liters',
        status: 'todo',
        priority: 'high',
        dueDate: null,
        completedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    );
  });

  it('returns 400 for invalid create payload', async () => {
    const response = await request(app).post('/tasks').send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: expect.any(String)
      })
    );
  });

  it('updates existing task with done status and completedAt', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Task to complete' });

    const response = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ status: 'done', title: 'Task completed' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('done');
    expect(response.body.completedAt).toEqual(expect.any(String));
    expect(response.body.title).toBe('Task completed');
  });

  it('returns 404 when updating unknown task', async () => {
    const response = await request(app)
      .patch('/tasks/3f6e3c5b-8f0a-4c44-9da0-7b56c8e91234')
      .send({ title: 'not found' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 'NOT_FOUND',
      message: 'Task not found'
    });
  });

  it('deletes task and returns 204', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Task to delete' });

    const response = await request(app).delete(`/tasks/${created.body.id}`);

    expect(response.status).toBe(204);
    const list = await request(app).get('/tasks');
    expect(list.body.total).toBe(0);
  });
});
