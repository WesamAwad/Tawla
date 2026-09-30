# Task Workflow

Use this workflow for feature development and significant bug fixes.

## Phase 1 — Discover

Inspect the project.

Determine:

```text
Technology:
Architecture:
Relevant files:
Existing patterns:
Testing strategy:
Potential risks:
```

## Phase 2 — Plan

Create:

```text
Goal
Affected files
Implementation steps
Testing steps
```

Keep the plan proportional to the task.

## Phase 3 — Implement

Implement one logical change at a time.

After important changes, verify that the code remains consistent with the existing architecture.

## Phase 4 — Verify

Run the project's appropriate:

```text
Formatter
Linter
Static analysis
Unit tests
Integration tests
Build
```

Only run commands that are relevant and available in the project.

## Phase 5 — Review

Inspect the final diff.

Ask:

```text
Did I solve the actual requirement?
Did I modify unnecessary files?
Did I introduce duplication?
Did I break an existing pattern?
Are errors handled?
Are important edge cases covered?
Did verification pass?
```

## Final Report

Return:

```text
## Summary

...

## Files Changed

...

## Verification

...

## Remaining Issues

...
```
