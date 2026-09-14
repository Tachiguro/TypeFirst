import { useEffect, useMemo, useRef } from 'react'
import { type LanguageId } from '../catalog'
import { getExerciseForLanguage } from '../data/exercises'
import {
  isGraphemeSegmentationSupported,
  segmentReceivedText,
  segmentTargetText,
} from '../engine/text'
import { useTypingSession } from '../hooks/useTypingSession'
import { SessionMetrics } from './SessionMetrics'
import { TypingSurface } from './TypingSurface'

interface TypingPracticeProps {
  language: LanguageId
  isActive: boolean
}

function SupportedTypingPractice({ language, isActive }: TypingPracticeProps) {
  const exercise = getExerciseForLanguage(language)
  const initialExerciseRef = useRef(exercise)
  const previousLanguageRef = useRef(language)
  const wasActiveRef = useRef(isActive)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialTargetUnits = useMemo(
    () =>
      segmentTargetText(initialExerciseRef.current.target, initialExerciseRef.current.language),
    [],
  )
  const typingSession = useTypingSession(initialTargetUnits)
  const replaceTarget = typingSession.replaceTarget

  useEffect(() => {
    if (previousLanguageRef.current === language) {
      return
    }

    replaceTarget(segmentTargetText(exercise.target, exercise.language))
    previousLanguageRef.current = language
  }, [exercise, language, replaceTarget])

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      inputRef.current?.focus()
    }
    wasActiveRef.current = isActive
  }, [isActive])

  const focusInput = () => inputRef.current?.focus()

  const handleReset = () => {
    typingSession.reset()
    focusInput()
  }

  const handleText = (text: string) => {
    typingSession.attemptUnits(segmentReceivedText(text, exercise.language))
  }

  return (
    <section className="practice-workspace" aria-label="Typing practice">
      <TypingSurface
        targetUnits={typingSession.session.targetUnits}
        acceptedTargetIndex={typingSession.session.acceptedTargetIndex}
        activeError={typingSession.session.activeError}
        status={typingSession.session.status}
        inputRef={inputRef}
        onText={handleText}
        onBackspace={typingSession.backspace}
      />
      <div className="practice-footer">
        <SessionMetrics metrics={typingSession.metrics} />
        <button className="button button-secondary" type="button" onClick={handleReset}>
          Restart
        </button>
      </div>
    </section>
  )
}

export function TypingPractice(props: TypingPracticeProps) {
  if (!isGraphemeSegmentationSupported()) {
    return (
      <section className="unsupported-browser" aria-label="Typing practice">
        <div role="alert">
          <p className="eyebrow">Browser support</p>
          <h2>Grapheme-safe typing is unavailable</h2>
          <p>
            TypeFirst requires a modern browser with Intl.Segmenter support to score text safely.
          </p>
        </div>
      </section>
    )
  }

  return <SupportedTypingPractice {...props} />
}
