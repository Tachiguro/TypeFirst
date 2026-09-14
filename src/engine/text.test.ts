import { afterEach, describe, expect, it } from 'vitest'
import {
  GraphemeSegmentationUnavailableError,
  compareUnits,
  isGraphemeSegmentationSupported,
  segmentReceivedText,
  segmentTargetText,
} from './text'

const nativeSegmenter = Intl.Segmenter

describe('grapheme text model', () => {
  afterEach(() => {
    Object.defineProperty(Intl, 'Segmenter', {
      configurable: true,
      value: nativeSegmenter,
      writable: true,
    })
  })

  it('normalizes canonically equivalent text to NFC before comparison', () => {
    const [target] = segmentTargetText('ä', 'de')
    const [received] = segmentReceivedText('a\u0308', 'de')

    expect(target).toEqual({ value: 'ä', normalized: 'ä' })
    expect(received).toEqual({ value: 'ä', normalized: 'ä' })
    expect(compareUnits(target, received)).toBe('match')
  })

  it('keeps combining and ZWJ sequences as user-perceived graphemes', () => {
    expect(segmentTargetText('n\u0303', 'en')).toHaveLength(1)
    expect(segmentTargetText('👨‍👩‍👧‍👦', 'en')).toHaveLength(1)
  })

  it('preserves spaces and segments multi-grapheme commits', () => {
    expect(segmentTargetText('a b', 'en').map(({ value }) => value)).toEqual(['a', ' ', 'b'])
    expect(segmentReceivedText('ab', 'en').map(({ value }) => value)).toEqual(['a', 'b'])
  })

  it('filters hard newline and tab input without filtering spaces', () => {
    expect(segmentReceivedText(' \r\n\t', 'en').map(({ value }) => value)).toEqual([' '])
  })

  it('fails explicitly when Intl.Segmenter is unavailable', () => {
    Object.defineProperty(Intl, 'Segmenter', {
      configurable: true,
      value: undefined,
      writable: true,
    })

    expect(isGraphemeSegmentationSupported()).toBe(false)
    expect(() => segmentTargetText('text', 'en')).toThrow(
      GraphemeSegmentationUnavailableError,
    )
  })
})
