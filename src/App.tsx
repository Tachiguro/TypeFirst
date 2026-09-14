import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_KEYBOARD_LAYOUT_ID,
  DEFAULT_LANGUAGE_ID,
  type KeyboardLayoutId,
  type LanguageId,
} from './catalog'
import { SettingsView, type ThemePreference } from './components/SettingsView'
import { TypingPractice } from './components/TypingPractice'
import { useFullscreen } from './hooks/useFullscreen'

export type { ThemePreference } from './components/SettingsView'

type UiMode = 'practice' | 'settings'

export const THEME_STORAGE_KEY = 'typefirst.theme'

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark'

const readThemePreference = (): ThemePreference => {
  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(storedPreference) ? storedPreference : 'system'
  } catch {
    return 'system'
  }
}

const getColorScheme = (): MediaQueryList | null => {
  try {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null
  } catch {
    return null
  }
}

const resolveTheme = (preference: ThemePreference, colorScheme: MediaQueryList | null) =>
  preference === 'system' ? (colorScheme?.matches ? 'dark' : 'light') : preference

function FullscreenIcon({ isFullscreen }: { isFullscreen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="fullscreen-icon"
      focusable="false"
      viewBox="0 0 24 24"
    >
      {isFullscreen ? (
        <path d="M9 4v5H4m11-5v5h5M9 20v-5H4m11 5v-5h5" />
      ) : (
        <path d="M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5" />
      )}
    </svg>
  )
}

function App() {
  const [uiMode, setUiMode] = useState<UiMode>('practice')
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference)
  const [language, setLanguage] = useState<LanguageId>(DEFAULT_LANGUAGE_ID)
  const [keyboardLayout, setKeyboardLayout] =
    useState<KeyboardLayoutId>(DEFAULT_KEYBOARD_LAYOUT_ID)
  const appShellRef = useRef<HTMLDivElement>(null)
  const { isSupported: isFullscreenSupported, isFullscreen, toggleFullscreen } =
    useFullscreen(appShellRef)

  useEffect(() => {
    const colorScheme = getColorScheme()

    const applyTheme = () => {
      document.documentElement.dataset.theme = resolveTheme(themePreference, colorScheme)
    }

    applyTheme()

    if (themePreference === 'system' && colorScheme) {
      colorScheme.addEventListener('change', applyTheme)
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }

    return () => {
      if (themePreference === 'system' && colorScheme) {
        colorScheme.removeEventListener('change', applyTheme)
      }
    }
  }, [themePreference])

  return (
    <div className="app-shell" ref={appShellRef}>
      <main className="app-container">
        <div className="practice-view" hidden={uiMode !== 'practice'}>
          <header className="app-header">
            <div className="brand-group">
              <h1>TypeFirst</h1>
              <p>Focused typing practice</p>
            </div>

            <div className="header-actions">
              {isFullscreenSupported && (
                <button
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  className="button button-secondary fullscreen-button"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  type="button"
                  onClick={() => void toggleFullscreen()}
                >
                  <FullscreenIcon isFullscreen={isFullscreen} />
                </button>
              )}
              <button
                className="button button-secondary settings-button"
                type="button"
                onClick={() => setUiMode('settings')}
              >
                Settings
              </button>
            </div>
          </header>

          <TypingPractice language={language} isActive={uiMode === 'practice'} />
        </div>

        {uiMode === 'settings' && (
          <SettingsView
            themePreference={themePreference}
            language={language}
            keyboardLayout={keyboardLayout}
            onBack={() => setUiMode('practice')}
            onThemeChange={setThemePreference}
            onLanguageChange={setLanguage}
            onKeyboardLayoutChange={setKeyboardLayout}
          />
        )}
      </main>
    </div>
  )
}

export default App
