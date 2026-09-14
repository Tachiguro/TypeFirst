import { describe, expect, it } from 'vitest'
import {
  DE_NEO2_LAYOUT,
  DE_QWERTZ_LAYOUT,
  DEFAULT_KEYBOARD_LAYOUT_ID,
  DEFAULT_LANGUAGE_ID,
  ENGLISH,
  EN_QWERTY_LAYOUT,
  GERMAN,
  getKeyboardLayoutDefinition,
  getLanguageDefinition,
  isKeyboardLayoutId,
  isLanguageId,
  KEYBOARD_LAYOUTS,
  LANGUAGES,
  type ActionId,
  type DeadKeyId,
  type KeyBehavior,
  type KeypadKeyId,
  type ModifierId,
  type PhysicalKeyCode,
} from './index'

const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' })

const countGraphemes = (text: string): number => {
  let count = 0
  for (const _ of segmenter.segment(text)) {
    count += 1
  }
  return count
}

const KNOWN_PHYSICAL_KEY_CODES: ReadonlySet<PhysicalKeyCode> = new Set<PhysicalKeyCode>([
  'Backquote',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Digit0',
  'Minus',
  'Equal',
  'Backspace',
  'Tab',
  'KeyQ',
  'KeyW',
  'KeyE',
  'KeyR',
  'KeyT',
  'KeyY',
  'KeyU',
  'KeyI',
  'KeyO',
  'KeyP',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'CapsLock',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
  'Quote',
  'Enter',
  'ShiftLeft',
  'IntlBackslash',
  'KeyZ',
  'KeyX',
  'KeyC',
  'KeyV',
  'KeyB',
  'KeyN',
  'KeyM',
  'Comma',
  'Period',
  'Slash',
  'ShiftRight',
  'ControlLeft',
  'AltLeft',
  'Space',
  'AltRight',
  'ControlRight',
  'MetaLeft',
  'MetaRight',
])

const KNOWN_DEAD_KEY_IDS: ReadonlySet<DeadKeyId> = new Set<DeadKeyId>([
  'acute',
  'grave',
  'circumflex',
  'tilde',
  'diaeresis',
  'caron',
  'cedilla',
  'macron',
  'breve',
  'double-acute',
  'ring-above',
  'stroke',
  'psili',
  'dasia',
  'dot-above',
  'dot-below',
  'macron-below',
  'ogonek',
])

const KNOWN_ACTION_IDS: ReadonlySet<ActionId> = new Set<ActionId>([
  'backspace',
  'tab',
  'enter',
  'escape',
  'delete',
  'insert',
  'undo',
  'home',
  'end',
  'page-up',
  'page-down',
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'compose',
])

const KNOWN_KEYPAD_IDS: ReadonlySet<KeypadKeyId> = new Set<KeypadKeyId>([
  'kp-0',
  'kp-1',
  'kp-2',
  'kp-3',
  'kp-4',
  'kp-5',
  'kp-6',
  'kp-7',
  'kp-8',
  'kp-9',
  'kp-add',
  'kp-subtract',
  'kp-multiply',
  'kp-divide',
  'kp-separator',
])

const KNOWN_MODIFIER_IDS: ReadonlySet<ModifierId> = new Set<ModifierId>([
  'shift',
  'caps-lock',
  'alt',
  'altgr',
  'ctrl',
  'meta',
  'mod3',
  'mod4',
])

describe('Language Catalog', () => {
  it('defines unique language IDs in deterministic order', () => {
    expect(LANGUAGES.map((l) => l.id)).toEqual(['de', 'en'])
    const idSet = new Set(LANGUAGES.map((l) => l.id))
    expect(idSet.size).toBe(LANGUAGES.length)
  })

  it('exposes valid default layouts for each language', () => {
    expect(GERMAN.defaultLayoutId).toBe('de-qwertz')
    expect(ENGLISH.defaultLayoutId).toBe('en-qwerty')
    for (const language of LANGUAGES) {
      expect(isKeyboardLayoutId(language.defaultLayoutId)).toBe(true)
    }
  })

  it('provides working lookup and type-guard functions', () => {
    expect(DEFAULT_LANGUAGE_ID).toBe('de')
    expect(isLanguageId('de')).toBe(true)
    expect(isLanguageId('en')).toBe(true)
    expect(isLanguageId('fr')).toBe(false)

    expect(getLanguageDefinition('de')).toBe(GERMAN)
    expect(getLanguageDefinition('en')).toBe(ENGLISH)
    expect(() => getLanguageDefinition('unknown' as never)).toThrow()
  })
})

