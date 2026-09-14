import { compareUnits, type ReceivedUnit, type TargetUnit } from './text'

export type SessionStatus = 'idle' | 'running' | 'completed'

export interface TypingSession {
  status: SessionStatus
  targetUnits: readonly TargetUnit[]
  acceptedTargetIndex: number
  activeError: ReceivedUnit | null
  printableAttemptCount: number
  startedAtMs: number | null
  completedAtMs: number | null
}

export type SessionAction =
  | { type: 'attempt'; units: readonly ReceivedUnit[]; atMs: number }
  | { type: 'backspace' }
  | { type: 'reset' }
  | { type: 'replace-target'; targetUnits: readonly TargetUnit[] }

export interface SessionMetricsSnapshot {
  progress: number
  elapsedMs: number
  accuracy: number | null
  cpm: number | null
  wpm: number | null
}

export const createTypingSession = (targetUnits: readonly TargetUnit[]): TypingSession => ({
  status: 'idle',
  targetUnits,
  acceptedTargetIndex: 0,
  activeError: null,
  printableAttemptCount: 0,
  startedAtMs: null,
  completedAtMs: null,
})

const applyAttempt = (
  session: TypingSession,
  unit: ReceivedUnit,
  atMs: number,
): TypingSession => {
  if (session.status === 'completed') {
    return session
  }

  const targetUnit = session.targetUnits[session.acceptedTargetIndex]
  if (!targetUnit) {
    return session
  }

  const startedAtMs = session.startedAtMs ?? atMs
  const printableAttemptCount = session.printableAttemptCount + 1

  if (compareUnits(targetUnit, unit) === 'mismatch') {
    return {
      ...session,
      status: 'running',
      activeError: unit,
      printableAttemptCount,
      startedAtMs,
    }
  }

  const acceptedTargetIndex = session.acceptedTargetIndex + 1
  const isComplete = acceptedTargetIndex === session.targetUnits.length

  return {
    ...session,
    status: isComplete ? 'completed' : 'running',
    acceptedTargetIndex,
    activeError: null,
    printableAttemptCount,
    startedAtMs,
    completedAtMs: isComplete ? atMs : null,
  }
}

export const typingSessionReducer = (
  session: TypingSession,
  action: SessionAction,
): TypingSession => {
  switch (action.type) {
    case 'attempt': {
      let nextSession = session

      for (const unit of action.units) {
        if (nextSession.status === 'completed') {
          break
        }
        nextSession = applyAttempt(nextSession, unit, action.atMs)
      }

      return nextSession
    }
    case 'backspace':
      if (session.status === 'completed' || session.activeError === null) {
        return session
      }
      return { ...session, activeError: null }
    case 'reset':
      return createTypingSession(session.targetUnits)
    case 'replace-target':
      return createTypingSession(action.targetUnits)
  }
}

export const getElapsedMs = (session: TypingSession, nowMs: number) => {
  if (session.startedAtMs === null) {
    return 0
  }

  const endMs = session.completedAtMs ?? nowMs
  return Math.max(0, endMs - session.startedAtMs)
}

export const getSessionMetrics = (
  session: TypingSession,
  nowMs: number,
): SessionMetricsSnapshot => {
  const elapsedMs = getElapsedMs(session, nowMs)
  const progress =
    session.targetUnits.length === 0
      ? 0
      : session.acceptedTargetIndex / session.targetUnits.length
  const accuracy =
    session.printableAttemptCount === 0
      ? null
      : session.acceptedTargetIndex / session.printableAttemptCount

  if (session.status === 'idle') {
    return { progress, elapsedMs, accuracy, cpm: null, wpm: null }
  }

  const cpm =
    elapsedMs <= 0 || session.acceptedTargetIndex === 0
      ? 0
      : session.acceptedTargetIndex / (elapsedMs / 60_000)

  return { progress, elapsedMs, accuracy, cpm, wpm: cpm / 5 }
}
