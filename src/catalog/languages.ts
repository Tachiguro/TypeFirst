import type { LanguageDefinition, LanguageId } from './types'

export const GERMAN: LanguageDefinition = {
  id: 'de',
  displayName: 'German',
  locale: 'de-DE',
  defaultLayoutId: 'de-qwertz',
}

export const ENGLISH: LanguageDefinition = {
  id: 'en',
  displayName: 'English',
  locale: 'en-US',
  defaultLayoutId: 'en-qwerty',
}

/**
 * Deterministic catalog of supported languages.
 */
export const LANGUAGES: readonly LanguageDefinition[] = [GERMAN, ENGLISH]

export const DEFAULT_LANGUAGE_ID: LanguageId = 'de'

export const isLanguageId = (value: string): value is LanguageId =>
  LANGUAGES.some((language) => language.id === value)

export const getLanguageDefinition = (id: LanguageId): LanguageDefinition => {
  const language = LANGUAGES.find((candidate) => candidate.id === id)
  if (!language) {
    throw new Error(`Unknown language id: ${id}`)
  }
  return language
}
