# Quickstart: TODO Management Web App

## Prerequisites

- Node.js 22 LTS
- npm 10+

## Setup

1. Install dependencies.
2. Initialize local database schema.
3. Start backend and frontend.

```bash
npm install
npm run db:setup
npm run dev
```

## Validation Flow

### US1 (MVP): Create, update, complete task

1. Open app in browser.
2. Create a task with title `Buy milk`.
3. Edit description and set priority to high.
4. Mark task as complete.
5. Confirm list shows task in completed state.

Expected result: Task lifecycle (create/edit/complete) works end-to-end.

### US2: Filter and sort tasks

1. Create at least 5 tasks with mixed states and due dates.
2. Apply filter `status=todo`.
3. Apply sort `dueDate asc`.
4. Verify list excludes completed tasks and order is by due date.

Expected result: Filtering and sorting produce deterministic list output.

### US3: Overdue visibility

1. Create tasks with due dates in past, today, and future.
2. Keep all three as incomplete.
3. Load task list.
4. Verify overdue and due-today tasks are visually distinct.

Expected result: Users can identify urgency without opening task detail.

## Verification Commands

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

Expected result: All test suites pass with no blocking failures.
