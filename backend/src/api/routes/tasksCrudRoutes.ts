import { Router } from 'express';

import { taskService } from '../../services/taskService.js';
import { createTaskBodySchema, taskIdParamSchema, updateTaskBodySchema } from '../schemas/taskSchemas.js';

export const tasksCrudRouter = Router();

tasksCrudRouter.post('/', async (req, res) => {
  const input = createTaskBodySchema.parse(req.body);
  const task = await taskService.createTask(input);
  res.status(201).json(task);
});

tasksCrudRouter.patch('/:taskId', async (req, res) => {
  const { taskId } = taskIdParamSchema.parse(req.params);
  const input = updateTaskBodySchema.parse(req.body);
  const task = await taskService.updateTask(taskId, input);
  res.status(200).json(task);
});

tasksCrudRouter.delete('/:taskId', async (req, res) => {
  const { taskId } = taskIdParamSchema.parse(req.params);
  await taskService.deleteTask(taskId);
  res.status(204).send();
});
