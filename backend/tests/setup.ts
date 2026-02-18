import { afterAll, beforeEach } from 'vitest';

process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./dev.db';

import { prisma } from '../src/lib/prisma.js';

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
