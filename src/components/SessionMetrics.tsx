const metrics = [
  { label: 'Progress', value: '0%' },
  { label: 'Elapsed time', value: '00:00' },
  { label: 'Accuracy', value: '—' },
  { label: 'CPM', value: '—' },
]

export function SessionMetrics() {
  return (
    <section className="metrics-section" aria-labelledby="session-metrics-heading">
      <h2 id="session-metrics-heading" className="visually-hidden">
        Session metrics
      </h2>
      <dl className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
