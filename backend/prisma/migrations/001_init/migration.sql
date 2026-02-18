CREATE TABLE "Task" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'todo',
  "dueDate" DATETIME,
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "completedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Task_status_check" CHECK ("status" IN ('todo', 'done')),
  CONSTRAINT "Task_priority_check" CHECK ("priority" IN ('low', 'medium', 'high')),
  CONSTRAINT "Task_completedAt_check" CHECK (
    ("status" = 'done' AND "completedAt" IS NOT NULL)
    OR ("status" = 'todo' AND "completedAt" IS NULL)
  )
);

CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");