describe('Layout Registry', () => {
  it('defines unique layout IDs in deterministic order', () => {
    expect(KEYBOARD_LAYOUTS.map((l) => l.id)).toEqual(['de-qwertz', 'en-qwerty', 'de-neo2'])
    const idSet = new Set(KEYBOARD_LAYOUTS.map((l) => l.id))
    expect(idSet.size).toBe(KEYBOARD_LAYOUTS.length)
  })

  it('provides working lookup and type-guard functions', () => {
    expect(DEFAULT_KEYBOARD_LAYOUT_ID).toBe('de-qwertz')
    expect(isKeyboardLayoutId('de-qwertz')).toBe(true)
    expect(isKeyboardLayoutId('en-qwerty')).toBe(true)
    expect(isKeyboardLayoutId('de-neo2')).toBe(true)
    expect(isKeyboardLayoutId('dvorak')).toBe(false)

    expect(getKeyboardLayoutDefinition('de-qwertz')).toBe(DE_QWERTZ_LAYOUT)
    expect(getKeyboardLayoutDefinition('en-qwerty')).toBe(EN_QWERTY_LAYOUT)
    expect(getKeyboardLayoutDefinition('de-neo2')).toBe(DE_NEO2_LAYOUT)
    expect(() => getKeyboardLayoutDefinition('unknown' as never)).toThrow()
  })
})

describe('Catalog Structural Invariants', () => {
  for (const layout of KEYBOARD_LAYOUTS) {
    describe(`Layout: ${layout.id}`, () => {
      it('has strictly ascending and unique layer numbers starting from 1', () => {
        const layerNumbers = layout.layers.map((layer) => layer.layerNumber)
        expect(layerNumbers.length).toBeGreaterThan(0)
        for (let i = 0; i < layerNumbers.length; i += 1) {
          expect(layerNumbers[i]).toBe(i + 1)
        }
      })

      it('uses only known physical key codes', () => {
        for (const layer of layout.layers) {
          for (const key of Object.keys(layer.mappings) as PhysicalKeyCode[]) {
            expect(KNOWN_PHYSICAL_KEY_CODES.has(key)).toBe(true)
          }
        }
      })

      it('satisfies text output NFC normalization and single grapheme cluster invariant', () => {
        for (const layer of layout.layers) {
          for (const [key, behavior] of Object.entries(layer.mappings) as [PhysicalKeyCode, KeyBehavior][]) {
            if (behavior.type === 'text') {
              expect(behavior.output.length, `${layout.id} L${layer.layerNumber} ${key}`).toBeGreaterThan(0)
              expect(behavior.output, `${layout.id} L${layer.layerNumber} ${key}`).toBe(behavior.output.normalize('NFC'))
              expect(countGraphemes(behavior.output), `${layout.id} L${layer.layerNumber} ${key} output: "${behavior.output}"`).toBe(1)
            }
          }
        }
      })

      it('uses valid discriminants for dead keys, actions, keypads, and modifiers', () => {
        for (const layer of layout.layers) {
          for (const behavior of Object.values(layer.mappings)) {
            if (behavior.type === 'dead-key') {
              expect(KNOWN_DEAD_KEY_IDS.has(behavior.deadKeyId)).toBe(true)
              expect(behavior.displayLabel.length).toBeGreaterThan(0)
            } else if (behavior.type === 'action') {
              expect(KNOWN_ACTION_IDS.has(behavior.action)).toBe(true)
              expect(behavior.displayLabel.length).toBeGreaterThan(0)
            } else if (behavior.type === 'keypad') {
              expect(KNOWN_KEYPAD_IDS.has(behavior.keypadKey)).toBe(true)
              expect(behavior.displayLabel.length).toBeGreaterThan(0)
            } else if (behavior.type === 'modifier') {
              expect(KNOWN_MODIFIER_IDS.has(behavior.modifier)).toBe(true)
            }
          }
        }
      })
    })
  }
})

