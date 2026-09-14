import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App, { THEME_STORAGE_KEY } from './App'

const nativeSegmenter = Intl.Segmenter
const originalRequestFullscreen = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'requestFullscreen',
)
const originalExitFullscreen = Object.getOwnPropertyDescriptor(document, 'exitFullscreen')
const originalFullscreenElement = Object.getOwnPropertyDescriptor(document, 'fullscreenElement')
const originalFullscreenEnabled = Object.getOwnPropertyDescriptor(document, 'fullscreenEnabled')

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

const restoreProperty = (
  target: object,
  property: string,
  descriptor: PropertyDescriptor | undefined,
) => {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor)
  } else {
    Reflect.deleteProperty(target, property)
  }
}

const removeFullscreenApi = () => {
  Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
  Reflect.deleteProperty(document, 'exitFullscreen')
  Reflect.deleteProperty(document, 'fullscreenEnabled')
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    value: null,
  })
}

const installFullscreenApi = (fullscreenEnabled = true) => {
  let fullscreenElement: Element | null = null
  const requestFullscreen = vi.fn(function (this: HTMLElement) {
    fullscreenElement = this
    return Promise.resolve()
  })
  const exitFullscreen = vi.fn(() => {
    fullscreenElement = null
    return Promise.resolve()
  })

  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
    configurable: true,
    value: requestFullscreen,
  })
  Object.defineProperty(document, 'exitFullscreen', {
    configurable: true,
    value: exitFullscreen,
  })
  Object.defineProperty(document, 'fullscreenEnabled', {
    configurable: true,
    value: fullscreenEnabled,
    writable: true,
  })
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => fullscreenElement,
  })

  return {
    requestFullscreen,
    exitFullscreen,
    setFullscreenElement: (element: Element | null) => {
      fullscreenElement = element
    },
  }
}

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

const openSettings = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
}

const returnToPractice = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
}

