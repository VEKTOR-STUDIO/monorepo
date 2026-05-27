# Code Review Examples

Reference for the code-review skill.

## Example 1: Security finding

**Snippet:**
```javascript
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

**Feedback:**
- **Critical**: Use parameterized queries to avoid SQL injection. Replace with placeholders and pass `userId` as a parameter.

## Example 2: Suggestion

**Snippet:**
```javascript
function processData(data) {
  // 80 lines of mixed validation, transform, and side effects
}
```

**Feedback:**
- **Suggestion**: Split into smaller functions (e.g. `validateInput`, `transformData`, `saveResult`) for readability and testability.

## Example 3: Nice to have

**Snippet:**
```javascript
if (user.role === "admin" || user.role === "superadmin") { ... }
```

**Feedback:**
- **Nice to have**: Consider a helper like `user.isAdmin()` or a constant list of admin roles to avoid repetition.
