# Antigravity Development Rules

## 1. Automated Testing Protocol
**Rule**: Before confirming any development task or reporting status to the user, you MUST write and execute a self-verification test case in the background.
**Procedure**:
1.  Identify the critical path or functionality being modified.
2.  Write a targeted Playwright test or unit test (e.g., in `tests/` or `src/specs/`).
3.  Execute the test securely in the background.
4.  Only proceed to converse with the user if the test passes.
5.  If the test fails, debug and fix the issue *before* responding, or report the specific failure details.

## 2. Server Connectivity
- Ensure the dev server is accessible via standard ports (`http://localhost:5173`).
- Verify IPv4/IPv6 compatibility (`host: true` in vite config).
