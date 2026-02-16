# Phase 0 Research: TODO Management Web App

## Decision 1: Web stack and runtime
- Decision: Use TypeScript with Node.js 22 LTS, React frontend, and Express backend.
- Rationale: Widely adopted stack with low onboarding cost, fast iteration speed, and good testing support.
- Alternatives considered:
  - Next.js full-stack: strong default conventions but unnecessary coupling for this small scoped feature.
  - Python FastAPI + separate frontend: also viable but would increase context switching for a single feature.

## Decision 2: Data persistence
- Decision: Use SQLite with Prisma for schema management and persistence.
- Rationale: Single-user scope and modest scale fit embedded storage; Prisma provides validation and migration discipline.
- Alternatives considered:
  - PostgreSQL: over-provisioned for initial single-user release.
  - File-only JSON storage: simplest but weak consistency and query ergonomics for filter/sort features.

## Decision 3: API style
- Decision: Use REST endpoints with explicit query parameters for filtering and sorting.
- Rationale: Direct mapping from FR requirements to resource operations and easy contract testing.
- Alternatives considered:
  - GraphQL: flexible query shape but adds complexity not needed for current domain size.
  - RPC endpoints: concise server implementation but weaker resource semantics for future extensibility.

## Decision 4: Validation and error handling
- Decision: Centralize request validation with Zod schemas and standardized error payloads.
- Rationale: Prevents invalid task data (title length, due date format, priority range) and keeps client behavior predictable.
- Alternatives considered:
  - Manual per-route validation: lower initial setup but higher drift risk and duplicated rules.

## Decision 5: Test strategy
- Decision: Combine unit tests (domain logic), integration tests (API behavior), and e2e smoke tests (critical flow).
- Rationale: Matches constitution verification principle while keeping test cost proportional to feature complexity.
- Alternatives considered:
  - Unit-only tests: insufficient coverage for API contract and UI-user journey fit.
  - Extensive e2e-only tests: slower feedback and harder root-cause isolation.
