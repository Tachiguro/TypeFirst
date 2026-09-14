# TypeFirst Current Operational Work

This document records the stable operational state after the completed documentation reconciliation.

> [!IMPORTANT]
> This document provides transient operational evidence only. **Live Git and GitHub repository state always takes precedence** over the contents of this file. Newly initialized sessions must inspect live state first (see [docs/NEW_CHAT_BOOTSTRAP.md](NEW_CHAT_BOOTSTRAP.md)).

---

## 1. Completed Packages

- **`TF-BOOT-001`** — Initial Repository Baseline and Project Bootstrap
- **`TF-WEB-001`** — First-Family Web Shell (PR #1, merge commit `e524de1626802f037a97f23a059c09439c922169`)
- **`TF-DOC-001`** — Post-Web-Shell State Reconciliation (PR #2, merge commit `7cd8af21b49a1031f7afd2d093f88794cb6100eb`)
- **`TF-ENGINE-001`** — Usable Strict Typing Session
  - **Pull Request**: PR #3 (`feat: add strict typing session engine`)
  - **Feature Commit**: `db95aa8720d0c44e8f651481dcaf8e26519dc17c`
  - **Merge Commit**: `c74706ab1158dfbf87b0320039e6fee41362e45f`
  - **Target**: `master`
  - **Verification**: `REVIEW_ONLY` PASS, `FULL_VALIDATION` PASS
- **`TF-LAYOUT-001`** — Language and Layout Catalog
  - **Pull Request**: PR #5 (`feat: add language and layout catalog`)
  - **Feature Commit**: `0f22d16c3fa7571b36a5a172bf40f77f22e858d0`
  - **Merge Commit**: `c5d84c2431eecfec74690d0c01f3b8999cffd472`
  - **Target**: `master`
  - **Verification**: `REVIEW_ONLY` PASS, `FULL_VALIDATION` PASS

---

## 2. Current Stable Baseline

- `master` contains a usable strict typing session alongside the typed language and layout catalog (`src/catalog`).
- Canonical languages: German (`de`) and English (`en`).
- Canonical layout IDs: `de-qwertz`, `en-qwerty`, and `de-neo2`.
- Reference profiles: German PC ISO QWERTZ, US ANSI QWERTY, and German Neo 2 (conceptual Layers 1–6, Mod3/Mod4 activators, navigation action semantics, and embedded numeric keypad semantics).
- Practice controls: Catalog-backed language and layout selectors; changing layout preserves active typing session progress and metrics as reference metadata.
- Scoring architecture: Browser/OS logical text remains authoritative for scoring; TypeFirst does not emulate or alter the operating-system keyboard layout.
- There is currently no active product implementation package.

---

## 3. Next Planned Product Package

- **Next planned package**: `TF-SESSION-001` — Metrics and Local Continuity.
- **Status**: Planned and pending; not active and not dispatched.

`TF-SESSION-001` must remain pending until explicitly dispatched through its required lifecycle. Implementation has not started.
