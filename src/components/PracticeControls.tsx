import type { Language } from '../data/exercises'

export type KeyboardLayout = 'german-qwertz' | 'english-qwerty' | 'neo-2'

interface PracticeControlsProps {
  language: Language
  keyboardLayout: KeyboardLayout
  onLanguageChange: (language: Language) => void
  onKeyboardLayoutChange: (layout: KeyboardLayout) => void
}

const isLanguage = (value: string): value is Language => value === 'de' || value === 'en'

const isKeyboardLayout = (value: string): value is KeyboardLayout =>
  value === 'german-qwertz' || value === 'english-qwerty' || value === 'neo-2'

export function PracticeControls({
  language,
  keyboardLayout,
  onLanguageChange,
  onKeyboardLayoutChange,
}: PracticeControlsProps) {
  return (
    <section className="practice-controls" aria-labelledby="practice-options-heading">
      <div className="section-heading">
        <p className="eyebrow">Practice setup</p>
        <h2 id="practice-options-heading">Choose your exercise</h2>
      </div>

      <div className="control-grid">
        <label className="field" htmlFor="language">
          <span>Language</span>
          <select
            id="language"
            value={language}
            onChange={(event) => {
              if (isLanguage(event.target.value)) {
                onLanguageChange(event.target.value)
              }
            }}
          >
            <option value="de">German</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="field" htmlFor="keyboard-layout">
          <span>Keyboard layout</span>
          <select
            id="keyboard-layout"
            aria-label="Keyboard layout"
            value={keyboardLayout}
            aria-describedby="keyboard-layout-help"
            onChange={(event) => {
              if (isKeyboardLayout(event.target.value)) {
                onKeyboardLayoutChange(event.target.value)
              }
            }}
          >
            <option value="german-qwertz">German QWERTZ</option>
            <option value="english-qwerty">English QWERTY</option>
            <option value="neo-2">Neo 2</option>
          </select>
          <small id="keyboard-layout-help" className="field-help">
            Typing follows your active OS and browser keyboard layout.
          </small>
        </label>

        <label className="field" htmlFor="exercise-category">
          <span>Exercise category</span>
          <select id="exercise-category" value="sentences" disabled>
            <option value="sentences">Sentences</option>
          </select>
        </label>
      </div>
    </section>
  )
}
