import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFullscreen } from './useFullscreen'

const originalExitFullscreen = Object.getOwnPropertyDescriptor(document, 'exitFullscreen')
const originalFullscreenElement = Object.getOwnPropertyDescriptor(document, 'fullscreenElement')
const originalFullscreenEnabled = Object.getOwnPropertyDescriptor(document, 'fullscreenEnabled')

const restoreDocumentProperty = (
  property: string,
  descriptor: PropertyDescriptor | undefined,
) => {
  if (descriptor) {
    Object.defineProperty(document, property, descriptor)
  } else {
    Reflect.deleteProperty(document, property)
  }
}

const createFullscreenEnvironment = (fullscreenEnabled = true) => {
  const target = document.createElement('div')
  let fullscreenElement: Element | null = null
  const requestFullscreen = vi.fn(() => {
    fullscreenElement = target
    return Promise.resolve()
  })
  const exitFullscreen = vi.fn(() => {
    fullscreenElement = null
    return Promise.resolve()
  })

  Object.defineProperty(target, 'requestFullscreen', {
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
    target,
    requestFullscreen,
    exitFullscreen,
    setFullscreenElement: (element: Element | null) => {
      fullscreenElement = element
    },
    setFullscreenEnabled: (enabled: boolean) => {
      Object.defineProperty(document, 'fullscreenEnabled', {
        configurable: true,
        value: enabled,
        writable: true,
      })
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  restoreDocumentProperty('exitFullscreen', originalExitFullscreen)
  restoreDocumentProperty('fullscreenElement', originalFullscreenElement)
  restoreDocumentProperty('fullscreenEnabled', originalFullscreenEnabled)
})

describe('useFullscreen', () => {
  it('reports unsupported state and leaves fullscreen unchanged without the API', async () => {
    const target = document.createElement('div')
    Reflect.deleteProperty(document, 'exitFullscreen')
    Reflect.deleteProperty(document, 'fullscreenEnabled')
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null })
    const { result } = renderHook(() => useFullscreen({ current: target }))

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isFullscreen).toBe(false)
    await act(() => result.current.toggleFullscreen())
    expect(result.current.isFullscreen).toBe(false)
  })

  it('reports unsupported state and avoids requesting fullscreen when methods exist but fullscreenEnabled is false', async () => {
    const environment = createFullscreenEnvironment(false)
    const { result } = renderHook(() => useFullscreen({ current: environment.target }))

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isFullscreen).toBe(false)
    await act(() => result.current.toggleFullscreen())
    expect(environment.requestFullscreen).not.toHaveBeenCalled()
    expect(result.current.isFullscreen).toBe(false)
  })

  it('requests and exits fullscreen while deriving state from fullscreenElement', async () => {
    const environment = createFullscreenEnvironment()
    const { result } = renderHook(() => useFullscreen({ current: environment.target }))

    expect(result.current.isSupported).toBe(true)
    await act(() => result.current.toggleFullscreen())
    expect(environment.requestFullscreen).toHaveBeenCalledOnce()
    expect(result.current.isFullscreen).toBe(true)

    await act(() => result.current.toggleFullscreen())
    expect(environment.exitFullscreen).toHaveBeenCalledOnce()
    expect(result.current.isFullscreen).toBe(false)
  })

  it('synchronizes external fullscreen entry and Escape-style exit on fullscreenchange', () => {
    const environment = createFullscreenEnvironment()
    const { result } = renderHook(() => useFullscreen({ current: environment.target }))

    environment.setFullscreenElement(environment.target)
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(result.current.isFullscreen).toBe(true)

    environment.setFullscreenElement(null)
    act(() => document.dispatchEvent(new Event('fullscreenchange')))
    expect(result.current.isFullscreen).toBe(false)
  })

  it('does not claim fullscreen after a rejected request', async () => {
    const environment = createFullscreenEnvironment()
    environment.requestFullscreen.mockImplementationOnce(() => Promise.reject(new Error('denied')))
    const { result } = renderHook(() => useFullscreen({ current: environment.target }))

    await act(() => result.current.toggleFullscreen())

    expect(environment.requestFullscreen).toHaveBeenCalledOnce()
    expect(result.current.isFullscreen).toBe(false)
  })

  it('removes its fullscreenchange listener on unmount', () => {
    const environment = createFullscreenEnvironment()
    const addEventListener = vi.spyOn(document, 'addEventListener')
    const removeEventListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useFullscreen({ current: environment.target }))
    const listener = addEventListener.mock.calls.find(([type]) => type === 'fullscreenchange')?.[1]

    unmount()

    expect(listener).toBeDefined()
    expect(removeEventListener).toHaveBeenCalledWith('fullscreenchange', listener)
  })
})
