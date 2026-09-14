import { forwardRef, useRef } from 'react'
import type { ClipboardEvent, CompositionEvent, DragEvent, FormEvent, KeyboardEvent } from 'react'
import type { SessionStatus } from '../engine/session'
import { normalizeText } from '../engine/text'

interface TypingInputProps {
  status: SessionStatus
  describedBy: string
  onText: (text: string) => void
  onBackspace: () => void
}

const isRejectedInputType = (inputType: string) =>
  inputType === 'insertFromPaste' ||
  inputType === 'insertFromPasteAsQuotation' ||
  inputType === 'insertFromDrop' ||
  inputType === 'insertReplacementText'

export const TypingInput = forwardRef<HTMLInputElement, TypingInputProps>(function TypingInput(
  { status, describedBy, onText, onBackspace },
  ref,
) {
  const isComposing = useRef(false)
  const trailingComposition = useRef<string | null>(null)

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const inputEvent = event.nativeEvent as InputEvent

    if (isComposing.current || inputEvent.isComposing) {
      return
    }

    const committedText = event.currentTarget.value
    event.currentTarget.value = ''

    if (status === 'completed' || committedText.length === 0) {
      return
    }

    if (isRejectedInputType(inputEvent.inputType ?? '')) {
      trailingComposition.current = null
      return
    }

    const normalizedText = normalizeText(committedText)
    if (trailingComposition.current === normalizedText) {
      trailingComposition.current = null
      return
    }

    trailingComposition.current = null
    onText(committedText)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Backspace' || isComposing.current || event.nativeEvent.isComposing) {
      return
    }

    event.preventDefault()
    if (status !== 'completed') {
      onBackspace()
    }
  }

  const handleCompositionStart = (event: CompositionEvent<HTMLInputElement>) => {
    isComposing.current = true
    trailingComposition.current = null
    event.currentTarget.value = ''
  }

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false
    const committedText = event.data
    event.currentTarget.value = ''

    if (status === 'completed' || committedText.length === 0) {
      return
    }

    const dedupeToken = normalizeText(committedText)
    trailingComposition.current = dedupeToken
    onText(committedText)

    queueMicrotask(() => {
      if (trailingComposition.current === dedupeToken) {
        trailingComposition.current = null
      }
    })
  }

  const rejectPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.currentTarget.value = ''
  }

  const rejectDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.currentTarget.value = ''
  }

  return (
    <input
      ref={ref}
      className="typing-input visually-hidden"
      type="text"
      aria-label="Typing input"
      aria-describedby={describedBy}
      autoComplete="off"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      readOnly={status === 'completed'}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onPaste={rejectPaste}
      onDrop={rejectDrop}
    />
  )
})
