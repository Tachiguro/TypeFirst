# TypeFirst Verified Project State

This document records stable, verified facts about TypeFirst. It distinguishes verified current state from accepted target architecture and product direction.

---

## 1. Project Identification

- **Project Name**: TypeFirst
- **Repository URL**: https://github.com/Tachiguro/TypeFirst
- **Owner**: Tachiguro
- **Visibility**: Public
- **Default Branch**: `master`
- **Current Status**: Repository baseline initialized; initial bootstrap package `TF-BOOT-001` in progress.

---

## 2. Product Vision & Direction

TypeFirst is a lightweight, focused, web-based typing trainer built to provide fast, responsive, and distraction-free typing practice.

### Primary Goals
1. **German & English Typing Practice**: Tailored practice corpora, word lists, n-grams, and sentences for both languages.
2. **Neo 2 as a First-Class Layout**: Deep native support for the German ergonomic Neo 2 keyboard layout across its layers (Layer 1–6), including visual guides, finger assignments, and layer-switching exercises.
3. **Conventional Layout Support**: Full support for conventional keyboard layouts (QWERTZ, QWERTY, etc.) alongside Neo 2.
4. **Fast Practice Sessions**: Instant-launch exercises with zero friction, optimized for short, high-frequency practice bursts.
5. **Immediate Correctness & Error Feedback**: Character-by-character real-time feedback with precise error visualization and minimal latency.
6. **Future Statistics & Progress Tracking**: Planned longitudinal metrics, speed (WPM/CPM), accuracy, error heatmaps, and weakness-targeted practice sessions.

---

## 3. Design System & Brand Family Alignment

TypeFirst visually belongs to the same product family as **KnownFirst** and **MathFirst**.

### Reference Repositories
- **KnownFirst**: https://github.com/Tachiguro/KnownFirst
- **MathFirst**: https://github.com/Tachiguro/MathFirst

### Shared Visual Elements
KnownFirst and MathFirst serve as authoritative design references for:
- **Color Palette & Theme Tokens**: Primary accents, background layers, neutral surfaces, text contrast levels, and semantic feedback colors (success/correct, warning, danger/error).
- **Typography & Font Scaling**: Clean, readable sans-serif typography, heading scales, monospace numeral styling, and hierarchy.
- **Spacing & Layout Metrics**: Consistent spacing rhythm (4px/8px grid), padding, card radii, and visual density.
- **Component Styling & Micro-Interactions**: Button styles, input boxes, HUD layouts, session status indicators, and modal designs.
- **Naming Conventions**: Unified naming conventions across components and design tokens where applicable.

> [!IMPORTANT]
> Do not invent TypeFirst branding or visual styles independently if equivalent design tokens and conventions can be derived from KnownFirst and MathFirst.

---

## 4. Platform & Technical Architecture Principles

- **Web-First Platform**: TypeFirst is designed specifically as a web application running in modern web browsers.
- **Appropriate Web Architecture**: While visual design tokens are shared with KnownFirst and MathFirst, their native MAUI Blazor Hybrid application architecture should not be copied blindly. TypeFirst will adopt a clean, modern web-app architecture suited for responsive browser execution.
- **No Premature Implementation**: Architecture choices, frontend frameworks, and build tooling will be formally evaluated and approved in a subsequent `PLAN_ONLY` phase prior to implementation.
