import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App, { THEME_STORAGE_KEY } from './App'

const nativeSegmenter = Intl.Segmenter

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

const getTypingInput = () => screen.getByRole('textbox', { name: 'Typing input' })

const enterText = (text: string) => {
  fireEvent.input(getTypingInput(), {
    target: { value: text },
    inputType: 'insertText',
    data: text,
  })
}

const getMetricValue = (label: string) =>
  screen.getByText(label).closest('.metric')?.querySelector('dd')

describe('TypeFirst shell', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.matchMedia = createMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    Object.defineProperty(Intl, 'Segmenter', {
      configurable: true,
      value: nativeSegmenter,
      writable: true,
    })
  })

  it('renders the practice shell and its accessible controls', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'TypeFirst' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Keyboard layout' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Exercise category' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Typing surface' })).toBeInTheDocument()

    for (const label of ['Progress', 'Elapsed time', 'Accuracy', 'CPM', 'WPM']) {
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

  it('starts with the German exercise and exposes the English exercise', () => {
    render(<App />)

    expect(
      screen.getByLabelText('Exercise text: Flinke Hände tippen klare Wörter.'),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'en' },
    })
    expect(
      screen.getByLabelText('Exercise text: Quick hands type clear words.'),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'de' },
    })
    expect(
      screen.getByLabelText('Exercise text: Flinke Hände tippen klare Wörter.'),
    ).toBeInTheDocument()
  })

  it('resets the session when language changes and leaves selector focus intact', () => {
    render(<App />)
    enterText('F')
    expect(getMetricValue('Progress')).not.toHaveTextContent('0%')

    const language = screen.getByRole('combobox', { name: 'Language' })
    language.focus()
    fireEvent.change(language, { target: { value: 'en' } })

    expect(language).toHaveFocus()
    expect(getMetricValue('Progress')).toHaveTextContent('0%')
    expect(getMetricValue('Accuracy')).toHaveTextContent('—')
  })

  it('keeps layout selection as metadata without transforming or resetting scoring', () => {
    render(<App />)
    enterText('F')
    const progressAfterFirstUnit = getMetricValue('Progress')?.textContent

    fireEvent.change(screen.getByRole('combobox', { name: 'Keyboard layout' }), {
      target: { value: 'neo-2' },
    })

    expect(screen.getByRole('combobox', { name: 'Keyboard layout' })).toHaveValue('neo-2')
    expect(getMetricValue('Progress')).toHaveTextContent(progressAfterFirstUnit ?? '')

    enterText('l')
    expect(getMetricValue('Progress')?.textContent).not.toBe(progressAfterFirstUnit)
  })

  it('honestly exposes only the disabled Sentences category', () => {
    render(<App />)
    const category = screen.getByRole('combobox', { name: 'Exercise category' })

    expect(category).toBeDisabled()
    expect(within(category).getAllByRole('option')).toHaveLength(1)
    expect(within(category).getByRole('option', { name: 'Sentences' })).toBeInTheDocument()
  })

  it('focuses the native input from the keyboard or a surface click', () => {
    render(<App />)
    const input = getTypingInput()

    input.focus()
    expect(input).toHaveFocus()
    input.blur()

    fireEvent.click(screen.getByRole('region', { name: 'Typing surface' }))
    expect(input).toHaveFocus()
  })

  it('renders current, accepted, remaining, wrong, and visible-space states', () => {
    render(<App />)
    const surface = screen.getByRole('region', { name: 'Typing surface' })

    expect(surface.querySelectorAll('.exercise-unit-current')).toHaveLength(1)
    expect(surface.querySelectorAll('.exercise-unit-remaining').length).toBeGreaterThan(1)
    expect(surface.querySelectorAll('[data-space="true"]').length).toBeGreaterThan(0)
    expect(surface.querySelector('[data-space="true"]')).toHaveTextContent('·')

    enterText('F')
    expect(surface.querySelectorAll('.exercise-unit-accepted')).toHaveLength(1)

    enterText('x')
    expect(surface.querySelector('.exercise-unit-error')).toHaveTextContent('x')
    expect(screen.getByRole('status')).toHaveTextContent('Incorrect input')
  })

  it('retains corrected mistakes in accuracy', () => {
    render(<App />)
    enterText('x')
    enterText('F')

    expect(getMetricValue('Accuracy')).toHaveTextContent('50%')
    expect(screen.getByRole('status')).toHaveTextContent('Typing in progress')
  })

  it('clears only the current error with Backspace without rewinding progress', () => {
    render(<App />)
    const surface = screen.getByRole('region', { name: 'Typing surface' })
    enterText('F')
    enterText('x')
    const progressWithError = getMetricValue('Progress')?.textContent

    fireEvent.keyDown(getTypingInput(), { key: 'Backspace' })

    expect(surface.querySelector('.exercise-unit-error')).not.toBeInTheDocument()
    expect(surface.querySelectorAll('.exercise-unit-accepted')).toHaveLength(1)
    expect(getMetricValue('Progress')).toHaveTextContent(progressWithError ?? '')
    expect(getMetricValue('Accuracy')).toHaveTextContent('50%')
  })

  it('updates elapsed time, CPM, and WPM from the running clock', () => {
    vi.useFakeTimers()
    let nowMs = 1_000
    vi.spyOn(performance, 'now').mockImplementation(() => nowMs)
    render(<App />)

    enterText('F')
    nowMs = 61_000
    act(() => vi.advanceTimersByTime(1_000))

    expect(getMetricValue('Elapsed time')).toHaveTextContent('01:00')
    expect(getMetricValue('CPM')).toHaveTextContent('1')
    expect(getMetricValue('WPM')).toHaveTextContent('0.2')
  })

  it('resets the same exercise to idle and restores input focus', () => {
    render(<App />)
    enterText('F')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(getTypingInput()).toHaveFocus()
    expect(getMetricValue('Progress')).toHaveTextContent('0%')
    expect(getMetricValue('Elapsed time')).toHaveTextContent('00:00')
    expect(
      screen.getByLabelText('Exercise text: Flinke Hände tippen klare Wörter.'),
    ).toBeInTheDocument()
  })

  it('cycles Next from German to English to German and restores input focus', () => {
    render(<App />)
    const next = screen.getByRole('button', { name: 'Next' })

    fireEvent.click(next)
    expect(getTypingInput()).toHaveFocus()
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
    expect(
      screen.getByLabelText('Exercise text: Quick hands type clear words.'),
    ).toBeInTheDocument()

    fireEvent.click(next)
    expect(getTypingInput()).toHaveFocus()
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('de')
  })

  it('completes the exercise and freezes its metrics', () => {
    vi.useFakeTimers()
    let nowMs = 1_000
    vi.spyOn(performance, 'now').mockImplementation(() => nowMs)
    render(<App />)

    enterText('F')
    nowMs = 61_000
    enterText('linke Hände tippen klare Wörter.')

    expect(screen.getByRole('status')).toHaveTextContent('Exercise completed')
    expect(getTypingInput()).toHaveAttribute('readonly')
    expect(getMetricValue('Progress')).toHaveTextContent('100%')
    expect(getMetricValue('Elapsed time')).toHaveTextContent('01:00')

    nowMs = 121_000
    act(() => vi.advanceTimersByTime(10_000))
    expect(getMetricValue('Elapsed time')).toHaveTextContent('01:00')
  })

  it('shows an accessible unsupported-browser state without starting a session', () => {
    Object.defineProperty(Intl, 'Segmenter', {
      configurable: true,
      value: undefined,
      writable: true,
    })

    render(<App />)

    expect(screen.getByRole('alert')).toHaveTextContent('Grapheme-safe typing is unavailable')
    expect(screen.queryByRole('textbox', { name: 'Typing input' })).not.toBeInTheDocument()
  })
})
