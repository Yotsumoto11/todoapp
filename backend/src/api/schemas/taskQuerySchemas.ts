import { z } from 'zod';

export const taskListQuerySchema =
  z
    .object({
      status: z.enum(['todo', 'done']).optional(),
      dueWindow: z.enum(['overdue', 'today', 'upcoming', 'none']).optional(),
      sortBy: z.enum(['createdAt', 'dueDate', 'priority']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().min(1, 'ページ番号は1以上で指定してください。').default(1),
      pageSize: z.coerce.number().int().min(1, '件数は1以上で指定してください。').max(100, '件数は100以下で指定してください。').default(20)
    })
    .refine((value) => (value.sortOrder ? Boolean(value.sortBy) : true), {
      message: 'sortOrder を指定する場合は sortBy も指定してください。',
      path: ['sortOrder']
    });

export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
