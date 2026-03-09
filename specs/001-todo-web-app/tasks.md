# Tasks: TODO Management Web App

**Input**: Design documents from `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/`
**Prerequisites**: `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/plan.md`, `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/spec.md`, `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/research.md`, `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/data-model.md`, `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/contracts/openapi.yaml`

**Tests**: Test tasks are included because testing strategy is explicitly defined in `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/plan.md` and `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/research.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling for frontend/backend workspace.

- [x] T001 Initialize workspace scripts and npm workspaces in `package.json`
- [x] T002 Initialize backend package and scripts in `backend/package.json`
- [x] T003 [P] Initialize frontend package and scripts in `frontend/package.json`
- [x] T004 [P] Add shared TypeScript compiler options in `tsconfig.base.json`
- [x] T005 [P] Add lint and formatting configuration in `.eslintrc.cjs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation.

- [x] T006 Define Task persistence schema in `backend/prisma/schema.prisma`
- [x] T007 Create initial database migration for Task schema in `backend/prisma/migrations/001_init/migration.sql`
- [x] T008 [P] Create Prisma client bootstrap in `backend/src/lib/prisma.ts`
- [x] T009 Create Express app bootstrap and middleware wiring in `backend/src/app.ts`
- [x] T010 [P] Add standardized API error handling middleware in `backend/src/middleware/errorHandler.ts`
- [x] T011 [P] Create API router entrypoint in `backend/src/api/index.ts`
- [x] T012 [P] Create frontend API client bootstrap in `frontend/src/services/apiClient.ts`
- [x] T013 [P] Define shared task/query UI types in `frontend/src/services/taskTypes.ts`
- [x] T014 Create initial task list page shell in `frontend/src/pages/TaskListPage.tsx`

**Checkpoint**: Foundation ready for user story implementation.

---

## Phase 3: User Story 1 - Register and complete tasks (Priority: P1) 🎯 MVP

**Goal**: User can create, update, complete/reopen, delete, and view tasks.

**Independent Test**: A new user creates one task, edits it, marks it complete, and confirms status in list.

### Tests for User Story 1

- [x] T015 [P] [US1] Add contract tests for create/update/delete task endpoints in `backend/tests/contract/tasks.crud.contract.test.ts`
- [x] T016 [P] [US1] Add backend integration test for task lifecycle in `backend/tests/integration/task-lifecycle.test.ts`
- [x] T017 [P] [US1] Add end-to-end lifecycle test in `frontend/tests/e2e/us1-task-lifecycle.spec.ts`

### Implementation for User Story 1

- [x] T018 [P] [US1] Define create/update request validation schemas in `backend/src/api/schemas/taskSchemas.ts`
- [x] T019 [P] [US1] Implement Task CRUD repository operations in `backend/src/models/taskRepository.ts`
- [x] T020 [US1] Implement lifecycle business logic in `backend/src/services/taskService.ts`
- [x] T021 [US1] Implement POST/PATCH/DELETE handlers in `backend/src/api/routes/tasksCrudRoutes.ts`
- [x] T022 [US1] Register CRUD routes in `backend/src/api/index.ts`
- [x] T023 [P] [US1] Implement task create/edit form in `frontend/src/components/TaskForm.tsx`
- [x] T024 [P] [US1] Implement task row actions for complete/reopen/edit/delete in `frontend/src/components/TaskItem.tsx`
- [x] T025 [US1] Implement frontend task CRUD service calls in `frontend/src/services/taskApi.ts`
- [x] T026 [US1] Wire lifecycle flows on task list page in `frontend/src/pages/TaskListPage.tsx`
- [x] T027 [US1] Add explicit delete confirmation dialog in `frontend/src/components/DeleteTaskDialog.tsx`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Filter and sort tasks (Priority: P2)

**Goal**: User can quickly narrow and order tasks by status, due window, due date, and priority.

**Independent Test**: With mixed tasks, user applies `status=todo` and due-date sort and sees only expected tasks in deterministic order.

### Tests for User Story 2

- [x] T028 [P] [US2] Add contract tests for task list query parameters in `backend/tests/contract/tasks.query.contract.test.ts`
- [x] T029 [P] [US2] Add backend integration test for filtering and sorting behavior in `backend/tests/integration/task-query.test.ts`
- [x] T030 [P] [US2] Add end-to-end filter/sort journey test in `frontend/tests/e2e/us2-filter-sort.spec.ts`

### Implementation for User Story 2

- [x] T031 [P] [US2] Define list query validation schema in `backend/src/api/schemas/taskQuerySchemas.ts`
- [x] T032 [US2] Implement repository filtering/sorting query builder in `backend/src/models/taskRepository.ts`
- [x] T033 [US2] Implement GET /tasks query handling in `backend/src/api/routes/tasksQueryRoutes.ts`
- [x] T034 [US2] Build filter and sort controls in `frontend/src/components/TaskFilters.tsx`
- [x] T035 [US2] Integrate filter/sort state with API calls in `frontend/src/pages/TaskListPage.tsx`
- [x] T036 [US2] Render sorted list metadata (due date and priority ordering cues) in `frontend/src/components/TaskList.tsx`

