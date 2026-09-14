# TypeFirst

TypeFirst is a fast, web-based typing trainer designed for focused practice in German and English, with first-class future support for the **Neo 2** keyboard layout alongside conventional keyboard layouts.

## Project Status

The initial repository bootstrap (`TF-BOOT-001`), First-family web shell (`TF-WEB-001`), strict typing session engine (`TF-ENGINE-001`), and language and layout catalog (`TF-LAYOUT-001`) are complete.

The current baseline is a responsive React/Vite web application featuring:
- A usable strict typing session with browser-native input capture and retry-in-place error handling.
- Grapheme-safe, NFC-normalized text comparison with combining-character support.
- Real-time session metrics (Progress, Elapsed Time, Accuracy, CPM, and WPM).
- A typed language and layout catalog with canonical German (`de`) and English (`en`) metadata, German QWERTZ (`de-qwertz`), English QWERTY (`en-qwerty`), and German Neo 2 (`de-neo2` modeling conceptual Layers 1–6, navigation actions, keypad semantics, and modifier activators).
- Catalog-backed practice controls with independent layout selection that preserves running session state and scoring.
- Minimal German and English sentence exercises with functional Reset and Next cycling.
- First-family design tokens and pre-paint system/light/dark theme switching.

**Reference Architecture & Future Scope**: Keyboard-layout selection provides reference and training metadata only; scoring remains browser- and OS-authoritative without operating-system layout emulation. Physical keyboard visualization, dynamic finger-placement guidance, expanded exercise corpora, persistent statistics, static web hosting (GitHub Pages), and Progressive Web App (PWA) installability remain planned for subsequent packages.

## Product Goals

- **Bilingual Practice**: Dedicated practice material and sessions for German and English.
- **Neo 2 First-Class Support**: Native design for the Neo 2 keyboard layout and its ergonomic layers, while supporting conventional layouts (such as QWERTZ and QWERTY).
- **Fast Practice Sessions**: Lightweight, immediate, and distraction-free typing exercises.
- **Instant Feedback**: Low-latency correctness and error indication during keystroke input.
- **Progress & Mastery**: Planned support for learning statistics, fluency tracking, and error analysis.
- **Web & PWA Delivery**: Intended for public static hosting on GitHub Pages and installable as a Progressive Web App for desktop launcher access (not yet deployed).

## Design Family & Reference Projects

TypeFirst is part of a cohesive product family and shares its visual design system, design tokens, typography, and color palette with sibling applications:

- **[KnownFirst](https://github.com/Tachiguro/KnownFirst)** — Local-first vocabulary learning application.
- **[MathFirst](https://github.com/Tachiguro/MathFirst)** — Fast, adaptive arithmetic trainer.

TypeFirst is designed specifically as a web application, adopting an architecture optimized for modern web standards while maintaining strict visual harmony with the First-family design language.
