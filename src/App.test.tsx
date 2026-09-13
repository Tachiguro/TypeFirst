import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App, { THEME_STORAGE_KEY } from './App'

const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

describe('TypeFirst shell', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.matchMedia = createMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
  })

  it('renders the practice shell and its accessible controls', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'TypeFirst' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Keyboard layout' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Exercise category' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Typing surface' })).toBeInTheDocument()

    for (const label of ['Progress', 'Elapsed time', 'Accuracy', 'CPM']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('provides a keyboard-accessible theme control', () => {
    render(<App />)

    const themeControl = screen.getByRole('combobox', { name: 'Theme' })
    themeControl.focus()

    expect(themeControl).toHaveFocus()
  })

  it('updates and stores the selected theme preference', async () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Theme' }), {
      target: { value: 'dark' },
    })

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('uses a stored dark preference for the initial application state', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    render(<App />)

    expect(screen.getByRole('combobox', { name: 'Theme' })).toHaveValue('dark')

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
  })

  it('treats a malformed stored preference as system', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'unsupported')
    window.matchMedia = createMatchMedia(true)
    render(<App />)

    expect(screen.getByRole('combobox', { name: 'Theme' })).toHaveValue('system')

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
  })

  it('resolves the system preference safely', async () => {
    window.matchMedia = createMatchMedia(true)
    render(<App />)

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
  })
})
