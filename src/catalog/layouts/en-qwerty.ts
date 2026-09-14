import type { KeyboardLayoutDefinition } from '../types'

/**
 * US ANSI QWERTY reference profile.
 *
 * Provenance:
 * - xkeyboard-config: symbols/us xkb_symbols "basic"
 *
 * Encodes standard US ANSI 104-key layout with Base and Shift layers.
 */
export const EN_QWERTY_LAYOUT: KeyboardLayoutDefinition = {
  id: 'en-qwerty',
  displayName: 'English QWERTY',
  description: 'Standard US ANSI QWERTY keyboard layout.',
  provenance: 'xkeyboard-config symbols/us basic',
  layers: [
    {
      layerNumber: 1,
      name: 'Base',
      description: 'Standard unshifted typing layer',
      modifiersDescription: 'None',
      mappings: {
        // Number row (Row E)
        Backquote: { type: 'text', output: '`' },
        Digit1: { type: 'text', output: '1' },
        Digit2: { type: 'text', output: '2' },
        Digit3: { type: 'text', output: '3' },
        Digit4: { type: 'text', output: '4' },
        Digit5: { type: 'text', output: '5' },
        Digit6: { type: 'text', output: '6' },
        Digit7: { type: 'text', output: '7' },
        Digit8: { type: 'text', output: '8' },
        Digit9: { type: 'text', output: '9' },
        Digit0: { type: 'text', output: '0' },
        Minus: { type: 'text', output: '-' },
        Equal: { type: 'text', output: '=' },
        Backspace: { type: 'action', action: 'backspace', displayLabel: 'Backspace' },

        // Upper row (Row D)
        Tab: { type: 'action', action: 'tab', displayLabel: 'Tab' },
        KeyQ: { type: 'text', output: 'q' },
        KeyW: { type: 'text', output: 'w' },
        KeyE: { type: 'text', output: 'e' },
        KeyR: { type: 'text', output: 'r' },
        KeyT: { type: 'text', output: 't' },
        KeyY: { type: 'text', output: 'y' },
        KeyU: { type: 'text', output: 'u' },
        KeyI: { type: 'text', output: 'i' },
        KeyO: { type: 'text', output: 'o' },
        KeyP: { type: 'text', output: 'p' },
        BracketLeft: { type: 'text', output: '[' },
        BracketRight: { type: 'text', output: ']' },
        Backslash: { type: 'text', output: '\\' },

        // Home row (Row C)
        CapsLock: { type: 'modifier', modifier: 'caps-lock', displayLabel: 'Caps Lock' },
        KeyA: { type: 'text', output: 'a' },
        KeyS: { type: 'text', output: 's' },
        KeyD: { type: 'text', output: 'd' },
        KeyF: { type: 'text', output: 'f' },
        KeyG: { type: 'text', output: 'g' },
        KeyH: { type: 'text', output: 'h' },
        KeyJ: { type: 'text', output: 'j' },
        KeyK: { type: 'text', output: 'k' },
        KeyL: { type: 'text', output: 'l' },
        Semicolon: { type: 'text', output: ';' },
        Quote: { type: 'text', output: "'" },
        Enter: { type: 'action', action: 'enter', displayLabel: 'Enter' },

        // Bottom row (Row B)
        ShiftLeft: { type: 'modifier', modifier: 'shift', displayLabel: 'Shift' },
        KeyZ: { type: 'text', output: 'z' },
        KeyX: { type: 'text', output: 'x' },
        KeyC: { type: 'text', output: 'c' },
        KeyV: { type: 'text', output: 'v' },
        KeyB: { type: 'text', output: 'b' },
        KeyN: { type: 'text', output: 'n' },
        KeyM: { type: 'text', output: 'm' },
        Comma: { type: 'text', output: ',' },
        Period: { type: 'text', output: '.' },
        Slash: { type: 'text', output: '/' },
        ShiftRight: { type: 'modifier', modifier: 'shift', displayLabel: 'Shift' },

        // Modifier / Space row (Row A)
        ControlLeft: { type: 'modifier', modifier: 'ctrl', displayLabel: 'Ctrl' },
        AltLeft: { type: 'modifier', modifier: 'alt', displayLabel: 'Alt' },
        Space: { type: 'text', output: ' ', displayLabel: 'Space' },
        AltRight: { type: 'modifier', modifier: 'alt', displayLabel: 'Alt' },
        ControlRight: { type: 'modifier', modifier: 'ctrl', displayLabel: 'Ctrl' },
      },
    },
    {
      layerNumber: 2,
      name: 'Shift',
      description: 'Uppercase and shifted symbol layer',
      modifiersDescription: 'Shift',
      mappings: {
        // Number row (Row E)
        Backquote: { type: 'text', output: '~' },
        Digit1: { type: 'text', output: '!' },
        Digit2: { type: 'text', output: '@' },
        Digit3: { type: 'text', output: '#' },
        Digit4: { type: 'text', output: '$' },
        Digit5: { type: 'text', output: '%' },
        Digit6: { type: 'text', output: '^' },
        Digit7: { type: 'text', output: '&' },
        Digit8: { type: 'text', output: '*' },
        Digit9: { type: 'text', output: '(' },
        Digit0: { type: 'text', output: ')' },
        Minus: { type: 'text', output: '_' },
        Equal: { type: 'text', output: '+' },
        Backspace: { type: 'action', action: 'backspace', displayLabel: 'Backspace' },

        // Upper row (Row D)
        Tab: { type: 'action', action: 'tab', displayLabel: 'Tab' },
        KeyQ: { type: 'text', output: 'Q' },
        KeyW: { type: 'text', output: 'W' },
        KeyE: { type: 'text', output: 'E' },
        KeyR: { type: 'text', output: 'R' },
        KeyT: { type: 'text', output: 'T' },
        KeyY: { type: 'text', output: 'Y' },
        KeyU: { type: 'text', output: 'U' },
        KeyI: { type: 'text', output: 'I' },
        KeyO: { type: 'text', output: 'O' },
        KeyP: { type: 'text', output: 'P' },
        BracketLeft: { type: 'text', output: '{' },
        BracketRight: { type: 'text', output: '}' },
        Backslash: { type: 'text', output: '|' },

        // Home row (Row C)
        CapsLock: { type: 'modifier', modifier: 'caps-lock', displayLabel: 'Caps Lock' },
        KeyA: { type: 'text', output: 'A' },
        KeyS: { type: 'text', output: 'S' },
        KeyD: { type: 'text', output: 'D' },
        KeyF: { type: 'text', output: 'F' },
        KeyG: { type: 'text', output: 'G' },
        KeyH: { type: 'text', output: 'H' },
        KeyJ: { type: 'text', output: 'J' },
        KeyK: { type: 'text', output: 'K' },
        KeyL: { type: 'text', output: 'L' },
        Semicolon: { type: 'text', output: ':' },
        Quote: { type: 'text', output: '"' },
        Enter: { type: 'action', action: 'enter', displayLabel: 'Enter' },

        // Bottom row (Row B)
        ShiftLeft: { type: 'modifier', modifier: 'shift', displayLabel: 'Shift' },
        KeyZ: { type: 'text', output: 'Z' },
        KeyX: { type: 'text', output: 'X' },
        KeyC: { type: 'text', output: 'C' },
        KeyV: { type: 'text', output: 'V' },
        KeyB: { type: 'text', output: 'B' },
        KeyN: { type: 'text', output: 'N' },
        KeyM: { type: 'text', output: 'M' },
        Comma: { type: 'text', output: '<' },
        Period: { type: 'text', output: '>' },
        Slash: { type: 'text', output: '?' },
        ShiftRight: { type: 'modifier', modifier: 'shift', displayLabel: 'Shift' },

        // Modifier / Space row (Row A)
        ControlLeft: { type: 'modifier', modifier: 'ctrl', displayLabel: 'Ctrl' },
        AltLeft: { type: 'modifier', modifier: 'alt', displayLabel: 'Alt' },
        Space: { type: 'text', output: ' ', displayLabel: 'Space' },
        AltRight: { type: 'modifier', modifier: 'alt', displayLabel: 'Alt' },
        ControlRight: { type: 'modifier', modifier: 'ctrl', displayLabel: 'Ctrl' },
      },
    },
  ],
  modifierActivators: [
    { modifier: 'shift', physicalKeys: ['ShiftLeft', 'ShiftRight'], description: 'Shift' },
    { modifier: 'caps-lock', physicalKeys: ['CapsLock'], description: 'Caps Lock' },
  ],
}
