# Quickstart: TODO Management Web App

## Prerequisites

- Node.js 22 LTS
- npm 10+

## Setup (copy/paste)

Run from repository root (`sample-spec-kit/`):

```bash
npm install
npm run db:setup
```

## Start backend/frontend (copy/paste)

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Automated verification (copy/paste)

Run from repository root (`sample-spec-kit/`):

```bash
npm run test:contract
npm run test:integration
cd frontend
npx vitest run tests/e2e
```

Expected result: all commands finish with passing tests.

## today vocabulary check (manual)

1. In the UI, create three incomplete tasks:
   - overdue task: due date = yesterday
   - today task: due date = today
   - upcoming task: due date = tomorrow
2. In filter `期限`, select `本日期限`.
3. Confirm only the task due today remains visible.
4. Confirm badge labels use `本日期限` (not `期限が近い`).

## today vocabulary check (API example)

With backend running on `http://localhost:3000`:

```bash
TODAY=$(date -u +%F)
TOMORROW=$(date -u -d '+1 day' +%F)

curl -s -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d "{\"title\":\"today-task\",\"dueDate\":\"$TODAY\"}" >/dev/null

curl -s -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d "{\"title\":\"upcoming-task\",\"dueDate\":\"$TOMORROW\"}" >/dev/null

curl -s "http://localhost:3000/tasks?dueWindow=today"
```

Expected result: response `items` include `today-task`, and each item has `dueState: "today"`.
