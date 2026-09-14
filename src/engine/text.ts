export interface TargetUnit {
  value: string
  normalized: string
}

export interface ReceivedUnit {
  value: string
  normalized: string
}

export type ComparisonResult = 'match' | 'mismatch'

export class GraphemeSegmentationUnavailableError extends Error {
  constructor() {
    super('This browser does not support grapheme-safe text segmentation.')
    this.name = 'GraphemeSegmentationUnavailableError'
  }
}

export const normalizeText = (text: string) => text.normalize('NFC')

export const isGraphemeSegmentationSupported = () =>
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'

const createSegmenter = (locale: string) => {
  if (!isGraphemeSegmentationSupported()) {
    throw new GraphemeSegmentationUnavailableError()
  }

  return new Intl.Segmenter(locale, { granularity: 'grapheme' })
}

const segmentNormalizedText = (text: string, locale: string) => {
  const normalizedText = normalizeText(text)
  return Array.from(createSegmenter(locale).segment(normalizedText), ({ segment }) => segment)
}

export const segmentTargetText = (text: string, locale: string): TargetUnit[] =>
  segmentNormalizedText(text, locale).map((value) => ({ value, normalized: value }))

const isPrintableUnit = (value: string) => !value.includes('\n') && !value.includes('\r') && value !== '\t'

export const segmentReceivedText = (text: string, locale: string): ReceivedUnit[] =>
  segmentNormalizedText(text, locale)
    .filter(isPrintableUnit)
    .map((value) => ({ value, normalized: value }))

export const compareUnits = (
  target: TargetUnit,
  received: ReceivedUnit,
): ComparisonResult => (target.normalized === received.normalized ? 'match' : 'mismatch')
