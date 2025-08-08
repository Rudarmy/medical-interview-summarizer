Cleanup done:

- [x] Scrubbed API key from guides and code
- [x] Replaced .env secrets with placeholders
- [x] Added .gitignore rules to block env files
- [ ] Remove test and demo files (pending manual selection)
- [ ] Optionally remove mockups/ if not needed for client

Recommended next steps:
1. Rotate your Google Gemini API key in AI Studio.
2. Purge the old key from Git history (BFG or git filter-repo).
3. Force-push sanitized history to GitHub.
4. Verify no secrets remain by scanning the repo again.
