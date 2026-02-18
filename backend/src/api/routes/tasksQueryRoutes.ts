import { Router } from 'express';

import { taskService } from '../../services/taskService.js';
import { taskListQuerySchema } from '../schemas/taskQuerySchemas.js';

export const tasksQueryRouter = Router();

tasksQueryRouter.get('/', async (req, res) => {
  const query = taskListQuerySchema.parse(req.query);
  const result = await taskService.listTasks(query);
  res.status(200).json(result);
});
