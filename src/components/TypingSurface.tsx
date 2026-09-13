export function TypingSurface() {
  return (
    <section className="typing-surface" aria-labelledby="typing-surface-heading">
      <div className="typing-surface-header">
        <div>
          <p className="eyebrow">Practice preview</p>
          <h2 id="typing-surface-heading">Typing surface</h2>
        </div>
        <span className="preview-badge">Coming next</span>
      </div>

      <p className="exercise-text">
        <span className="exercise-text-current">Pack my</span>{' '}
        <span>box with five dozen liquor jugs.</span>
      </p>

      <p className="surface-note">Typing input will be added in a future package.</p>
    </section>
  )
}
