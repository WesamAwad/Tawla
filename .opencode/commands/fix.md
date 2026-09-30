---

## description: Investigate and fix a bug using a structured debugging workflow.

# Bug Fix

Fix the bug described by the user.

Bug description:

$ARGUMENTS

## Instructions

Use the `coding-assistant` skill.

Follow this process:

### 1. Reproduce

Understand the reported problem and identify how it can be reproduced.

### 2. Investigate

Inspect:

* Relevant source files
* Error messages
* Logs
* Related services
* API calls
* Database queries
* Existing tests

Do not assume the root cause.

### 3. Identify Root Cause

Clearly determine why the problem happens.

Before changing code, briefly explain:

```text
Root Cause:
...
```

### 4. Plan

Create a short plan for fixing the root cause.

### 5. Implement

Make the smallest change that correctly fixes the problem.

Do not rewrite unrelated code.

### 6. Verify

Run the relevant:

* Tests
* Static analysis
* Formatter
* Build
* Other project checks

### 7. Regression Check

Make sure the fix does not break existing behavior.

### 8. Final Report

Return:

```text
BUG FIX

Root Cause:
...

Solution:
...

Files Changed:
...

Verification:
...

Remaining Issues:
...
```

Do not claim that the bug is fixed if verification fails.
