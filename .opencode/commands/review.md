---

## description: Review the current code for bugs, architecture, security, quality, and maintainability.

# Code Review

Review the current project or the changes requested by the user.

User request:

$ARGUMENTS

## Instructions

Use the `coding-assistant` skill.

First inspect the current project and Git diff when available.

Review the code for:

### 1. Correctness

* Bugs
* Incorrect logic
* Missing conditions
* Incorrect API usage

### 2. Architecture

* Violations of the existing architecture
* Incorrect separation of responsibilities
* Unnecessary abstractions
* Business logic in inappropriate places

### 3. Code Quality

* Duplication
* Complex functions
* Poor naming
* Dead code
* Maintainability problems

### 4. Security

* Hardcoded secrets
* Authentication problems
* Authorization problems
* Unsafe input handling
* Sensitive data exposure

### 5. Performance

* Unnecessary API calls
* Unnecessary database queries
* Inefficient loops
* Memory problems

### 6. Testing

* Missing tests
* Missing edge cases
* Weak or meaningless tests

## Output

Return the review using this format:

```text
CODE REVIEW

Critical Issues:
- ...

Major Issues:
- ...

Minor Issues:
- ...

Positive Findings:
- ...

Recommended Actions:
- ...

Overall:
APPROVE / CHANGES REQUIRED
```

Do not modify code unless the user explicitly asks you to fix the identified issues.
