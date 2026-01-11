# AGENTS

**IMPORTANT**: Always read this file before starting any task in this repo.

**Note**: This file provides universal guidance for all AI assistants (Claude, Gemini, ChatGPT, Cursor, Copilot, etc.).

## Critical Instructions

- **Multi-app repository**: This repo can host multiple apps. The main website lives in `web/`.
- **READ FIRST**: For website work, read `web/AGENTS.md` for comprehensive instructions.
- **ALWAYS** read README files and strictly follow their indications.
- **ALWAYS** use pnpm only (no npm, no yarn).

## Workflows

When you need to do something specific, **ALWAYS** use the predefined workflows:
- **AI workflows**: `.agent/workflows/`
- **Fix build workflow**: `.agent/workflows/fixb.md`
- **Build Error Checking**: When asked to check build errors, fix build issues, or test the build, **ALWAYS** use the `fixb` workflow instead of running `pnpm build` directly.

## App-Specific Instructions

- **Website** (main app): See `web/AGENTS.md` for comprehensive instructions
- **Other apps**: Check respective folders for AGENTS.md files (if they exist)

---

**Migration note**: Platform-specific instruction files (CLAUDE.md, GEMINI.md) have been removed. All AI platforms now use this unified AGENTS.md file.
