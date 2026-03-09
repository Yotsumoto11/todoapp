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
  taskId: z.string().uuid('不正なタスクIDです。')
});

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください。').max(120, 'タイトルは120文字以内で入力してください。'),
  description: z.string().max(2000, '説明は2000文字以内で入力してください。').optional(),
  dueDate: z.string().refine(isValidIsoCalendarDate, '期限の日付形式が不正です。').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export const updateTaskBodySchema =
  z
    .object({
      title: z.string().trim().min(1, 'タイトルを入力してください。').max(120, 'タイトルは120文字以内で入力してください。').optional(),
      description: z.string().max(2000, '説明は2000文字以内で入力してください。').nullable().optional(),
      dueDate: z.string().refine(isValidIsoCalendarDate, '期限の日付形式が不正です。').nullable().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      status: z.enum(['todo', 'done']).optional()
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: '更新する項目を1つ以上指定してください。'
    });

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
