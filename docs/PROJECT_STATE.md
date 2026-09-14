# TypeFirst Verified Project State

This document records stable, verified facts about TypeFirst. It distinguishes the implemented baseline from accepted product direction and future plans.

---

## 1. Project Identification

- **Project Name**: TypeFirst
- **Repository URL**: https://github.com/Tachiguro/TypeFirst
- **Owner**: Tachiguro
- **Visibility**: Public
- **Default Branch**: `master`
- **Current Baseline**: `TF-WEB-001` — First-Family Web Shell, merged through PR #1 at `e524de1626802f037a97f23a059c09439c922169`.

---

## 2. Product Vision & Direction

TypeFirst is a lightweight, focused web typing trainer for fast, responsive, and distraction-free practice.

### Primary Goals

1. **German & English Typing Practice**: Practice material and sessions for both languages.
2. **Neo 2 as a First-Class Layout**: Native future support for the German ergonomic Neo 2 layout.
3. **Conventional Layout Support**: Support for conventional QWERTZ and QWERTY layouts.
4. **Low-Friction Sessions**: Instant-launch exercises optimized for short, high-frequency practice.
5. **Immediate Character-Level Feedback**: Real-time correctness and error feedback with minimal latency.
6. **Later Statistics & Progress Tracking**: Longitudinal metrics, speed, accuracy, error analysis, and weakness-targeted practice.

---

## 3. Accepted Platform & Architecture

- **Platform**: Web application.
- **Frontend**: React + TypeScript.
- **Build tooling**: Vite.
- **Package manager**: pnpm.
- **Styling**: Plain CSS using shared First-family design tokens.
- **Testing**: Vitest + React Testing Library.
- **Current application baseline**: One-screen responsive TypeFirst web shell.
- **Theme support**: System, light, and dark preferences.
- **Theme initialization**: Pre-paint resolution avoids an incorrect-theme flash.

---

## 4. First-Family Design Direction

TypeFirst reuses the shared First-family visual language derived from [KnownFirst](https://github.com/Tachiguro/KnownFirst) and [MathFirst](https://github.com/Tachiguro/MathFirst). The implemented direction includes a green-centered palette, light and dark semantic tokens, a 4px/8px spacing rhythm, the shared typography stack, focus-visible behavior, shared surface/border/card styling, and semantic success/error colors.

The sibling projects remain the authoritative visual references. TypeFirst uses a browser-appropriate application architecture rather than copying their native architecture.

---

## 5. Implemented Web-Shell Baseline

The current shell provides:

- React/Vite application foundation.
- First-family visual shell and responsive UI.
- Accessibility baseline and theme handling.
- Static German / English language selector.
- Static German QWERTZ / English QWERTY / Neo 2 layout selector.
- Static Characters / N-grams / Words / Sentences category selector.
- Static typing-surface preview and session metrics.
- Static Reset and Next controls.
- Shell and pre-paint theme tests.

---

## 6. Not Yet Implemented

The web shell does not yet include:

- Actual typing capture, a typing reducer/session engine, or a `KeyboardEvent` input adapter.
- Grapheme-safe/NFC text handling or wrong/correct character progression.
- Session timer, accuracy calculation, or CPM/WPM calculation.
- Exercise catalog, Neo 2 mappings, or QWERTZ/QWERTY mappings.
- Statistics/history, authentication, backend, deployment, or persistent progress tracking.

---

## 7. Next Planned Package Boundary

**Next planned implementation package**: `TF-ENGINE-001` — Usable Strict Typing Session.

This pending package is intended to add real typing input capture, deterministic strict typing-session behavior, character-level correctness feedback, normalization- and grapheme-safe text handling, reset/completion behavior, and one minimal German plus one minimal English exercise.

It must not be expanded prematurely into full keyboard-layout mapping, complete Neo 2 layers, large exercise corpora, persistent statistics, authentication, backend, or deployment. Those remain later work.
