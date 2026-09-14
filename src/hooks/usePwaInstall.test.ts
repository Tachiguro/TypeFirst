import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaInstall, type BeforeInstallPromptEvent } from './usePwaInstall'

interface MockPromptEventOptions {
  outcome?: 'accepted' | 'dismissed'
  platform?: string
  promptError?: Error
}

const createMockBeforeInstallPromptEvent = (
  options: MockPromptEventOptions = {},
): {
  event: BeforeInstallPromptEvent
  prompt: ReturnType<typeof vi.fn>
  preventDefault: ReturnType<typeof vi.spyOn>
} => {
  const { outcome = 'accepted', platform = 'web', promptError } = options
  const event = new Event('beforeinstallprompt', { cancelable: true })
  const preventDefault = vi.spyOn(event, 'preventDefault')
  const prompt = vi.fn().mockImplementation(() => {
    if (promptError) {
      return Promise.reject(promptError)
    }
    return Promise.resolve()
  })

  const userChoice = Promise.resolve({ outcome, platform })

  Object.defineProperties(event, {
    platforms: { value: [platform], configurable: true },
    userChoice: { value: userChoice, configurable: true },
    prompt: { value: prompt, configurable: true },
  })

  return { event: event as unknown as BeforeInstallPromptEvent, prompt, preventDefault }
}

const createMatchMediaMock = (matches = false) =>
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

describe('usePwaInstall', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    window.matchMedia = createMatchMediaMock(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = originalMatchMedia
  })

  it('starts with canInstall false and isInstalled false in a standard browser environment', () => {
    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.canInstall).toBe(false)
    expect(result.current.isInstalled).toBe(false)
  })

  it('captures beforeinstallprompt, calls preventDefault, and sets canInstall to true', () => {
    const { result } = renderHook(() => usePwaInstall())
    const { event, preventDefault } = createMockBeforeInstallPromptEvent()

    act(() => {
      window.dispatchEvent(event)
    })

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(result.current.canInstall).toBe(true)
    expect(result.current.isInstalled).toBe(false)
  })

  it('invokes prompt() and returns accepted when install() is called and accepted', async () => {
    const { result } = renderHook(() => usePwaInstall())
    const { event, prompt } = createMockBeforeInstallPromptEvent({ outcome: 'accepted' })

    act(() => {
      window.dispatchEvent(event)
    })

    let outcome: string | null = null
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(prompt).toHaveBeenCalledOnce()
    expect(outcome).toBe('accepted')
    expect(result.current.canInstall).toBe(false)
  })

  it('invokes prompt() and returns dismissed when user cancels the prompt', async () => {
    const { result } = renderHook(() => usePwaInstall())
    const { event, prompt } = createMockBeforeInstallPromptEvent({ outcome: 'dismissed' })

    act(() => {
      window.dispatchEvent(event)
    })

    let outcome: string | null = null
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(prompt).toHaveBeenCalledOnce()
    expect(outcome).toBe('dismissed')
    expect(result.current.canInstall).toBe(false)
  })

  it('returns null safely when install() is called without a deferred prompt', async () => {
    const { result } = renderHook(() => usePwaInstall())

    let outcome: string | null = null
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(outcome).toBeNull()
    expect(result.current.canInstall).toBe(false)
  })

  it('handles rejected prompt promise safely without unhandled rejection or false installed state', async () => {
    const { result } = renderHook(() => usePwaInstall())
    const { event } = createMockBeforeInstallPromptEvent({
      promptError: new Error('User blocked prompt'),
    })

    act(() => {
      window.dispatchEvent(event)
    })

    let outcome: string | null = null
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(outcome).toBeNull()
    expect(result.current.canInstall).toBe(false)
    expect(result.current.isInstalled).toBe(false)
  })

  it('updates installed state and clears install availability upon appinstalled event', () => {
    const { result } = renderHook(() => usePwaInstall())
    const { event } = createMockBeforeInstallPromptEvent()

    act(() => {
      window.dispatchEvent(event)
    })
    expect(result.current.canInstall).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })

    expect(result.current.isInstalled).toBe(true)
    expect(result.current.canInstall).toBe(false)
  })

  it('detects display-mode: standalone initially as installed', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.isInstalled).toBe(true)
    expect(result.current.canInstall).toBe(false)
  })

  it('handles missing or throwing matchMedia gracefully', () => {
    // @ts-expect-error simulating legacy or restricted environment without matchMedia
    window.matchMedia = undefined

    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.isInstalled).toBe(false)
    expect(result.current.canInstall).toBe(false)
  })

  it('cleans up event listeners when unmounted', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => usePwaInstall())

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function))
  })
})
