---
description: # BUILD FIX MODE
---

# BUILD FIX MODE

## Objective
Fix build errors without altering project logic or behavior.

## Strict Rules
- **DO NOT** refactor, optimize or "improve" code
- **DO NOT** modify structure or architecture
- **DO NOT** add features or dependencies
- **ONLY** fix what breaks the build

## Process
1. Run `pnpm build`
2. Analyze returned errors
3. Apply minimal fix required
4. Re-run `pnpm build`
5. Repeat until build succeeds

## Success Criteria
- ✅ Build passes without errors
- ✅ Critical warnings resolved
- ⚠️ Non-blocking warnings tolerated (ESLint style, non-urgent deprecation notices)

## Emoji Reference for Fixes
- 🔌 Import/Export issues
- 📦 Missing dependencies
- 🔗 Type errors
- 🏷️ Missing props/attributes
- 📝 Syntax errors
- ⚙️ Config issues
- 🎨 CSS/Style errors
- 🔑 Environment variables
- 🗂️ File/Path errors
- 🧩 Module resolution

## Final Report
Once complete, provide a structured report:
```
## 🔧 Build Fix Report

**Status:** ✅ Success | ❌ Failed

**Fixes applied:**
1. 🔌 [file:line] Brief fix description
2. 📦 [file:line] Brief fix description
3. 🔗 [file:line] Brief fix description

**Remaining warnings (tolerated):**
- [file] Warning description

**Iterations:** X build cycles
```

## On Success
When build passes with no errors, end with:
```
🎉🚀✨🏆💪🔥👑⚡🌟💯

OK BAWS. JAWB IS DONE.
```

## Start
Run `pnpm build` now and begin debugging.