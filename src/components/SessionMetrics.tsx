import type { SessionMetricsSnapshot } from '../engine/session'

interface SessionMetricsProps {
  metrics: SessionMetricsSnapshot
}

const formatElapsed = (elapsedMs: number) => {
  const elapsedSeconds = Math.floor(elapsedMs / 1_000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const formatRatio = (ratio: number | null) => {
  if (ratio === null) {
    return '—'
  }

  const percentage = Math.round(ratio * 1_000) / 10
  return `${Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(1)}%`
}

export function SessionMetrics({ metrics }: SessionMetricsProps) {
  const values = [
    { label: 'Progress', value: `${Math.round(metrics.progress * 100)}%` },
    { label: 'Elapsed time', value: formatElapsed(metrics.elapsedMs) },
    { label: 'Accuracy', value: formatRatio(metrics.accuracy) },
    { label: 'CPM', value: metrics.cpm === null ? '—' : String(Math.round(metrics.cpm)) },
    { label: 'WPM', value: metrics.wpm === null ? '—' : metrics.wpm.toFixed(1) },
  ]

  return (
    <section className="metrics-section" aria-labelledby="session-metrics-heading">
      <h2 id="session-metrics-heading" className="visually-hidden">
        Session metrics
      </h2>
      <dl className="metrics-grid">
        {values.map((metric) => (
          <div className="metric" key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
