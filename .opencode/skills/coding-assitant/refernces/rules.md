# Engineering Rules

## Architecture

Respect the architecture already present in the project.

Before creating a new:

* Service
* Repository
* Controller
* Provider
* Bloc
* Cubit
* GetX Controller
* Component
* Utility

search the project for existing equivalents.

Do not introduce a new architectural pattern unless there is a clear reason.

## Code Quality

Prefer:

* Small functions
* Clear names
* Single responsibility
* Reusable code
* Explicit error handling

Avoid:

* Huge classes
* Huge functions
* Duplicate logic
* Magic values
* Dead code
* Unnecessary abstractions

## Dependencies

Before adding a dependency:

1. Check whether the project already has a package that solves the problem.
2. Check the existing dependency file.
3. Prefer the existing project ecosystem.

Do not add a dependency for a simple problem that can be solved cleanly with existing code.

## Security

Never place secrets directly in source code.

Pay attention to:

* Authentication
* Authorization
* Input validation
* API security
* Sensitive data
* File uploads
* User permissions

## Changes

Only modify files relevant to the requested task.

If an unrelated problem is discovered, mention it instead of silently changing it.

## Testing

Tests should cover:

* Normal behavior
* Invalid input
* Important edge cases
* Failure scenarios

Do not create meaningless tests simply to increase coverage.
