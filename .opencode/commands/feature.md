---

## description: Implement a new feature using the coding-assistant workflow.

# Feature Development

Implement the feature requested by the user.

User request:

$ARGUMENTS

## Instructions

Use the `coding-assistant` skill.

Follow this workflow:

1. Inspect the existing project before changing anything.
2. Understand the current architecture and existing implementation.
3. Identify the files and components related to the requested feature.
4. Create a short implementation plan.
5. Implement the smallest clean solution.
6. Reuse existing code and patterns whenever possible.
7. Do not modify unrelated files.
8. Run the appropriate formatter, analyzer, tests, or build checks.
9. Review the final changes.
10. Report what was changed and what verification was performed.

## Important

Do not introduce a new architecture or dependency unless it is necessary.

Do not consider the task complete if relevant verification fails.
