---
description: # BUILD/FIX/PUSH/CHECK TO PRODUCTION
---

🚀 BUILD / FIX / PUSH / CHECK TO PRODUCTION

⸻

🎯 Objective

Fix build errors without altering project logic or behavior, then deploy to production and verify deployment success.

⸻

🛑 Strict Rules

❌ DO NOT refactor, optimize, or “improve” code
❌ DO NOT modify structure or architecture
❌ DO NOT add features or dependencies
✅ ONLY fix what breaks the build

🔢 MAX 10 iterations
If exceeded, STOP and report:
MANUAL INTERVENTION REQUIRED

⸻

🚨 Warning Classification

🚫 BLOCKING (must fix)
	•	TypeScript errors
	•	Missing exports / imports
	•	Runtime errors
	•	Build-breaking syntax errors

✅ TOLERATED (ignore)
	•	ESLint style warnings
	•	Deprecation notices (non-urgent)
	•	Unused variable warnings
	•	Formatting warnings

⸻

🧭 Process

⸻

🧱 Phase 1: Build Fix
	1.	Run pnpm build
	2.	Analyze returned errors
	3.	Apply minimal fix required
	4.	Re-run pnpm build
	5.	Repeat until build succeeds (max 10 iterations)

✅ When the build is fixed
	•	Send exactly 3 relevant emojis in the chat (alone on their own line)
	•	Then, in the next chat message, tell in chat:

BAWS ! BUILD IZ FIXED !

⸻

🚀 Phase 2: Deploy to Production
	1.	Run pnpm build one final time (sanity check)
	2.	Commit changes with a descriptive message + emoji
	3.	Push to remote repository

✅ When the push is completed
	•	Send exactly 3 relevant emojis in the chat (alone on their own line)
	•	Then, in the next chat message, tell in chat:

BAWS ! I PUSHED TO GITZUB !

⸻

🔍 Phase 3: Verify Production
	1.	Poll Vercel deployment status every 15s (max 5 minutes)
	2.	Verify deployment state is READY
	3.	HTTP GET on production URL → expect 200 OK
(non-blocking, report only)

✅ When production is verified
	•	Send exactly 3 relevant emojis in the chat (alone on their own line)
	•	Then, in the next chat message, tell in chat:

BAWS ! WEBSITE IS ON VERCEL !

⸻

😎 Emoji Reference for Fixes

🔌 Import / Export issues
📦 Missing dependencies
🔗 Type errors
🏷️ Missing props / attributes
📝 Syntax errors
⚙️ Config issues
🎨 CSS / Style errors
🔑 Environment variables
🗂️ File / Path errors
🧩 Module resolution

⸻

🧾 Commit Message Format

[Emoji] Fix build: brief description of what was fixed

Example:
🔗 Fix build: resolve type errors in ModelViewer component

⸻

📊 Final Report

🔧 Build Fix & Deployment Report

Build Status:
✅ Success | ❌ Failed

Deployment Status:
✅ READY | ⏳ Building | ❌ Error

Health Check:
✅ 200 OK | ⚠️ [status code] (non-blocking)

⸻

🛠️ Fixes applied

🔌 [file:line] Brief fix description
📦 [file:line] Brief fix description
🔗 [file:line] Brief fix description

⸻

⚠️ Remaining warnings (tolerated)

[file] Warning description

⸻

🌍 Deployment details

Commit SHA: [sha]
Deployment ID: [id]
Production URL: [url]
Deployment Status: READY | ERROR
HTTP Status: 200 | xxx
Iterations: X / 10 build cycles
Total time: ~X minutes

⸻

🏁 On Success
	•	Send the following in chat (single message):

🎉🚀✨🏆💪🔥👑⚡🌟💯
OK BAWS. JAWB IS DONE. GREAT SUCCESS

⸻

🚨 On Max Iterations Exceeded

⚠️ MANUAL INTERVENTION REQUIRED

Build could not be fixed after 10 iterations.
Last error: [error message]
Files modified: [list]

Please review manually.

⸻

▶️ Start

Run pnpm build now and begin the build / fix / push / check cycle.