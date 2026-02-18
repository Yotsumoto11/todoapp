import { Router } from 'express';

import { tasksCrudRouter } from './routes/tasksCrudRoutes.js';
import { tasksQueryRouter } from './routes/tasksQueryRoutes.js';

export const apiRouter = Router();

apiRouter.use('/tasks', tasksQueryRouter);
apiRouter.use('/tasks', tasksCrudRouter);
