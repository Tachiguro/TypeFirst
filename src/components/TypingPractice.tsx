import { useMemo, useRef, useState } from 'react'
import {
  DEFAULT_KEYBOARD_LAYOUT_ID,
  DEFAULT_LANGUAGE_ID,
  type KeyboardLayoutId,
  type LanguageId,
} from '../catalog'
import {
  getExerciseForLanguage,
  getNextExercise,
  type Exercise,
} from '../data/exercises'
import {
  isGraphemeSegmentationSupported,
  segmentReceivedText,
  segmentTargetText,
} from '../engine/text'
import { useTypingSession } from '../hooks/useTypingSession'
import { PracticeControls } from './PracticeControls'
import { SessionMetrics } from './SessionMetrics'
import { TypingSurface } from './TypingSurface'

const DEFAULT_EXERCISE = getExerciseForLanguage(DEFAULT_LANGUAGE_ID)

function SupportedTypingPractice() {
  const [exercise, setExercise] = useState<Exercise>(DEFAULT_EXERCISE)
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayoutId>(DEFAULT_KEYBOARD_LAYOUT_ID)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialTargetUnits = useMemo(
    () => segmentTargetText(DEFAULT_EXERCISE.target, DEFAULT_EXERCISE.language),
    [],
  )
  const typingSession = useTypingSession(initialTargetUnits)

  const replaceExercise = (nextExercise: Exercise) => {
    setExercise(nextExercise)
    typingSession.replaceTarget(segmentTargetText(nextExercise.target, nextExercise.language))
  }

  const handleLanguageChange = (language: LanguageId) => {
    replaceExercise(getExerciseForLanguage(language))
  }

  const focusInput = () => inputRef.current?.focus()

  const handleReset = () => {
    typingSession.reset()
    focusInput()
  }

  const handleNext = () => {
    replaceExercise(getNextExercise(exercise.id))
    focusInput()
  }

  const handleText = (text: string) => {
    typingSession.attemptUnits(segmentReceivedText(text, exercise.language))
  }

  return (
    <section className="practice-card" aria-label="Typing practice">
      <PracticeControls
        language={exercise.language}
        keyboardLayout={keyboardLayout}
        onLanguageChange={handleLanguageChange}
        onKeyboardLayoutChange={setKeyboardLayout}
      />
      <TypingSurface
        targetUnits={typingSession.session.targetUnits}
        acceptedTargetIndex={typingSession.session.acceptedTargetIndex}
        activeError={typingSession.session.activeError}
        status={typingSession.session.status}
        inputRef={inputRef}
        onText={handleText}
        onBackspace={typingSession.backspace}
      />
      <SessionMetrics metrics={typingSession.metrics} />

      <div className="session-actions" aria-label="Session actions">
        <button className="button button-secondary" type="button" onClick={handleReset}>
          Reset
        </button>
        <button className="button button-primary" type="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </section>
  )
}

export function TypingPractice() {
  if (!isGraphemeSegmentationSupported()) {
    return (
      <section className="practice-card unsupported-browser" aria-label="Typing practice">
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

  return <SupportedTypingPractice />
}
