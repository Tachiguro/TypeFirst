import { useEffect, useState } from 'react'
import { TypingPractice } from './components/TypingPractice'

export type ThemePreference = 'system' | 'light' | 'dark'

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

function App() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference)

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
    <div className="app-shell">
      <main className="practice-container">
        <header className="app-header">
          <div className="brand-group">
            <h1>TypeFirst</h1>
            <p>Focused typing practice</p>
          </div>

          <label className="theme-control" htmlFor="theme-preference">
            <span>Theme</span>
            <select
              id="theme-preference"
              value={themePreference}
              onChange={(event) => {
                if (isThemePreference(event.target.value)) {
                  setThemePreference(event.target.value)
                }
              }}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </header>

        <TypingPractice />
      </main>
    </div>
  )
}

export default App