describe('Golden Reference Verification', () => {
  describe('German QWERTZ Profile (xkeyboard-config symbols/de basic)', () => {
    // Base layer
    it('matches base layer alphanumeric and dead-key positions', () => {
      const base = DE_QWERTZ_LAYOUT.layers[0].mappings
      // <AD06> = 'z' in QWERTZ (physical position Row D Key 6)
      expect(base.KeyZ).toEqual({ type: 'text', output: 'z' })
      // <AB01> = 'y' in QWERTZ
      expect(base.KeyY).toEqual({ type: 'text', output: 'y' })
      // <AD11> = 'ü'
      expect(base.BracketLeft).toEqual({ type: 'text', output: 'ü' })
      // <AC10> = 'ö'
      expect(base.Semicolon).toEqual({ type: 'text', output: 'ö' })
      // <AC11> = 'ä'
      expect(base.Quote).toEqual({ type: 'text', output: 'ä' })
      // <AE11> = 'ß'
      expect(base.Minus).toEqual({ type: 'text', output: 'ß' })
      // <TLDE> = dead circumflex (^)
      expect(base.Backquote).toEqual({ type: 'dead-key', deadKeyId: 'circumflex', displayLabel: '^' })
      // <AE12> = dead acute (´)
      expect(base.Equal).toEqual({ type: 'dead-key', deadKeyId: 'acute', displayLabel: '´' })
      // <LSGT> = '<'
      expect(base.IntlBackslash).toEqual({ type: 'text', output: '<' })
      // <BKSL> = '#'
      expect(base.Backslash).toEqual({ type: 'text', output: '#' })
    })

    // Shift layer
    it('matches Shift layer uppercase and symbols', () => {
      const shift = DE_QWERTZ_LAYOUT.layers[1].mappings
      // <AD06> = 'Z'
      expect(shift.KeyZ).toEqual({ type: 'text', output: 'Z' })
      // <AB01> = 'Y'
      expect(shift.KeyY).toEqual({ type: 'text', output: 'Y' })
      // <AD11> = 'Ü'
      expect(shift.BracketLeft).toEqual({ type: 'text', output: 'Ü' })
      // <AC10> = 'Ö'
      expect(shift.Semicolon).toEqual({ type: 'text', output: 'Ö' })
      // <AC11> = 'Ä'
      expect(shift.Quote).toEqual({ type: 'text', output: 'Ä' })
      // <AE11> = '?'
      expect(shift.Minus).toEqual({ type: 'text', output: '?' })
      // <TLDE> = '°'
      expect(shift.Backquote).toEqual({ type: 'text', output: '°' })
      // <AE12> = dead grave (`)
      expect(shift.Equal).toEqual({ type: 'dead-key', deadKeyId: 'grave', displayLabel: '`' })
      // <LSGT> = '>'
      expect(shift.IntlBackslash).toEqual({ type: 'text', output: '>' })
      // <BKSL> = "'"
      expect(shift.Backslash).toEqual({ type: 'text', output: "'" })
    })

    // AltGraph layer
    it('matches AltGraph (ISO Level 3) symbols and dead keys', () => {
      const altgr = DE_QWERTZ_LAYOUT.layers[2].mappings
      // <AD03> = '€' (EuroSign)
      expect(altgr.KeyE).toEqual({ type: 'text', output: '€' })
      // <AD01> = '@'
      expect(altgr.KeyQ).toEqual({ type: 'text', output: '@' })
      // <AE07> = '{'
      expect(altgr.Digit7).toEqual({ type: 'text', output: '{' })
      // <AE08> = '['
      expect(altgr.Digit8).toEqual({ type: 'text', output: '[' })
      // <AE09> = ']'
      expect(altgr.Digit9).toEqual({ type: 'text', output: ']' })
      // <AE10> = '}'
      expect(altgr.Digit0).toEqual({ type: 'text', output: '}' })
      // <AE11> = '\'
      expect(altgr.Minus).toEqual({ type: 'text', output: '\\' })
      // <LSGT> = '|'
      expect(altgr.IntlBackslash).toEqual({ type: 'text', output: '|' })
      // <AD12> = '~'
      expect(altgr.BracketRight).toEqual({ type: 'text', output: '~' })
      // <AD11> = dead diaeresis (¨)
      expect(altgr.BracketLeft).toEqual({ type: 'dead-key', deadKeyId: 'diaeresis', displayLabel: '¨' })
    })
  })

  describe('US ANSI QWERTY Profile (xkeyboard-config symbols/us basic)', () => {
    it('matches base and shift layers', () => {
      const base = EN_QWERTY_LAYOUT.layers[0].mappings
      const shift = EN_QWERTY_LAYOUT.layers[1].mappings

      // Base
      expect(base.KeyQ).toEqual({ type: 'text', output: 'q' })
      expect(base.KeyZ).toEqual({ type: 'text', output: 'z' })
      expect(base.KeyY).toEqual({ type: 'text', output: 'y' })
      expect(base.Backquote).toEqual({ type: 'text', output: '`' })
      expect(base.Minus).toEqual({ type: 'text', output: '-' })
      expect(base.Equal).toEqual({ type: 'text', output: '=' })
      expect(base.BracketLeft).toEqual({ type: 'text', output: '[' })
      expect(base.BracketRight).toEqual({ type: 'text', output: ']' })
      expect(base.Backslash).toEqual({ type: 'text', output: '\\' })
      expect(base.Semicolon).toEqual({ type: 'text', output: ';' })
      expect(base.Quote).toEqual({ type: 'text', output: "'" })

      // Shift
      expect(shift.KeyQ).toEqual({ type: 'text', output: 'Q' })
      expect(shift.Backquote).toEqual({ type: 'text', output: '~' })
      expect(shift.Digit1).toEqual({ type: 'text', output: '!' })
      expect(shift.Digit2).toEqual({ type: 'text', output: '@' })
      expect(shift.Digit3).toEqual({ type: 'text', output: '#' })
      expect(shift.Digit4).toEqual({ type: 'text', output: '$' })
      expect(shift.Digit5).toEqual({ type: 'text', output: '%' })
      expect(shift.Digit6).toEqual({ type: 'text', output: '^' })
      expect(shift.Digit7).toEqual({ type: 'text', output: '&' })
      expect(shift.Digit8).toEqual({ type: 'text', output: '*' })
      expect(shift.Digit9).toEqual({ type: 'text', output: '(' })
      expect(shift.Digit0).toEqual({ type: 'text', output: ')' })
      expect(shift.Minus).toEqual({ type: 'text', output: '_' })
      expect(shift.Equal).toEqual({ type: 'text', output: '+' })
      expect(shift.BracketLeft).toEqual({ type: 'text', output: '{' })
      expect(shift.BracketRight).toEqual({ type: 'text', output: '}' })
      expect(shift.Backslash).toEqual({ type: 'text', output: '|' })
    })
  })

  describe('Neo 2 Profile (neo-layout.org & xkeyboard-config symbols/de neo_base)', () => {
    it('defines correct modifier activators for Mod3 and Mod4', () => {
      const mod3 = DE_NEO2_LAYOUT.modifierActivators?.find((a) => a.modifier === 'mod3')
      const mod4 = DE_NEO2_LAYOUT.modifierActivators?.find((a) => a.modifier === 'mod4')
      const shift = DE_NEO2_LAYOUT.modifierActivators?.find((a) => a.modifier === 'shift')

      expect(mod3?.physicalKeys).toEqual(['CapsLock', 'Backslash'])
      expect(mod4?.physicalKeys).toEqual(['IntlBackslash', 'AltRight'])
      expect(shift?.physicalKeys).toEqual(['ShiftLeft', 'ShiftRight'])
    })

    it('matches Layer 1 (Base) text entries', () => {
      const l1 = DE_NEO2_LAYOUT.layers[0].mappings
      // <AD01> = 'x'
      expect(l1.KeyQ).toEqual({ type: 'text', output: 'x' })
      // <AD02> = 'v'
      expect(l1.KeyW).toEqual({ type: 'text', output: 'v' })
      // <AD03> = 'l'
      expect(l1.KeyE).toEqual({ type: 'text', output: 'l' })
      // <AD04> = 'c'
      expect(l1.KeyR).toEqual({ type: 'text', output: 'c' })
      // <AD05> = 'w'
      expect(l1.KeyT).toEqual({ type: 'text', output: 'w' })
      // <AC01> = 'u'
      expect(l1.KeyA).toEqual({ type: 'text', output: 'u' })
      // <AC02> = 'i'
      expect(l1.KeyS).toEqual({ type: 'text', output: 'i' })
      // <AC03> = 'a'
      expect(l1.KeyD).toEqual({ type: 'text', output: 'a' })
      // <AC04> = 'e'
      expect(l1.KeyF).toEqual({ type: 'text', output: 'e' })
      // <AC05> = 'o'
      expect(l1.KeyG).toEqual({ type: 'text', output: 'o' })
      // <AC06> = 's'
      expect(l1.KeyH).toEqual({ type: 'text', output: 's' })
      // <AC07> = 'n'
      expect(l1.KeyJ).toEqual({ type: 'text', output: 'n' })
      // <AC08> = 'r'
      expect(l1.KeyK).toEqual({ type: 'text', output: 'r' })
      // <AC09> = 't'
      expect(l1.KeyL).toEqual({ type: 'text', output: 't' })
      // <AC10> = 'd'
      expect(l1.Semicolon).toEqual({ type: 'text', output: 'd' })
      // <AC11> = 'y'
      expect(l1.Quote).toEqual({ type: 'text', output: 'y' })
      // <AB01> = 'ü'
      expect(l1.KeyZ).toEqual({ type: 'text', output: 'ü' })
      // <AB02> = 'ö'
      expect(l1.KeyX).toEqual({ type: 'text', output: 'ö' })
      // <AB03> = 'ä'
      expect(l1.KeyC).toEqual({ type: 'text', output: 'ä' })
      // <AD11> = 'ß'
      expect(l1.BracketLeft).toEqual({ type: 'text', output: 'ß' })
    })

    it('matches Layer 2 (Shift) uppercase and symbols', () => {
      const l2 = DE_NEO2_LAYOUT.layers[1].mappings
      // <AD01> = 'X'
      expect(l2.KeyQ).toEqual({ type: 'text', output: 'X' })
      // <AC01> = 'U'
      expect(l2.KeyA).toEqual({ type: 'text', output: 'U' })
      // <AD11> = 'ẞ' (U+1E9E)
      expect(l2.BracketLeft).toEqual({ type: 'text', output: 'ẞ' })
      // <AE01> = '°'
      expect(l2.Digit1).toEqual({ type: 'text', output: '°' })
      // <AE02> = '§'
      expect(l2.Digit2).toEqual({ type: 'text', output: '§' })
      // <AE03> = 'ℓ'
      expect(l2.Digit3).toEqual({ type: 'text', output: 'ℓ' })
      // <AE04> = '»'
      expect(l2.Digit4).toEqual({ type: 'text', output: '»' })
      // <AE05> = '«'
      expect(l2.Digit5).toEqual({ type: 'text', output: '«' })
      // <AE07> = '€'
      expect(l2.Digit7).toEqual({ type: 'text', output: '€' })
    })

    it('matches Layer 3 (Neo Mod3) programming and special characters', () => {
      const l3 = DE_NEO2_LAYOUT.layers[2].mappings
      // <AC01> = '\'
      expect(l3.KeyA).toEqual({ type: 'text', output: '\\' })
      // <AC02> = '/'
      expect(l3.KeyS).toEqual({ type: 'text', output: '/' })
      // <AC03> = '{'
      expect(l3.KeyD).toEqual({ type: 'text', output: '{' })
      // <AC04> = '}'
      expect(l3.KeyF).toEqual({ type: 'text', output: '}' })
      // <AC05> = '*'
      expect(l3.KeyG).toEqual({ type: 'text', output: '*' })
      // <AD03> = '['
      expect(l3.KeyE).toEqual({ type: 'text', output: '[' })
      // <AD04> = ']'
      expect(l3.KeyR).toEqual({ type: 'text', output: ']' })
      // <AC07> = '('
      expect(l3.KeyJ).toEqual({ type: 'text', output: '(' })
      // <AC08> = ')'
      expect(l3.KeyK).toEqual({ type: 'text', output: ')' })
      // <AB03> = '|'
      expect(l3.KeyC).toEqual({ type: 'text', output: '|' })
      // <AB04> = '~'
      expect(l3.KeyV).toEqual({ type: 'text', output: '~' })
      // <AD11> = 'ſ' (U+017F)
      expect(l3.BracketLeft).toEqual({ type: 'text', output: 'ſ' })
    })

    it('matches Layer 4 navigation actions and embedded keypad semantics (from XKB Level 5)', () => {
      const l4 = DE_NEO2_LAYOUT.layers[3].mappings

      // Navigation actions
      expect(l4.KeyA).toEqual({ type: 'action', action: 'home', displayLabel: 'Home' })
      expect(l4.KeyS).toEqual({ type: 'action', action: 'arrow-left', displayLabel: 'Left' })
      expect(l4.KeyD).toEqual({ type: 'action', action: 'arrow-down', displayLabel: 'Down' })
      expect(l4.KeyF).toEqual({ type: 'action', action: 'arrow-right', displayLabel: 'Right' })
      expect(l4.KeyE).toEqual({ type: 'action', action: 'arrow-up', displayLabel: 'Up' })
      expect(l4.KeyG).toEqual({ type: 'action', action: 'end', displayLabel: 'End' })
      expect(l4.KeyQ).toEqual({ type: 'action', action: 'page-up', displayLabel: 'Page Up' })
      expect(l4.KeyT).toEqual({ type: 'action', action: 'page-down', displayLabel: 'Page Down' })
      expect(l4.KeyW).toEqual({ type: 'action', action: 'backspace', displayLabel: 'Backspace' })
      expect(l4.KeyR).toEqual({ type: 'action', action: 'delete', displayLabel: 'Delete' })
      expect(l4.KeyZ).toEqual({ type: 'action', action: 'escape', displayLabel: 'Escape' })
      expect(l4.KeyX).toEqual({ type: 'action', action: 'tab', displayLabel: 'Tab' })
      expect(l4.KeyC).toEqual({ type: 'action', action: 'insert', displayLabel: 'Insert' })
      expect(l4.KeyV).toEqual({ type: 'action', action: 'enter', displayLabel: 'Return' })
      expect(l4.KeyB).toEqual({ type: 'action', action: 'undo', displayLabel: 'Undo' })

      // Embedded keypad semantics
      expect(l4.KeyU).toEqual({ type: 'keypad', keypadKey: 'kp-7', displayLabel: 'KP 7' })
      expect(l4.KeyI).toEqual({ type: 'keypad', keypadKey: 'kp-8', displayLabel: 'KP 8' })
      expect(l4.KeyO).toEqual({ type: 'keypad', keypadKey: 'kp-9', displayLabel: 'KP 9' })
      expect(l4.KeyJ).toEqual({ type: 'keypad', keypadKey: 'kp-4', displayLabel: 'KP 4' })
      expect(l4.KeyK).toEqual({ type: 'keypad', keypadKey: 'kp-5', displayLabel: 'KP 5' })
      expect(l4.KeyL).toEqual({ type: 'keypad', keypadKey: 'kp-6', displayLabel: 'KP 6' })
      expect(l4.KeyM).toEqual({ type: 'keypad', keypadKey: 'kp-1', displayLabel: 'KP 1' })
      expect(l4.Comma).toEqual({ type: 'keypad', keypadKey: 'kp-2', displayLabel: 'KP 2' })
      expect(l4.Period).toEqual({ type: 'keypad', keypadKey: 'kp-3', displayLabel: 'KP 3' })
      expect(l4.Space).toEqual({ type: 'keypad', keypadKey: 'kp-0', displayLabel: 'KP 0' })
      expect(l4.KeyP).toEqual({ type: 'keypad', keypadKey: 'kp-add', displayLabel: 'KP +' })
      expect(l4.Digit9).toEqual({ type: 'keypad', keypadKey: 'kp-divide', displayLabel: 'KP ÷' })
      expect(l4.Digit0).toEqual({ type: 'keypad', keypadKey: 'kp-multiply', displayLabel: 'KP ×' })
      expect(l4.Minus).toEqual({ type: 'keypad', keypadKey: 'kp-subtract', displayLabel: 'KP −' })
      expect(l4.Semicolon).toEqual({ type: 'keypad', keypadKey: 'kp-separator', displayLabel: 'KP ,' })

      // Punctuation and symbols on Layer 4
      expect(l4.Quote).toEqual({ type: 'text', output: '.' })
      expect(l4.KeyN).toEqual({ type: 'text', output: ':' })
      expect(l4.BracketLeft).toEqual({ type: 'text', output: '−' })
    })

    it('matches Layer 5 Greek lowercase and subscripts (from XKB Level 4)', () => {
      const l5 = DE_NEO2_LAYOUT.layers[4].mappings
      // <AC01> is unmapped in Layer 5
      expect(l5.KeyA).toEqual({ type: 'unmapped' })
      // <AC02> = Greek_iota ('ι')
      expect(l5.KeyS).toEqual({ type: 'text', output: 'ι' })
      // <AC03> = Greek_alpha ('α')
      expect(l5.KeyD).toEqual({ type: 'text', output: 'α' })
      // <AC04> = Greek_epsilon ('ε')
      expect(l5.KeyF).toEqual({ type: 'text', output: 'ε' })
      // <AC05> = Greek_omicron ('ο')
      expect(l5.KeyG).toEqual({ type: 'text', output: 'ο' })
      // <AC06> = Greek_sigma ('σ')
      expect(l5.KeyH).toEqual({ type: 'text', output: 'σ' })
      // <AC07> = Greek_nu ('ν')
      expect(l5.KeyJ).toEqual({ type: 'text', output: 'ν' })
      // <AC08> = Greek_rho ('ρ')
      expect(l5.KeyK).toEqual({ type: 'text', output: 'ρ' })
      // <AC09> = Greek_tau ('τ')
      expect(l5.KeyL).toEqual({ type: 'text', output: 'τ' })
      // <AC10> = Greek_delta ('δ')
      expect(l5.Semicolon).toEqual({ type: 'text', output: 'δ' })
      // <AC11> = Greek_upsilon ('υ')
      expect(l5.Quote).toEqual({ type: 'text', output: 'υ' })
      // <AB06> = Greek_beta ('β')
      expect(l5.KeyN).toEqual({ type: 'text', output: 'β' })
      // <AE01> = onesubscript ('₁')
      expect(l5.Digit1).toEqual({ type: 'text', output: '₁' })
      // <AE02> = twosubscript ('₂')
      expect(l5.Digit2).toEqual({ type: 'text', output: '₂' })
    })

    it('matches Layer 6 mathematical and Greek uppercase symbols (from XKB Level 7)', () => {
      const l6 = DE_NEO2_LAYOUT.layers[5].mappings
      // <AC01> = includedin ('⊂' / U+2282)
      expect(l6.KeyA).toEqual({ type: 'text', output: '⊂' })
      // <AC02> = integral ('∫' / U+222B)
      expect(l6.KeyS).toEqual({ type: 'text', output: '∫' })
      // <AC03> = U2200 ('∀')
      expect(l6.KeyD).toEqual({ type: 'text', output: '∀' })
      // <AC04> = U2203 ('∃')
      expect(l6.KeyF).toEqual({ type: 'text', output: '∃' })
      // <AC05> = elementof ('∈' / U+2208)
      expect(l6.KeyG).toEqual({ type: 'text', output: '∈' })
      // <AC06> = Greek_SIGMA ('Σ' / U+03A3)
      expect(l6.KeyH).toEqual({ type: 'text', output: 'Σ' })
      // <AC07> = double-struck N ('ℕ' / U+2115)
      expect(l6.KeyJ).toEqual({ type: 'text', output: 'ℕ' })
      // <AC08> = double-struck R ('ℝ' / U+211D)
      expect(l6.KeyK).toEqual({ type: 'text', output: 'ℝ' })
      // <AC09> = partialderivative ('∂' / U+2202)
      expect(l6.KeyL).toEqual({ type: 'text', output: '∂' })
      // <AC10> = Greek_DELTA ('Δ' / U+0394)
      expect(l6.Semicolon).toEqual({ type: 'text', output: 'Δ' })
      // <AC11> = nabla ('∇' / U+2207)
      expect(l6.Quote).toEqual({ type: 'text', output: '∇' })
      // <AD01> = Greek_XI ('Ξ' / U+039E)
      expect(l6.KeyQ).toEqual({ type: 'text', output: 'Ξ' })
      // <AD03> = Greek_LAMBDA ('Λ' / U+039B)
      expect(l6.KeyE).toEqual({ type: 'text', output: 'Λ' })
      // <AD04> = double-struck C ('ℂ' / U+2102)
      expect(l6.KeyR).toEqual({ type: 'text', output: 'ℂ' })
      // <AD05> = Greek_OMEGA ('Ω' / U+03A9)
      expect(l6.KeyT).toEqual({ type: 'text', output: 'Ω' })
      // <AE08> = infinity ('∞' / U+221E)
      expect(l6.Digit8).toEqual({ type: 'text', output: '∞' })
    })
  })
})
