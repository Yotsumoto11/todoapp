# Implementation Plan: TODO Management Web App

**Branch**: `001-todo-web-app` | **Date**: 2026-03-03 | **Spec**: [/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/spec.md](/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/spec.md)
**Input**: Feature specification from `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/spec.md`

## Summary

Build a single-user TODO web app that supports full task lifecycle management (create/edit/complete/reopen/delete), list filtering/sorting, and overdue visibility. Implementation uses a React frontend and Express API with Prisma + SQLite persistence, with contract, integration, and UI-flow verification aligned to story priorities (P1 -> P2 -> P3).

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS  
**Primary Dependencies**: React 19, Express 5, Zod, Prisma  
**Storage**: SQLite (via Prisma ORM + migrations)  
**Testing**: Vitest/Jest-style unit tests, backend integration/contract tests, frontend e2e smoke coverage  
**Target Platform**: Web browsers (frontend) + Linux/macOS Node runtime (backend)  
**Project Type**: Web application (separate `frontend/` and `backend/`)  
**Performance Goals**: P95 list query under 200ms at 1,000 tasks; key UI actions respond within 300ms locally  
**Constraints**: Single-user scope, no external auth/notifications, deterministic filter/sort behavior, explicit delete confirmation  
**Scale/Scope**: 1 active user, up to ~1,000 tasks, CRUD + filter/sort + urgency highlighting

## Constitution Check (Pre-Design)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first gate: `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/spec.md` contains prioritized stories (P1-P3), acceptance scenarios, and measurable success criteria.
- [x] Clarification gate: no unresolved `NEEDS CLARIFICATION` items remain in technical context.
- [x] Story independence gate: US1 (task lifecycle), US2 (filter/sort), US3 (overdue visibility) are independently testable slices.
- [x] Verification gate: independent validation paths are defined in `/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/quickstart.md`.
- [x] Traceability gate: FR mapping is linked across `/spec.md`, `/research.md`, `/data-model.md`, `/contracts/openapi.yaml`, and `/tasks.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-web-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   └── migrations/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   └── schemas/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   └── lib/
└── tests/
    ├── contract/
    ├── integration/
    └── helpers/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: Use the web-application split (`backend/`, `frontend/`) to keep API contract and UI behavior independently testable while preserving clear story-based increments.

## Phase 0 Output: Research

- Research completed in [/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/research.md](/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/research.md).
- Decisions captured for stack/runtime, persistence, API style, validation strategy, and test strategy.
- All technical-context unknowns resolved; no remaining clarification blockers.

## Phase 1 Output: Design & Contracts

- Data model: [/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/data-model.md](/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/data-model.md)
- API contract: [/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/contracts/openapi.yaml](/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/contracts/openapi.yaml)
- Validation guide: [/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/quickstart.md](/home/ayotsumo/proj/sample-spec-kit/specs/001-todo-web-app/quickstart.md)

## Traceability

- FR-001..FR-004 (task lifecycle) -> `data-model.md` (`Task`), `contracts/openapi.yaml` (`POST /tasks`, `PATCH /tasks/{taskId}`, `DELETE /tasks/{taskId}`), `quickstart.md` (US1 flow).
- FR-005..FR-007 (list/filter/sort) -> `data-model.md` (`TaskListQuery`), `contracts/openapi.yaml` (`GET /tasks` query params), `quickstart.md` (US2 flow).
- FR-008 (overdue/today distinction) -> `data-model.md` (`dueDate` + status rules), `contracts/openapi.yaml` (`dueWindow`), `quickstart.md` (US3 flow).
- FR-009 (persistence across sessions) -> `research.md` (SQLite + Prisma decision), `backend/prisma/` migration-backed storage path.

## Constitution Check (Post-Design Re-check)

- [x] Spec-first gate remains satisfied; design scope aligns with spec value statements.
- [x] Clarification gate remains satisfied; no unresolved unknowns after research/design.
- [x] Story independence gate remains satisfied by discrete API/UI increments per story.
- [x] Verification gate remains satisfied; per-story validation flows and test commands are defined.
- [x] Traceability gate remains satisfied via explicit FR-to-artifact mappings and concrete paths.

## Complexity Tracking

No constitution violations requiring justification.
