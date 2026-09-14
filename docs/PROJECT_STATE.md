# TypeFirst Verified Project State

This document records stable, verified facts about TypeFirst. It distinguishes the implemented baseline from accepted product direction and future plans.

---

## 1. Project Identification

- **Project Name**: TypeFirst
- **Repository URL**: https://github.com/Tachiguro/TypeFirst
- **Owner**: Tachiguro
- **Visibility**: Public
- **Default Branch**: `master`
- **Current Baseline**: `TF-ENGINE-001` — Usable Strict Typing Session, merged through PR #3 at `c74706ab1158dfbf87b0320039e6fee41362e45f`.

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
- **Application baseline**: One-screen responsive TypeFirst web application with active strict typing engine.
- **Theme support**: System, light, and dark preferences.
- **Theme initialization**: Pre-paint resolution avoids an incorrect-theme flash.

### Hosting & Installability Direction

- **Web Delivery**: TypeFirst remains a normal web application intended for static public hosting via GitHub Pages (planned, not implemented).
- **PWA Installability**: The web app will support Progressive Web App (PWA) installation to allow launching from desktop/start-menu/dock icons like a native application (planned, not implemented).
- **Native Applications**: No separate native Windows or macOS wrappers are currently planned; local dev-server startup is not an end-user delivery mechanism.
- **Service Worker / Offline**: Offline caching and service worker strategies are not yet decided or implemented.

---

## 4. First-Family Design Direction

TypeFirst reuses the shared First-family visual language derived from [KnownFirst](https://github.com/Tachiguro/KnownFirst) and [MathFirst](https://github.com/Tachiguro/MathFirst). The implemented direction includes a green-centered palette, light and dark semantic tokens, a 4px/8px spacing rhythm, the shared typography stack, focus-visible behavior, shared surface/border/card styling, and semantic success/error colors.

The sibling projects remain the authoritative visual references. TypeFirst uses a browser-appropriate application architecture rather than copying their native architecture.

---

## 5. Implemented Engine & Shell Baseline

The current baseline (`TF-ENGINE-001`) provides:

### Session Engine & State Machine
- Deterministic session states: `idle`, `running`, and `completed`.
- First printable input attempt triggers the running timer.
- Strict retry-in-place error behavior: incorrect input halts cursor advancement and flags the target character as errored until correctly resolved.
- Correct retry advances the target position.
- Backspace clears only the active error character; accepted text cannot be rewound.
- Mistakes persist in accuracy and error count metrics.
- Completion freezes elapsed time and marks the session completed.
- Reset restarts the current exercise.
- Next deterministically cycles between available exercises.

### Text Handling & Internationalization
- NFC normalization across all input and exercise texts.
- Grapheme segmentation using `Intl.Segmenter` for combining characters and ZWJ sequences.
- Explicit scoreable space rendering and verification.
- Accessible fallback notice when running on browsers lacking `Intl.Segmenter` support.

### Browser Input Handling
- Scores logical text from committed browser input (`beforeinput` / `input`) rather than raw `keydown`.
- Intermediate IME composition strings are not scored.
- Composition commits are deduplicated and scored cleanly.
- Dead keys are ignored during composing.
- Paste, drag-and-drop, and replacement/autocorrect insertions are rejected.

### Real-Time Metrics & Feedback
- Progress percentage based on completed graphemes.
- Elapsed time clock with millisecond precision tracking.
- Real-time Accuracy percentage reflecting total attempts vs. errors.
- Real-time Characters Per Minute (CPM) and Words Per Minute (WPM = CPM / 5).

### Controls & Exercises
- Minimal exercise catalog: one German sentence and one English sentence.
- Functional language switcher (German / English) updating current exercise text.
- Keyboard layout selector present as metadata (currently does not emulate OS keyboard mappings).
- Category selector currently exposing the Sentences category.
- Functional Reset and Next controls.

---

## 6. Not Yet Implemented

The current baseline intentionally does not yet include:

- Full language and layout catalog.
- Real QWERTZ and QWERTY mapping metadata and validation logic.
- Neo 2 first-class key mapping, visual representation, and layer switching (Layers 1–6).
- Physical keyboard visualization and dynamic finger placement guidance.
- Expanded exercise corpora (Characters, N-grams, Words, and multi-sentence catalogs).
- Adaptive weakness training and error-focused exercise generation.
- Persistent session history, local storage continuity, or progress analytics.
- Backend services, databases, or user authentication.
- Static-hosting configuration (GitHub Pages) or PWA manifest/service worker.

---

## 7. Next Package Boundaries

- **Next planned product package**: `TF-LAYOUT-001` — Language and Layout Catalog (planned/pending; not active).
- **Later package**: `TF-SESSION-001` — Metrics and Local Continuity.
- **Later browser/hosting package**: `TF-BROWSER-001` — Browser and Static-Hosting Readiness.

None of these packages are currently active. Implementation must only proceed upon explicit dispatch of the respective lifecycle package.
