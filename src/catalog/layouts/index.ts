import { DE_NEO2_LAYOUT } from './de-neo2'
import { DE_QWERTZ_LAYOUT } from './de-qwertz'
import { EN_QWERTY_LAYOUT } from './en-qwerty'
import type { KeyboardLayoutDefinition, KeyboardLayoutId } from '../types'

/**
 * Deterministic registry of supported keyboard layout reference profiles.
 */
export const KEYBOARD_LAYOUTS: readonly KeyboardLayoutDefinition[] = [
  DE_QWERTZ_LAYOUT,
  EN_QWERTY_LAYOUT,
  DE_NEO2_LAYOUT,
]

export const DEFAULT_KEYBOARD_LAYOUT_ID: KeyboardLayoutId = 'de-qwertz'

export const isKeyboardLayoutId = (value: string): value is KeyboardLayoutId =>
  KEYBOARD_LAYOUTS.some((layout) => layout.id === value)

export const getKeyboardLayoutDefinition = (id: KeyboardLayoutId): KeyboardLayoutDefinition => {
  const layout = KEYBOARD_LAYOUTS.find((candidate) => candidate.id === id)
  if (!layout) {
    throw new Error(`Unknown keyboard layout id: ${id}`)
  }
  return layout
}

export { DE_QWERTZ_LAYOUT, EN_QWERTY_LAYOUT, DE_NEO2_LAYOUT }
