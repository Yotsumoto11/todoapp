import express from 'express';

import { apiRouter } from './api/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOriginPattern = /^http:\/\/localhost:517[0-9]$/;

  if (typeof origin === 'string' && allowedOriginPattern.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
