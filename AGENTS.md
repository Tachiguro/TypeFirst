# TypeFirst Agent Governance Rules

This document defines the universal repository invariants and governance rules for all autonomous agents and human contributors working on **TypeFirst**. All repository-writing agents MUST read this file before performing any repository modifications.

---

## 1. Core Invariants & Technical Truth

1. **Repository Truth**: Live Git and GitHub repository state is the absolute technical truth. It strictly overrides chat history, handoffs, remembered context, assumptions, and previous agent reports.
2. **Direct Verification Required**: Always directly verify the real repository state before undertaking any state-dependent work. Never assume state from conversational memory.
3. **Canonical Checkout**: All work is performed in the single canonical local checkout at `C:\Dev\TypeFirst` by default.
4. **Single Normal Worktree**: Exactly one normal Git worktree is used. Do not create additional worktrees or repository clones without explicit user approval.
5. **Single Writing Agent**: Exactly one repository-writing agent may operate at a time. Parallel changes, writing subagents, and background repository writers are strictly forbidden without explicit user approval.
6. **Prefer Small Vertical Work Packages**: Keep changes focused, incremental, and bounded within a single responsibility.
7. **Default Branch Protection**: Never author, implement, or commit changes directly on the default branch (`master`). All changes must be developed on a dedicated task branch and integrated via Pull Request.
8. **Protect Pre-Existing Work**: Never overwrite, discard, or silently delete pre-existing local files, uncommitted edits, or unknown branches without necessity and explicit authorization.
9. **Approved Plan Required**: Any non-trivial code or documentation change requires a prior `PLAN_ONLY` phase and approval before implementation.

---

## 2. Non-Delegable & Prohibited Operations

Without explicit, affirmative user approval, agents must **NEVER** perform:
- Merging a Pull Request (manual merge on GitHub is performed exclusively by the user)
- Enabling auto-merge on GitHub
- Branch deletion (local or remote)
- Worktree deletion
- Release creation or tag publication
- Deployment or publishing
- Binary packaging
- Android Debug Bridge (ADB), device actions, emulator actions, or GUI automation
- Destructive Git operations:
  - `git reset` (soft, mixed, or hard)
  - `git clean`
  - `git stash`
  - `git rebase`
  - `git commit --amend`
  - History rewriting of any kind
  - Force-pushing (`git push --force`, `git push -f`, `--force-with-lease`)

---

## 3. Strict Staging Policy

- **Never** use `git add .` or `git add -A`.
- **Never** use wildcard or glob patterns that risk staging unintended files.
- Stage only **explicit, individual file paths** during commit operations.

---

## 4. Supported Lifecycle Modes

Agents operate in strictly isolated, single-responsibility lifecycle modes:

- `PLAN_ONLY` — Research, design, and formulate an implementation plan without modifying project code or running state-mutating commands.
- `IMPLEMENT` — Execute an approved plan or slice of code/feature work.
- `TEST_ONLY` — Run automated test suites and verify correctness without modifying source files.
- `REVIEW_ONLY` — Perform code review, static analysis, and verification of completed changes.
- `DOCUMENT_ONLY` — Reconcile and update project documentation, changelogs, and state files.
- `COMMIT_ONLY` — Stage verified individual files and author an isolated Git commit.
- `FULL_VALIDATION` — Run comprehensive test and build validation gates against candidate HEAD.
- `PUSH_ONLY` — Push candidate branch commits to origin without creating PRs.
- `PR_ONLY` — Author and open a GitHub Pull Request for a validated branch.
- `POST_MERGE_SYNC_ONLY` — Synchronize local `master` with upstream `origin/master` after user merge, and prune stale tracking references.

An agent prompt executes exactly one primary mode and must not silently roll into subsequent lifecycle phases without instructions.

---

## 5. Design & Brand Family Alignment

TypeFirst visually belongs to the same product family as:
- **KnownFirst** (`https://github.com/Tachiguro/KnownFirst`)
- **MathFirst** (`https://github.com/Tachiguro/MathFirst`)

These repositories are authoritative reference sources for:
- Color palettes and theme tokens
- Typography and font scaling
- Spacing and grid metrics
- Visual hierarchy and layout rhythm
- Component styling and interactive feedback states
- Naming conventions where applicable

Do not invent independent branding if equivalent design tokens can be derived from the First family. Application architecture, however, must be appropriate for a web-based application and should not be copied blindly from native platforms.

---

## 6. Language & Communication Baseline

- **User-Facing Orchestration**: German.
- **Coding-Agent Prompts**: English.
- **Coding-Agent Technical Reports**: English.
- **Code & Documentation**: English.

---

## 7. Documentation Matrix

- [docs/NEW_CHAT_BOOTSTRAP.md](docs/NEW_CHAT_BOOTSTRAP.md) — Session discovery protocol and capability gating.
- [docs/CURRENT_WORK.md](docs/CURRENT_WORK.md) — Transient operational context for active in-flight work.
- [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) — Authoritative record of verified project state and product direction.
