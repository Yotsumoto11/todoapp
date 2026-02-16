<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Spec-First Value Definition
  - Template Principle 2 -> II. Constitution-Gated Planning
  - Template Principle 3 -> III. Story-Scoped Independent Delivery
  - Template Principle 4 -> IV. Verification by Explicit Criteria
  - Template Principle 5 -> V. End-to-End Traceability
- Added sections:
  - Operational Constraints
  - Workflow & Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md (directory not present)
- Deferred TODOs:
  - None
-->
# Sample Spec Kit Constitution

## Core Principles

### I. Spec-First Value Definition
Every feature MUST begin with a specification that defines prioritized user stories,
testable acceptance scenarios, measurable success criteria, and bounded scope. The
specification MUST describe user value and business outcomes, not implementation details.
Rationale: this prevents premature design lock-in and keeps delivery aligned to user impact.

### II. Constitution-Gated Planning
Implementation plans MUST pass a documented Constitution Check before research and again
after design artifacts are produced. Any unresolved clarification or constitution violation
MUST block progression until resolved or explicitly justified in a complexity record.
Rationale: early and repeated gate checks prevent invalid plans from propagating into tasks.

### III. Story-Scoped Independent Delivery
Work MUST be organized by user story so each story is independently implementable,
verifiable, and demonstrable. Delivery MUST prioritize P1/MVP first, then add lower
priority stories without regressing earlier value slices.
Rationale: independent increments reduce integration risk and accelerate feedback.

### IV. Verification by Explicit Criteria
Each story MUST define an independent test or validation path before implementation
tasks are considered complete. If tests are requested by the user or specification,
test tasks MUST be authored first and MUST fail before implementation begins.
Rationale: explicit verification criteria make quality outcomes auditable and repeatable.

### V. End-to-End Traceability
Requirements, plan artifacts, and tasks MUST maintain traceable links across files with
clear identifiers and concrete paths. Constitution conflicts are always critical and MUST
be corrected in spec/plan/tasks or escalated as a constitution amendment.
Rationale: traceability enables consistent reviews and deterministic handoffs.

## Operational Constraints

- The repository templates in `.specify/templates/` are normative sources for generated
  artifacts and MUST remain synchronized with this constitution.
- Specifications MUST avoid language/framework/API implementation details.
- Plans MUST resolve all `NEEDS CLARIFICATION` items before Phase 1 design output.
- Tasks MUST include exact file paths and dependency ordering needed for execution.

## Workflow & Quality Gates

1. Specification Gate: `spec.md` includes prioritized stories, acceptance scenarios,
   edge cases, functional requirements, and measurable success criteria.
2. Planning Gate: `plan.md` includes Technical Context, Constitution Check outcomes,
   and design artifacts that satisfy all constitutional principles.
3. Tasking Gate: `tasks.md` is organized by story, includes executable file paths, and
   preserves independent testability per story.
4. Review Gate: any constitution non-compliance found during analysis/review MUST be
   marked as blocking until remediated or formally amended.

## Governance
This constitution supersedes conflicting workflow guidance in templates and prompt files.
Amendments require: (1) proposed change with rationale, (2) explicit version bump decision
using the policy below, (3) synchronization updates to affected templates, and
(4) a Sync Impact Report recorded in the constitution update.

Versioning policy:
- MAJOR: remove or redefine a core principle in a backward-incompatible way.
- MINOR: add a new principle/section or materially expand mandatory guidance.
- PATCH: clarifications, wording refinements, typo fixes, or non-semantic updates.

Compliance review expectations:
- Every planning and analysis pass MUST evaluate constitution compliance explicitly.
- Violations MUST be resolved before implementation proceeds.
- Deferred items MUST be tracked as explicit TODOs in the constitution report.

**Version**: 1.0.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-16
