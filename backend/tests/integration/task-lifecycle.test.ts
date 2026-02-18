import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../../src/app.js';

describe('Task lifecycle integration', () => {
  it('supports create, edit, complete, reopen, and delete flow', async () => {
    const created = await request(app).post('/tasks').send({
      title: 'Write docs',
      description: 'Initial draft',
      priority: 'medium'
    });

    expect(created.status).toBe(201);

    const updated = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ description: 'Final draft', priority: 'high' });

    expect(updated.status).toBe(200);
    expect(updated.body.description).toBe('Final draft');
    expect(updated.body.priority).toBe('high');
    expect(updated.body.status).toBe('todo');

    const completed = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ status: 'done' });

    expect(completed.status).toBe(200);
    expect(completed.body.status).toBe('done');
    expect(completed.body.completedAt).toEqual(expect.any(String));

    const reopened = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ status: 'todo' });

    expect(reopened.status).toBe(200);
    expect(reopened.body.status).toBe('todo');
    expect(reopened.body.completedAt).toBeNull();

    const deleted = await request(app).delete(`/tasks/${created.body.id}`);
    expect(deleted.status).toBe(204);

    const list = await request(app).get('/tasks');
    expect(list.status).toBe(200);
    expect(list.body.items).toHaveLength(0);
  });
});
