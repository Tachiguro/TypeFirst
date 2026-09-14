import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  createTypingSession,
  getSessionMetrics,
  typingSessionReducer,
} from '../engine/session'
import type { ReceivedUnit, TargetUnit } from '../engine/text'

const defaultClock = () => performance.now()

interface TypingSessionOptions {
  clock?: () => number
  refreshIntervalMs?: number
}

export const useTypingSession = (
  initialTargetUnits: readonly TargetUnit[],
  { clock = defaultClock, refreshIntervalMs = 1_000 }: TypingSessionOptions = {},
) => {
  const [session, dispatch] = useReducer(
    typingSessionReducer,
    initialTargetUnits,
    createTypingSession,
  )
  const [renderNowMs, setRenderNowMs] = useState(0)

  useEffect(() => {
    if (session.status !== 'running') {
      return undefined
    }

    const intervalId = window.setInterval(() => setRenderNowMs(clock()), refreshIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [clock, refreshIntervalMs, session.status])

  const attemptUnits = useCallback(
    (units: readonly ReceivedUnit[]) => {
      if (units.length === 0) {
        return
      }

      const atMs = clock()
      setRenderNowMs(atMs)
      dispatch({ type: 'attempt', units, atMs })
    },
    [clock],
  )

  const backspace = useCallback(() => dispatch({ type: 'backspace' }), [])

  const reset = useCallback(() => {
    setRenderNowMs(0)
    dispatch({ type: 'reset' })
  }, [])

  const replaceTarget = useCallback((targetUnits: readonly TargetUnit[]) => {
    setRenderNowMs(0)
    dispatch({ type: 'replace-target', targetUnits })
  }, [])

  const metrics = useMemo(
    () => getSessionMetrics(session, renderNowMs),
    [renderNowMs, session],
  )

  return {
    session,
    metrics,
    attemptUnits,
    backspace,
    reset,
    replaceTarget,
  }
}
