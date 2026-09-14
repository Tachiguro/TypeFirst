import { useCallback, useEffect, useState, type RefObject } from 'react'

export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [isSupported, setIsSupported] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const synchronizeState = useCallback(() => {
    setIsFullscreen(document.fullscreenElement === targetRef.current)
  }, [targetRef])

  useEffect(() => {
    const target = targetRef.current
    const supported =
      typeof target?.requestFullscreen === 'function' &&
      typeof document.exitFullscreen === 'function' &&
      document.fullscreenEnabled === true

    setIsSupported(supported)
    synchronizeState()
    document.addEventListener('fullscreenchange', synchronizeState)

    return () => document.removeEventListener('fullscreenchange', synchronizeState)
  }, [synchronizeState, targetRef])

  const toggleFullscreen = useCallback(async () => {
    const target = targetRef.current
    if (
      !target ||
      typeof target.requestFullscreen !== 'function' ||
      typeof document.exitFullscreen !== 'function'
    ) {
      return
    }

    try {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen()
      } else if (document.fullscreenEnabled === true) {
        await target.requestFullscreen()
      }
    } catch {
      // Fullscreen can be rejected by browser policy; document state remains authoritative.
    } finally {
      synchronizeState()
    }
  }, [synchronizeState, targetRef])

  return { isSupported, isFullscreen, toggleFullscreen }
}
