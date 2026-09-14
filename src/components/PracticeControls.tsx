import {
  LANGUAGES,
  KEYBOARD_LAYOUTS,
  isLanguageId,
  isKeyboardLayoutId,
  type LanguageId,
  type KeyboardLayoutId,
} from '../catalog'

interface PracticeControlsProps {
  language: LanguageId
  keyboardLayout: KeyboardLayoutId
  onLanguageChange: (language: LanguageId) => void
  onKeyboardLayoutChange: (layout: KeyboardLayoutId) => void
}

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
              if (isLanguageId(event.target.value)) {
                onLanguageChange(event.target.value)
              }
            }}
          >
            {LANGUAGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
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
              if (isKeyboardLayoutId(event.target.value)) {
                onKeyboardLayoutChange(event.target.value)
              }
            }}
          >
            {KEYBOARD_LAYOUTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
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
