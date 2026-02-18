import { z } from 'zod';

export const taskListQuerySchema =
  z
    .object({
      status: z.enum(['todo', 'done']).optional(),
      dueWindow: z.enum(['overdue', 'today', 'upcoming', 'none']).optional(),
      sortBy: z.enum(['createdAt', 'dueDate', 'priority']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20)
    })
    .refine((value) => (value.sortOrder ? Boolean(value.sortBy) : true), {
      message: 'sortOrder is only valid when sortBy is provided',
      path: ['sortOrder']
    });

export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
