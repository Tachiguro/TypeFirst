import { Fragment, type RefObject } from 'react'
import type { SessionStatus } from '../engine/session'
import type { ReceivedUnit, TargetUnit } from '../engine/text'
import { TypingInput } from './TypingInput'

interface TypingSurfaceProps {
  targetUnits: readonly TargetUnit[]
  acceptedTargetIndex: number
  activeError: ReceivedUnit | null
  status: SessionStatus
  inputRef: RefObject<HTMLInputElement | null>
  onText: (text: string) => void
  onBackspace: () => void
}

const displayUnit = (value: string) => (value === ' ' ? '·' : value)
const describeUnit = (value: string) => (value === ' ' ? 'space' : value)

export function TypingSurface({
  targetUnits,
  acceptedTargetIndex,
  activeError,
  status,
  inputRef,
  onText,
  onBackspace,
}: TypingSurfaceProps) {
  const targetText = targetUnits.map(({ value }) => value).join('')
  const expectedUnit = targetUnits[acceptedTargetIndex]
  const statusText =
    status === 'completed'
      ? 'Exercise completed.'
      : activeError && expectedUnit
        ? `Incorrect input. Expected ${describeUnit(expectedUnit.value)}. Retry or press Backspace.`
        : status === 'running'
          ? 'Typing in progress.'
          : 'Focus the typing input and start typing.'

  return (
    <section
      className="typing-surface"
      aria-labelledby="typing-surface-heading"
      data-status={status}
      onClick={() => inputRef.current?.focus()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => event.preventDefault()}
    >
      <div className="typing-surface-header">
        <div>
          <p className="eyebrow">Active practice</p>
          <h2 id="typing-surface-heading">Typing surface</h2>
        </div>
        <span className="session-badge">{status}</span>
      </div>

      <p className="exercise-text" aria-label={`Exercise text: ${targetText}`}>
        <span aria-hidden="true">
          {targetUnits.map((unit, index) => {
            const isAccepted = index < acceptedTargetIndex
            const isCurrent = index === acceptedTargetIndex && status !== 'completed'
            const visibleValue = isCurrent && activeError ? activeError.value : unit.value
            const className = isAccepted
              ? 'exercise-unit exercise-unit-accepted'
              : isCurrent && activeError
                ? 'exercise-unit exercise-unit-error'
                : isCurrent
                  ? 'exercise-unit exercise-unit-current'
                  : 'exercise-unit exercise-unit-remaining'

            return (
              <Fragment key={`${index}-${unit.normalized}`}>
                <span
                  className={className}
                  data-space={visibleValue === ' ' ? 'true' : undefined}
                >
                  {displayUnit(visibleValue)}
                </span>
                {unit.value === ' ' && <wbr />}
              </Fragment>
            )
          })}
        </span>
      </p>

      <TypingInput
        ref={inputRef}
        status={status}
        describedBy="typing-status"
        onText={onText}
        onBackspace={onBackspace}
      />

      <p
        id="typing-status"
        className="surface-note"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusText}
      </p>
    </section>
  )
}
