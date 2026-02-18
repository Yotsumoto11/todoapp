import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const isValidIsoCalendarDate = (value: string): boolean => {
  if (!isoDateRegex.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid()
});

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional(),
  dueDate: z.string().refine(isValidIsoCalendarDate, 'Invalid dueDate').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export const updateTaskBodySchema =
  z
    .object({
      title: z.string().trim().min(1).max(120).optional(),
      description: z.string().max(2000).nullable().optional(),
      dueDate: z.string().refine(isValidIsoCalendarDate, 'Invalid dueDate').nullable().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      status: z.enum(['todo', 'done']).optional()
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field is required'
    });

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
