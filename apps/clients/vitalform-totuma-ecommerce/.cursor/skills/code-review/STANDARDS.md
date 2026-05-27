# Coding Standards (Reference)

Use this when the agent needs detailed criteria for the code review skill.

## Security

- Validate and sanitize all user input
- Use parameterized queries; never concatenate SQL
- Escape output to prevent XSS
- Check auth before sensitive operations

## Structure

- Single responsibility per function
- Prefer small, focused modules
- Avoid deep nesting (max 3–4 levels)

## Error Handling

- Use try/catch where failures are expected
- Return meaningful error messages to callers
- Log errors with context; avoid logging secrets

## Testing

- Unit tests for business logic
- Integration tests for API and DB flows
- Edge cases and error paths covered
