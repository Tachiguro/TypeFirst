import { useEffect, useState } from 'react'

export interface BeforeInstallPromptChoiceResult {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<BeforeInstallPromptChoiceResult>
  prompt(): Promise<void>
}

export interface PwaInstallState {
  canInstall: boolean
  isInstalled: boolean
  install: () => Promise<BeforeInstallPromptChoiceResult['outcome'] | null>
}

const checkIsStandalone = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(display-mode: standalone)').matches
      : false
  } catch {
    return false
  }
}

export function usePwaInstall(): PwaInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstalled(true)
    }

    let standaloneMatcher: MediaQueryList | null = null
    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsInstalled(true)
        setDeferredPrompt(null)
      }
    }

    try {
      if (typeof window.matchMedia === 'function') {
        standaloneMatcher = window.matchMedia('(display-mode: standalone)')
        if (standaloneMatcher.matches) {
          setIsInstalled(true)
        }
        standaloneMatcher.addEventListener?.('change', handleDisplayModeChange)
      }
    } catch {
      // Graceful fallback when matchMedia fails or is unsupported.
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      try {
        standaloneMatcher?.removeEventListener?.('change', handleDisplayModeChange)
      } catch {
        // Safe cleanup
      }
    }
  }, [])

  const install = async (): Promise<BeforeInstallPromptChoiceResult['outcome'] | null> => {
    if (!deferredPrompt) {
      return null
    }

    const promptToExecute = deferredPrompt
    setDeferredPrompt(null)

    try {
      await promptToExecute.prompt()
      const choice = await promptToExecute.userChoice
      return choice.outcome
    } catch {
      return null
    }
  }

  const canInstall = !isInstalled && deferredPrompt !== null

  return {
    canInstall,
    isInstalled,
    install,
  }
}
