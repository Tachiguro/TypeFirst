export function PracticeControls() {
  return (
    <section className="practice-controls" aria-labelledby="practice-options-heading">
      <div className="section-heading">
        <p className="eyebrow">Practice setup</p>
        <h2 id="practice-options-heading">Choose your exercise</h2>
      </div>

      <div className="control-grid">
        <label className="field" htmlFor="language">
          <span>Language</span>
          <select id="language" defaultValue="german">
            <option value="german">German</option>
            <option value="english">English</option>
          </select>
        </label>

        <label className="field" htmlFor="keyboard-layout">
          <span>Keyboard layout</span>
          <select id="keyboard-layout" defaultValue="german-qwertz">
            <option value="german-qwertz">German QWERTZ</option>
            <option value="english-qwerty">English QWERTY</option>
            <option value="neo-2">Neo 2</option>
          </select>
        </label>

        <label className="field" htmlFor="exercise-category">
          <span>Exercise category</span>
          <select id="exercise-category" defaultValue="characters">
            <option value="characters">Characters</option>
            <option value="n-grams">N-grams</option>
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
          </select>
        </label>
      </div>
    </section>
  )
}