**Checkpoint**: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Highlight overdue and due-today tasks (Priority: P3)

**Goal**: User can immediately distinguish overdue and due-today tasks from upcoming tasks.

**Independent Test**: With past/today/future due dates, user sees overdue and due-today tasks clearly differentiated in list view.

### Tests for User Story 3

- [x] T037 [P] [US3] Add backend integration test for overdue/today/upcoming classification in `backend/tests/integration/task-due-window.test.ts`
- [x] T038 [P] [US3] Add end-to-end due-visibility test in `frontend/tests/e2e/us3-due-visibility.spec.ts`

### Implementation for User Story 3

- [x] T039 [P] [US3] Implement due-state classifier utility in `backend/src/services/dueState.ts`
- [x] T040 [US3] Include due-state metadata in GET /tasks response mapping in `backend/src/api/routes/tasksQueryRoutes.ts`
- [x] T041 [P] [US3] Implement due-status badge component and styles in `frontend/src/components/DueStatusBadge.tsx`
- [x] T042 [US3] Render due-status badges in task list rows in `frontend/src/components/TaskList.tsx`
- [x] T043 [US3] Add due-window shortcut controls in `frontend/src/components/TaskFilters.tsx`

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality hardening, performance checks, and documentation updates across stories.

- [ ] T044 [P] Add list-performance regression test for 1,000 tasks in `backend/tests/performance/task-list.performance.test.ts`
- [ ] T045 [P] Update quickstart verification flow with finalized commands in `specs/001-todo-web-app/quickstart.md`
- [ ] T046 [P] Align API examples and response fields with implementation in `specs/001-todo-web-app/contracts/openapi.yaml`
- [x] T047 Add consolidated test/lint scripts in root workspace config `package.json`
- [ ] T048 Record final validation results for lint/unit/integration/e2e in `specs/001-todo-web-app/tasks-validation.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no dependencies.
- Foundational (Phase 2) depends on Setup and blocks all user stories.
- User stories (Phases 3-5) depend on Foundational completion.
- Polish (Phase 6) depends on selected user stories being complete.

### User Story Dependencies

- US1 (P1) starts immediately after Foundational and is the MVP baseline.
- US2 (P2) depends on Task listing and query plumbing from Foundational; it should remain independently testable from US1 lifecycle UI actions.
- US3 (P3) depends on list response and UI list rendering from US1/US2 artifacts and remains independently testable via due-state behavior.

### Dependency Graph

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- Phase 1 -> Phase 2 -> US2 (parallel path when staffing allows)
- Phase 1 -> Phase 2 -> US3 (parallel path when staffing allows)

---

## Parallel Opportunities

- Setup: `T003`, `T004`, and `T005` can run in parallel after `T001`.
- Foundational: `T008`, `T010`, `T011`, `T012`, and `T013` can run in parallel after `T006`/`T007`.
- US1: `T015`, `T016`, `T017` and separately `T018`, `T019`, `T023`, `T024` can run in parallel.
- US2: `T028`, `T029`, `T030` can run in parallel; `T031` and `T034` can run in parallel before integration tasks.
- US3: `T037`, `T038` can run in parallel; `T039` and `T041` can run in parallel.
- Polish: `T044`, `T045`, and `T046` can run in parallel.

### Parallel Example: User Story 1

```bash
Task T015 in backend/tests/contract/tasks.crud.contract.test.ts
Task T016 in backend/tests/integration/task-lifecycle.test.ts
Task T017 in frontend/tests/e2e/us1-task-lifecycle.spec.ts
```

```bash
Task T018 in backend/src/api/schemas/taskSchemas.ts
Task T019 in backend/src/models/taskRepository.ts
Task T023 in frontend/src/components/TaskForm.tsx
Task T024 in frontend/src/components/TaskItem.tsx
```

### Parallel Example: User Story 2

```bash
Task T028 in backend/tests/contract/tasks.query.contract.test.ts
Task T029 in backend/tests/integration/task-query.test.ts
Task T030 in frontend/tests/e2e/us2-filter-sort.spec.ts
```

```bash
Task T031 in backend/src/api/schemas/taskQuerySchemas.ts
Task T034 in frontend/src/components/TaskFilters.tsx
```

### Parallel Example: User Story 3

```bash
Task T037 in backend/tests/integration/task-due-window.test.ts
Task T038 in frontend/tests/e2e/us3-due-visibility.spec.ts
```

```bash
Task T039 in backend/src/services/dueState.ts
Task T041 in frontend/src/components/DueStatusBadge.tsx
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently via `T015`-`T017` and quickstart US1 flow.

### Incremental Delivery

1. Deliver US1 (task lifecycle) as MVP.
2. Deliver US2 (filter/sort) without regressing US1.
3. Deliver US3 (deadline visibility) as urgency enhancement.
4. Finish with Phase 6 cross-cutting quality and documentation.

### Parallel Team Strategy

1. Team aligns on Phase 1 and 2 together.
2. Split by story after foundation: one owner per US phase.
3. Merge through contract and e2e checks before Phase 6.
