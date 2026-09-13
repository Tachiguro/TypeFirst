import { beforeEach, describe, expect, it, vi } from 'vitest'
import indexHtml from '../index.html?raw'

const bootstrapScript = new DOMParser()
  .parseFromString(indexHtml, 'text/html')
  .querySelector('head script')?.textContent

if (!bootstrapScript) {
  throw new Error('Theme bootstrap script is missing from index.html.')
}

const runBootstrap = ({
  storedPreference,
  systemPrefersDark,
  storageThrows = false,
  matchMediaAvailable = true,
}: {
  storedPreference?: string
  systemPrefersDark: boolean
  storageThrows?: boolean
  matchMediaAvailable?: boolean
}) => {
  window.matchMedia = matchMediaAvailable
    ? vi.fn().mockReturnValue({ matches: systemPrefersDark })
    : undefined as unknown as typeof window.matchMedia

  if (storedPreference !== undefined) {
    window.localStorage.setItem('typefirst.theme', storedPreference)
  }

  const getItem = storageThrows
    ? vi.spyOn(window.Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable')
      })
    : undefined

  try {
    new Function(bootstrapScript)()
  } finally {
    getItem?.mockRestore()
  }

  return document.documentElement.dataset.theme
}

describe('pre-paint theme bootstrap', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('applies a stored dark preference before the application loads', () => {
    expect(runBootstrap({ storedPreference: 'dark', systemPrefersDark: false })).toBe('dark')
  })

  it('treats a malformed stored preference as system', () => {
    expect(runBootstrap({ storedPreference: 'unsupported', systemPrefersDark: true })).toBe('dark')
  })

  it('uses the dark system preference when no preference is stored', () => {
    expect(runBootstrap({ systemPrefersDark: true })).toBe('dark')
  })

  it('falls back to the system preference when storage is unavailable', () => {
    expect(runBootstrap({ storageThrows: true, systemPrefersDark: true })).toBe('dark')
  })

  it('falls back to light when matchMedia is unavailable', () => {
    expect(runBootstrap({ matchMediaAvailable: false, systemPrefersDark: true })).toBe('light')
  })
})