describe('TypeFirst shell', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.matchMedia = createMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    removeFullscreenApi()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    Object.defineProperty(Intl, 'Segmenter', {
      configurable: true,
      value: nativeSegmenter,
      writable: true,
    })
    restoreProperty(HTMLElement.prototype, 'requestFullscreen', originalRequestFullscreen)
    restoreProperty(document, 'exitFullscreen', originalExitFullscreen)
    restoreProperty(document, 'fullscreenElement', originalFullscreenElement)
    restoreProperty(document, 'fullscreenEnabled', originalFullscreenEnabled)
  })

  it('renders the initial Practice view without permanent preference, category, or Next controls', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'TypeFirst' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Typing surface' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByText('Exercise category')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Enter fullscreen' })).not.toBeInTheDocument()

    for (const label of ['Progress', 'Elapsed time', 'Accuracy', 'CPM', 'WPM']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('opens a dedicated Settings view while keeping the Practice DOM mounted', () => {
    render(<App />)
    const practiceView = document.querySelector('.practice-view')
    const typingInput = document.querySelector('.typing-input')

    openSettings()

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Typing surface' })).not.toBeInTheDocument()
    expect(practiceView).toHaveAttribute('hidden')
    expect(typingInput).toBeInTheDocument()
    expect(document.querySelector('.typing-input')).toBe(typingInput)
  })

  it('returns from Settings, restores typing focus, and preserves the session', async () => {
    render(<App />)
    enterText('F')
    const input = getTypingInput()
    const progress = getMetricValue('Progress')?.textContent
    const accuracy = getMetricValue('Accuracy')?.textContent

    openSettings()
    returnToPractice()

    await waitFor(() => expect(input).toHaveFocus())
    expect(getTypingInput()).toBe(input)
    expect(getMetricValue('Progress')).toHaveTextContent(progress ?? '')
    expect(getMetricValue('Accuracy')).toHaveTextContent(accuracy ?? '')
  })

  it('keeps the running timer active while Settings is open', () => {
    vi.useFakeTimers()
    let nowMs = 1_000
    vi.spyOn(performance, 'now').mockImplementation(() => nowMs)
    render(<App />)
    enterText('F')
    openSettings()

    nowMs = 61_000
    act(() => vi.advanceTimersByTime(1_000))
    returnToPractice()

    expect(getMetricValue('Elapsed time')).toHaveTextContent('01:00')
    expect(getMetricValue('Progress')).not.toHaveTextContent('0%')
  })

  it('updates and stores theme preference without resetting the session', async () => {
    render(<App />)
    enterText('F')
    const progress = getMetricValue('Progress')?.textContent
    openSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }))

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    returnToPractice()
    expect(getMetricValue('Progress')).toHaveTextContent(progress ?? '')
  })

  it('uses a stored dark preference for the initial application state', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    render(<App />)
    openSettings()

    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  })

  it('treats a malformed stored preference as system', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'unsupported')
    window.matchMedia = createMatchMedia(true)
    render(<App />)
    openSettings()

    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  })

  it('resolves the system theme preference safely', async () => {
    window.matchMedia = createMatchMedia(true)
    render(<App />)

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  })

  it('intentionally replaces the exercise and resets the session when language changes', () => {
    render(<App />)
    enterText('F')
    expect(getMetricValue('Progress')).not.toHaveTextContent('0%')
    openSettings()

    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    returnToPractice()

    expect(screen.getByLabelText('Exercise text: Quick hands type clear words.')).toBeInTheDocument()
    expect(getMetricValue('Progress')).toHaveTextContent('0%')
    expect(getMetricValue('Accuracy')).toHaveTextContent('—')
  })

  it('preserves the selected keyboard layout across language changes', () => {
    render(<App />)
    openSettings()
    fireEvent.click(screen.getByRole('button', { name: 'German Neo 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    returnToPractice()
    openSettings()

    expect(screen.getByRole('button', { name: 'German Neo 2' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('keeps keyboard layout selection as metadata without resetting scoring', () => {
    render(<App />)
    enterText('F')
    const progressAfterFirstUnit = getMetricValue('Progress')?.textContent
    openSettings()

    fireEvent.click(screen.getByRole('button', { name: 'German Neo 2' }))
    returnToPractice()

    expect(getMetricValue('Progress')).toHaveTextContent(progressAfterFirstUnit ?? '')
    enterText('l')
    expect(getMetricValue('Progress')?.textContent).not.toBe(progressAfterFirstUnit)
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

  it('renders unchanged unit states and a word-break opportunity after every scoreable space', () => {
    render(<App />)
    const surface = screen.getByRole('region', { name: 'Typing surface' })
    const spaceCount = surface.querySelectorAll('[data-space="true"]').length

    expect(surface.querySelectorAll('.exercise-unit-current')).toHaveLength(1)
    expect(surface.querySelectorAll('.exercise-unit-remaining').length).toBeGreaterThan(1)
    expect(spaceCount).toBeGreaterThan(0)
    expect(surface.querySelector('[data-space="true"]')).toHaveTextContent('·')
    expect(surface.querySelectorAll('wbr')).toHaveLength(spaceCount)
    expect(
      screen.getByLabelText('Exercise text: Flinke Hände tippen klare Wörter.'),
    ).toBeInTheDocument()

    enterText('F')
    expect(surface.querySelectorAll('.exercise-unit-accepted')).toHaveLength(1)
    enterText('x')
    expect(surface.querySelector('.exercise-unit-error')).toHaveTextContent('x')
    expect(screen.getByRole('status')).toHaveTextContent('Incorrect input')
    expect(surface.querySelectorAll('wbr')).toHaveLength(spaceCount)
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

  it('restarts the same exercise to idle and restores input focus', () => {
    render(<App />)
    enterText('F')

    fireEvent.click(screen.getByRole('button', { name: 'Restart' }))

    expect(getTypingInput()).toHaveFocus()
    expect(getMetricValue('Progress')).toHaveTextContent('0%')
    expect(getMetricValue('Elapsed time')).toHaveTextContent('00:00')
    expect(
      screen.getByLabelText('Exercise text: Flinke Hände tippen klare Wörter.'),
    ).toBeInTheDocument()
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

  it('uses native fullscreen controls and preserves the session through enter and exit', async () => {
    const fullscreen = installFullscreenApi()
    render(<App />)
    enterText('F')
    const progress = getMetricValue('Progress')?.textContent
    const appShell = document.querySelector('.app-shell')

    fireEvent.click(await screen.findByRole('button', { name: 'Enter fullscreen' }))
    await waitFor(() => expect(fullscreen.requestFullscreen).toHaveBeenCalledOnce())
    expect(fullscreen.requestFullscreen.mock.instances[0]).toBe(appShell)
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeInTheDocument()
    expect(getMetricValue('Progress')).toHaveTextContent(progress ?? '')

    fireEvent.click(screen.getByRole('button', { name: 'Exit fullscreen' }))
    await waitFor(() => expect(fullscreen.exitFullscreen).toHaveBeenCalledOnce())
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeInTheDocument()
    expect(getMetricValue('Progress')).toHaveTextContent(progress ?? '')
  })

  it('synchronizes the fullscreen label after an external Escape-style exit', async () => {
    const fullscreen = installFullscreenApi()
    render(<App />)
    const appShell = document.querySelector('.app-shell')

    fullscreen.setFullscreenElement(appShell)
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(await screen.findByRole('button', { name: 'Exit fullscreen' })).toBeInTheDocument()

    fullscreen.setFullscreenElement(null)
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeInTheDocument()
  })

  it('hides the fullscreen action when methods exist but document.fullscreenEnabled is false', () => {
    installFullscreenApi(false)
    render(<App />)

    expect(screen.queryByRole('button', { name: 'Enter fullscreen' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Typing surface' })).toBeInTheDocument()
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
