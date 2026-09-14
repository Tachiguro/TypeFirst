import { useEffect, useRef } from 'react'
import { KEYBOARD_LAYOUTS, LANGUAGES, type KeyboardLayoutId, type LanguageId } from '../catalog'

export type ThemePreference = 'system' | 'light' | 'dark'

interface Choice<T extends string> {
  value: T
  label: string
}

interface ChoiceGroupProps<T extends string> {
  id: string
  title: string
  description?: string
  choices: readonly Choice<T>[]
  selectedValue: T
  columns: 'two' | 'three'
  onChange: (value: T) => void
}

const THEME_CHOICES: readonly Choice<ThemePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const LANGUAGE_CHOICES: readonly Choice<LanguageId>[] = LANGUAGES.map(({ id, displayName }) => ({
  value: id,
  label: displayName,
}))

const KEYBOARD_LAYOUT_CHOICES: readonly Choice<KeyboardLayoutId>[] = KEYBOARD_LAYOUTS.map(
  ({ id, displayName }) => ({ value: id, label: displayName }),
)

function ChoiceGroup<T extends string>({
  id,
  title,
  description,
  choices,
  selectedValue,
  columns,
  onChange,
}: ChoiceGroupProps<T>) {
  const headingId = `${id}-heading`
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <section className="settings-card" aria-labelledby={headingId}>
      <h2 className="settings-section-title" id={headingId}>
        {title}
      </h2>
      {description && (
        <p className="setting-help" id={descriptionId}>
          {description}
        </p>
      )}
      <div
        aria-describedby={descriptionId}
        aria-labelledby={headingId}
        className={`choice-grid choice-grid-${columns}`}
        role="group"
      >
        {choices.map((choice) => {
          const isSelected = choice.value === selectedValue

          return (
            <button
              aria-pressed={isSelected}
              className={`choice-button${isSelected ? ' active' : ''}`}
              key={choice.value}
              type="button"
              onClick={() => onChange(choice.value)}
            >
              {choice.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

interface SettingsViewProps {
  themePreference: ThemePreference
  language: LanguageId
  keyboardLayout: KeyboardLayoutId
  onBack: () => void
  onThemeChange: (theme: ThemePreference) => void
  onLanguageChange: (language: LanguageId) => void
  onKeyboardLayoutChange: (layout: KeyboardLayoutId) => void
}

export function SettingsView({
  themePreference,
  language,
  keyboardLayout,
  onBack,
  onThemeChange,
  onLanguageChange,
  onKeyboardLayoutChange,
}: SettingsViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <header className="settings-header">
        <div>
          <p className="eyebrow">Preferences</p>
          <h1 className="settings-title" id="settings-title" ref={headingRef} tabIndex={-1}>
            Settings
          </h1>
        </div>
        <button className="button button-secondary" type="button" onClick={onBack}>
          Back
        </button>
      </header>

      <div className="settings-grid">
        <ChoiceGroup
          id="appearance"
          title="Appearance"
          choices={THEME_CHOICES}
          selectedValue={themePreference}
          columns="three"
          onChange={onThemeChange}
        />
        <ChoiceGroup
          id="practice-language"
          title="Practice language"
          choices={LANGUAGE_CHOICES}
          selectedValue={language}
          columns="two"
          onChange={onLanguageChange}
        />
        <ChoiceGroup
          id="keyboard-layout"
          title="Keyboard layout"
          description="Typing follows your active OS and browser keyboard layout."
          choices={KEYBOARD_LAYOUT_CHOICES}
          selectedValue={keyboardLayout}
          columns="three"
          onChange={onKeyboardLayoutChange}
        />
      </div>
    </section>
  )
}
