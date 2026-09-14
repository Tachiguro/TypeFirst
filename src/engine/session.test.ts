import { describe, expect, it } from 'vitest'
import {
  createTypingSession,
  getElapsedMs,
  getSessionMetrics,
  typingSessionReducer,
  type TypingSession,
} from './session'
import { segmentReceivedText, segmentTargetText } from './text'

const target = (text: string) => segmentTargetText(text, 'en')
const received = (text: string) => segmentReceivedText(text, 'en')

const attempt = (session: TypingSession, text: string, atMs: number) =>
  typingSessionReducer(session, { type: 'attempt', units: received(text), atMs })

describe('typing session reducer', () => {
  it('creates a fresh idle session', () => {
    const session = createTypingSession(target('ab'))

    expect(session).toMatchObject({
      status: 'idle',
      acceptedTargetIndex: 0,
      activeError: null,
      printableAttemptCount: 0,
      startedAtMs: null,
      completedAtMs: null,
    })
  })

  it('starts on the first correct attempt and progresses', () => {
    const session = attempt(createTypingSession(target('ab')), 'a', 120)

    expect(session).toMatchObject({
      status: 'running',
      acceptedTargetIndex: 1,
      printableAttemptCount: 1,
      startedAtMs: 120,
    })
  })

  it('starts on a wrong attempt without advancing', () => {
    const session = attempt(createTypingSession(target('a')), 'x', 90)

    expect(session).toMatchObject({
      status: 'running',
      acceptedTargetIndex: 0,
      printableAttemptCount: 1,
      startedAtMs: 90,
      activeError: { value: 'x', normalized: 'x' },
    })
  })

  it('replaces a wrong retry and accepts a correct retry in place', () => {
    let session = attempt(createTypingSession(target('a')), 'x', 10)
    session = attempt(session, 'y', 20)

    expect(session.acceptedTargetIndex).toBe(0)
    expect(session.activeError?.value).toBe('y')
    expect(session.printableAttemptCount).toBe(2)

    session = attempt(session, 'a', 30)

    expect(session).toMatchObject({
      status: 'completed',
      acceptedTargetIndex: 1,
      activeError: null,
      printableAttemptCount: 3,
      completedAtMs: 30,
    })
  })

  it('clears only an active error with Backspace and never rewinds accepted text', () => {
    let session = attempt(createTypingSession(target('ab')), 'a', 10)
    const unchanged = typingSessionReducer(session, { type: 'backspace' })
    expect(unchanged).toBe(session)

    session = attempt(session, 'x', 20)
    session = typingSessionReducer(session, { type: 'backspace' })

    expect(session.acceptedTargetIndex).toBe(1)
    expect(session.printableAttemptCount).toBe(2)
    expect(session.activeError).toBeNull()
  })

  it('retains a prior mistake as 50% accuracy after correction', () => {
    let session = attempt(createTypingSession(target('a')), 'x', 0)
    session = attempt(session, 'a', 1_000)

    expect(getSessionMetrics(session, 50_000).accuracy).toBe(0.5)
  })

  it('completes on the final unit, freezes elapsed time, and ignores later input', () => {
    let session = attempt(createTypingSession(target('ab')), 'a', 1_000)
    session = attempt(session, 'b', 3_500)
    const completed = session

    expect(completed.status).toBe('completed')
    expect(getElapsedMs(completed, 100_000)).toBe(2_500)
    expect(attempt(completed, 'x', 5_000)).toBe(completed)
    expect(typingSessionReducer(completed, { type: 'backspace' })).toBe(completed)
  })

  it('stops a multi-grapheme batch as soon as the target completes', () => {
    const session = typingSessionReducer(createTypingSession(target('ab')), {
      type: 'attempt',
      units: received('abc'),
      atMs: 500,
    })

    expect(session).toMatchObject({
      status: 'completed',
      acceptedTargetIndex: 2,
      printableAttemptCount: 2,
    })
  })

  it('resets the same target and replaces a target with a fresh session', () => {
    const originalTarget = target('ab')
    let session = attempt(createTypingSession(originalTarget), 'a', 100)
    session = typingSessionReducer(session, { type: 'reset' })

    expect(session.targetUnits).toBe(originalTarget)
    expect(session.status).toBe('idle')
    expect(session.acceptedTargetIndex).toBe(0)

    const replacement = target('xy')
    session = typingSessionReducer(session, { type: 'replace-target', targetUnits: replacement })

    expect(session.targetUnits).toBe(replacement)
    expect(session).toMatchObject({
      status: 'idle',
      printableAttemptCount: 0,
      startedAtMs: null,
      completedAtMs: null,
    })
  })

  it('derives progress, accuracy, CPM, and WPM from deterministic time', () => {
    const session = attempt(createTypingSession(target('ab')), 'a', 1_000)
    const metrics = getSessionMetrics(session, 61_000)

    expect(metrics).toEqual({
      progress: 0.5,
      elapsedMs: 60_000,
      accuracy: 1,
      cpm: 1,
      wpm: 0.2,
    })
  })

  it('uses stable idle and zero-time metric safeguards', () => {
    const idleMetrics = getSessionMetrics(createTypingSession(target('a')), 5_000)
    expect(idleMetrics).toEqual({
      progress: 0,
      elapsedMs: 0,
      accuracy: null,
      cpm: null,
      wpm: null,
    })

    const completedImmediately = attempt(createTypingSession(target('a')), 'a', 5_000)
    expect(getSessionMetrics(completedImmediately, 5_000)).toEqual({
      progress: 1,
      elapsedMs: 0,
      accuracy: 1,
      cpm: 0,
      wpm: 0,
    })
  })

  it('scores a space as an ordinary target grapheme', () => {
    const session = attempt(createTypingSession(target(' ')), ' ', 10)
    expect(session.status).toBe('completed')
    expect(session.acceptedTargetIndex).toBe(1)
  })
})
