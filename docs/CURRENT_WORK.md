# TypeFirst Current Operational Work

This document provides operational context for the active in-flight package.

> [!IMPORTANT]
> This document provides transient operational evidence only. **Live Git and GitHub repository state always takes precedence** over the contents of this file. Newly initialized sessions must inspect live state first (see [docs/NEW_CHAT_BOOTSTRAP.md](NEW_CHAT_BOOTSTRAP.md)).

---

## 1. Active Package Details

- **Active Package ID**: `TF-BOOT-001`
- **Title**: Initial Repository Baseline and Project Bootstrap
- **Type**: `Bootstrap / Chore`
- **Active Branch**: `master`
- **Base / Target**: `master`
- **Implementation**: Establishing `.gitignore`, `README.md`, `AGENTS.md`, and foundational `docs/`.
- **Current Lifecycle**: `IMPLEMENT` (completing initial bootstrap commit and push).
- **Next Lifecycle**: `PLAN_ONLY` (Design system extraction and web-app architecture definition).

---

## 2. Package Purpose and Bootstrap Scope

The purpose of `TF-BOOT-001` is to bootstrap TypeFirst as a new GitHub-backed repository with a clean baseline, essential governance rules, and product state documentation.

### Authorized Scope
1. **`.gitignore`**: Ignore OS files, IDE configs, build artifacts, web dependencies, local DBs, and environment files.
2. **`README.md`**: Project overview, status, reference repositories, and core goals.
3. **`AGENTS.md`**: Universal repository invariants, lifecycle isolation, non-delegable operations, and staging policies.
4. **`docs/NEW_CHAT_BOOTSTRAP.md`**: Discovery and re-anchoring protocol for new chat sessions.
5. **`docs/CURRENT_WORK.md`**: Operational context for the active bootstrap package.
6. **`docs/PROJECT_STATE.md`**: Initial product direction, layout requirements, and design family reference.

---

## 3. Downstream Boundaries

- **No Application Code**: Do not implement typing logic, layouts, scoring, or UI components.
- **No Premature Framework Selection**: Do not install heavy dependencies or configure build tooling during bootstrap.
- **No Autonomous Expansion**: The next step must be an explicit `PLAN_ONLY` package to inspect KnownFirst/MathFirst design tokens and define the minimal web architecture.
