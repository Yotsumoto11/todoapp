import express from 'express';

import { apiRouter } from './api/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());
app.use(apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
