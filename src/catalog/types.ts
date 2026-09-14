/**
 * Canonical domain types and behavior discriminants for the TypeFirst catalog.
 *
 * Physical key positions use KeyboardEvent.code-compatible identifiers limited
 * to the main typing block and bounding modifier keys. The browser/OS remains
 * authoritative for runtime printable text scoring.
 */

export type LanguageId = 'de' | 'en'

export type KeyboardLayoutId = 'de-qwertz' | 'en-qwerty' | 'de-neo2'

/**
 * Constrained physical key positions covering the main alphanumeric typing block,
 * ISO extra key (<LSGT>), and bounding modifier/editing keys.
 * Function keys, standalone navigation islands, and dedicated numpads are excluded.
 */
export type PhysicalKeyCode =
  // Number row (Row E)
  | 'Backquote'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'
  | 'Digit0'
  | 'Minus'
  | 'Equal'
  | 'Backspace'
  // Upper row (Row D)
  | 'Tab'
  | 'KeyQ'
  | 'KeyW'
  | 'KeyE'
  | 'KeyR'
  | 'KeyT'
  | 'KeyY'
  | 'KeyU'
  | 'KeyI'
  | 'KeyO'
  | 'KeyP'
  | 'BracketLeft'
  | 'BracketRight'
  | 'Backslash'
  // Home row (Row C)
  | 'CapsLock'
  | 'KeyA'
  | 'KeyS'
  | 'KeyD'
  | 'KeyF'
  | 'KeyG'
  | 'KeyH'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL'
  | 'Semicolon'
  | 'Quote'
  | 'Enter'
  // Bottom row (Row B)
  | 'ShiftLeft'
  | 'IntlBackslash'
  | 'KeyZ'
  | 'KeyX'
  | 'KeyC'
  | 'KeyV'
  | 'KeyB'
  | 'KeyN'
  | 'KeyM'
  | 'Comma'
  | 'Period'
  | 'Slash'
  | 'ShiftRight'
  // Modifier / Space row (Row A)
  | 'ControlLeft'
  | 'AltLeft'
  | 'Space'
  | 'AltRight'
  | 'ControlRight'
  | 'MetaLeft'
  | 'MetaRight'

export type DeadKeyId =
  | 'acute'
  | 'grave'
  | 'circumflex'
  | 'tilde'
  | 'diaeresis'
  | 'caron'
  | 'cedilla'
  | 'macron'
  | 'breve'
  | 'double-acute'
  | 'ring-above'
  | 'stroke'
  | 'psili'
  | 'dasia'
  | 'dot-above'
  | 'dot-below'
  | 'macron-below'
  | 'ogonek'

export type ActionId =
  | 'backspace'
  | 'tab'
  | 'enter'
  | 'escape'
  | 'delete'
  | 'insert'
  | 'undo'
  | 'home'
  | 'end'
  | 'page-up'
  | 'page-down'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'compose'

export type KeypadKeyId =
  | 'kp-0'
  | 'kp-1'
  | 'kp-2'
  | 'kp-3'
  | 'kp-4'
  | 'kp-5'
  | 'kp-6'
  | 'kp-7'
  | 'kp-8'
  | 'kp-9'
  | 'kp-add'
  | 'kp-subtract'
  | 'kp-multiply'
  | 'kp-divide'
  | 'kp-separator'

export type ModifierId =
  | 'shift'
  | 'caps-lock'
  | 'alt'
  | 'altgr'
  | 'ctrl'
  | 'meta'
  | 'mod3'
  | 'mod4'

/**
 * Printable Unicode text behavior emitting exactly one NFC-normalized grapheme cluster.
 */
export interface TextKeyBehavior {
  readonly type: 'text'
  readonly output: string
  readonly displayLabel?: string
}

/**
 * Dead-key behavior representing composition semantics on reference layouts.
 * Does not emit scored printable text directly.
 */
export interface DeadKeyBehavior {
  readonly type: 'dead-key'
  readonly deadKeyId: DeadKeyId
  readonly displayLabel: string
}

/**
 * Navigation or editing semantic operation.
 */
export interface ActionKeyBehavior {
  readonly type: 'action'
  readonly action: ActionId
  readonly displayLabel: string
}

/**
 * Embedded numeric keypad semantic operation.
 */
export interface KeypadKeyBehavior {
  readonly type: 'keypad'
  readonly keypadKey: KeypadKeyId
  readonly displayLabel: string
}

/**
 * Logical keyboard modifier behavior.
 */
export interface ModifierKeyBehavior {
  readonly type: 'modifier'
  readonly modifier: ModifierId
  readonly displayLabel?: string
}

/**
 * Unmapped or NoSymbol position on a given layout layer.
 */
export interface UnmappedKeyBehavior {
  readonly type: 'unmapped'
  readonly displayLabel?: string
}

export type KeyBehavior =
  | TextKeyBehavior
  | DeadKeyBehavior
  | ActionKeyBehavior
  | KeypadKeyBehavior
  | ModifierKeyBehavior
  | UnmappedKeyBehavior

export interface KeyboardLayoutLayer {
  readonly layerNumber: number
  readonly name: string
  readonly description?: string
  readonly modifiersDescription: string
  readonly mappings: Readonly<Partial<Record<PhysicalKeyCode, KeyBehavior>>>
}

export interface ModifierActivator {
  readonly modifier: ModifierId
  readonly physicalKeys: readonly PhysicalKeyCode[]
  readonly description?: string
}

export interface KeyboardLayoutDefinition {
  readonly id: KeyboardLayoutId
  readonly displayName: string
  readonly description: string
  readonly provenance: string
  readonly layers: readonly KeyboardLayoutLayer[]
  readonly modifierActivators?: readonly ModifierActivator[]
}

export interface LanguageDefinition {
  readonly id: LanguageId
  readonly displayName: string
  readonly locale: string
  readonly defaultLayoutId: KeyboardLayoutId
}
