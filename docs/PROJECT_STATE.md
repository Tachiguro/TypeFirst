# TypeFirst Verified Project State

This document records stable, verified facts about TypeFirst. It distinguishes the implemented baseline from accepted product direction and future plans.

---

## 1. Project Identification

- **Project Name**: TypeFirst
- **Repository URL**: https://github.com/Tachiguro/TypeFirst
- **Owner**: Tachiguro
- **Visibility**: Public
- **Default Branch**: `master`
- **Current Baseline**: `TF-LAYOUT-001` — Language and Layout Catalog, merged through PR #5 at `c5d84c2431eecfec74690d0c01f3b8999cffd472`.

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

## 5. Implemented Engine, Catalog & Shell Baseline

The current baseline (`TF-LAYOUT-001`) provides:

### Session Engine & State Machine
- Deterministic session states: `idle`, `running`, and `completed`.
- First printable input attempt triggers the running timer.
- Strict retry-in-place error behavior: incorrect input halts cursor advancement and flags the target character as errored until correctly resolved.
- Correct retry advances the target position.
- Backspace clears only the active error character; accepted text cannot be rewound.
- Mistakes remain represented in accuracy because printable attempts are retained.
- Completion freezes elapsed time and marks the session completed.
- Reset restarts the current exercise.
- Next deterministically cycles between available exercises.

### Text Handling & Internationalization
- NFC normalization across all input and exercise texts.
- Grapheme segmentation using `Intl.Segmenter` for combining characters and ZWJ sequences.
- Explicit scoreable space rendering and verification.
- Accessible fallback notice when running on browsers lacking `Intl.Segmenter` support.

### Browser Input Handling & Scoring Invariant
- Scores logical committed browser text from `input` and finalized composition events rather than printable `keydown`.
- Intermediate IME composition strings are not scored.
- Composition commits are deduplicated and scored cleanly.
- Dead keys and composition sequences do not produce premature input scoring.
- Paste, drag-and-drop, and replacement/autocorrect insertions are rejected.
- **Non-Emulation Architecture**: The layout catalog is reference and training metadata only. The browser and operating system remain authoritative for logical input; TypeFirst does not translate physical key codes into scored characters, synthesize dead-key composition, or emulate operating-system keyboard layouts.

### Language & Layout Catalog (`src/catalog`)
- **Domain Model**: Strongly typed `LanguageId` (`'de' | 'en'`), `KeyboardLayoutId` (`'de-qwertz' | 'en-qwerty' | 'de-neo2'`), constrained `PhysicalKeyCode` covering the alphanumeric typing block, ISO extra key (`<LSGT>`), and bounding modifiers, and a `KeyBehavior` discriminated union (`text`, `dead-key`, `action`, `keypad`, `modifier`, `unmapped`).
- **Canonical Languages**:
  - German (`de`): display name "German", locale `de-DE`, default layout `de-qwertz`.
  - English (`en`): display name "English", locale `en-US`, default layout `en-qwerty`.
- **Canonical Layouts**:
  - German QWERTZ (`de-qwertz`): Standard German PC ISO profile (DIN 2137 T1 / `symbols/de basic`) with Base, Shift, and AltGraph layers, and dead-key metadata.
  - English QWERTY (`en-qwerty`): Standard US ANSI 104-key profile (`symbols/us basic`) with Base and Shift layers.
  - German Neo 2 (`de-neo2`): Ergonomic layout modeling 6 conceptual layers mapped explicitly from XKB levels, Mod3 (`CapsLock`, `Backslash`) and Mod4 (`IntlBackslash`, `AltRight`) reference activators, Layer 4 navigation action semantics, Layer 4 embedded numeric keypad semantics, and Layers 5–6 Greek/mathematical reference metadata.
- **Text Behavior Invariants**: All `text` behavior outputs are non-empty, NFC-normalized, and represent exactly one grapheme cluster.

### Real-Time Metrics & Feedback
- Progress percentage based on completed graphemes.
- Elapsed time clock (formatted as mm:ss) updated during running sessions.
- Real-time Accuracy percentage reflecting accepted units divided by total printable attempts.
- Real-time Characters Per Minute (CPM) and Words Per Minute (WPM = CPM / 5).

### Controls & Exercises
- Minimal exercise catalog: one German sentence and one English sentence in the Sentences category.
- Catalog-backed language and layout selectors using canonical IDs.
- Language switcher updates current exercise and resets session while preserving the currently selected keyboard layout.
- Keyboard layout selector operates as reference metadata and preserves active typing session progress, timer, and metrics.
- Functional Reset and Next controls.

---

## 6. Not Yet Implemented

The current baseline intentionally does not yet include:

- Physical keyboard visualization and dynamic finger placement guidance.
- Visual or interactive training presentation of Neo 2 layers.
- Expanded exercise corpora (Characters, N-grams, Words, and multi-sentence catalogs).
- Adaptive weakness training and error-focused exercise generation.
- Persistent session history, local storage continuity, or progress analytics.
- Backend services, databases, or user authentication.
- Static-hosting configuration (GitHub Pages) or PWA manifest/service worker.

---

## 7. Next Package Boundaries

- **Next planned product package**: `TF-SESSION-001` — Metrics and Local Continuity (planned/pending; not active).
- **Later browser/hosting package**: `TF-BROWSER-001` — Browser and Static-Hosting Readiness.

None of these packages are currently active. Implementation must only proceed upon explicit dispatch of the respective lifecycle package.
