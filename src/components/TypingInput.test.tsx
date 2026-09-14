import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TypingInput } from './TypingInput'

const renderInput = (status: 'idle' | 'running' | 'completed' = 'idle') => {
  const onText = vi.fn()
  const onBackspace = vi.fn()

  render(
    <TypingInput
      status={status}
      describedBy="description"
      onText={onText}
      onBackspace={onBackspace}
    />,
  )

  return {
    input: screen.getByRole('textbox', { name: 'Typing input' }) as HTMLInputElement,
    onText,
    onBackspace,
  }
}

describe('TypingInput', () => {
  it('forwards one normal committed input exactly once and clears the field', () => {
    const { input, onText } = renderInput()

    fireEvent.input(input, { target: { value: 'a' }, inputType: 'insertText', data: 'a' })

    expect(onText).toHaveBeenCalledOnce()
    expect(onText).toHaveBeenCalledWith('a')
    expect(input).toHaveValue('')
  })

  it('dispatches Backspace once and prevents native deletion', () => {
    const { input, onBackspace } = renderInput('running')
    const event = createEvent.keyDown(input, { key: 'Backspace', cancelable: true })

    fireEvent(input, event)

    expect(event.defaultPrevented).toBe(true)
    expect(onBackspace).toHaveBeenCalledOnce()
  })

  it('leaves Backspace to the active composition', () => {
    const { input, onBackspace } = renderInput('running')
    fireEvent.compositionStart(input)
    const event = createEvent.keyDown(input, { key: 'Backspace', cancelable: true })

    fireEvent(input, event)

    expect(event.defaultPrevented).toBe(false)
    expect(onBackspace).not.toHaveBeenCalled()
  })

  it('ignores intermediate composition input and commits final text once', () => {
    const { input, onText } = renderInput()
    fireEvent.compositionStart(input)
    fireEvent.compositionUpdate(input, { data: 'a' })
    fireEvent.input(input, {
      target: { value: 'a' },
      inputType: 'insertCompositionText',
      data: 'a',
      isComposing: true,
    })

    expect(onText).not.toHaveBeenCalled()
    expect(input).toHaveValue('a')

    fireEvent.input(input, {
      target: { value: 'ä' },
      inputType: 'insertCompositionText',
      data: 'ä',
      isComposing: true,
    })
    expect(onText).not.toHaveBeenCalled()

    fireEvent.compositionEnd(input, { data: 'ä' })

    expect(onText).toHaveBeenCalledOnce()
    expect(onText).toHaveBeenCalledWith('ä')
    expect(input).toHaveValue('')
  })

  it('scores once when a trailing input follows compositionend', () => {
    const { input, onText } = renderInput()
    fireEvent.compositionStart(input)
    fireEvent.compositionEnd(input, { data: 'ä' })
    fireEvent.input(input, {
      target: { value: 'ä' },
      inputType: 'insertCompositionText',
      data: 'ä',
    })

    expect(onText).toHaveBeenCalledOnce()
    expect(input).toHaveValue('')
  })

  it('does not swallow a genuine identical input after deduplication expires', async () => {
    const { input, onText } = renderInput()
    fireEvent.compositionStart(input)
    fireEvent.compositionEnd(input, { data: 'a' })
    await Promise.resolve()

    fireEvent.input(input, { target: { value: 'a' }, inputType: 'insertText', data: 'a' })

    expect(onText).toHaveBeenCalledTimes(2)
  })

  it('does not score Dead keydown and accepts its later logical text', () => {
    const { input, onText } = renderInput()
    fireEvent.keyDown(input, { key: 'Dead' })
    expect(onText).not.toHaveBeenCalled()

    fireEvent.input(input, { target: { value: 'é' }, inputType: 'insertText', data: 'é' })
    expect(onText).toHaveBeenCalledWith('é')
  })

  it('rejects paste and drop without creating attempts', () => {
    const { input, onText } = renderInput()
    const paste = createEvent.paste(input, { cancelable: true })
    const drop = createEvent.drop(input, { cancelable: true })

    fireEvent(input, paste)
    fireEvent(input, drop)

    expect(paste.defaultPrevented).toBe(true)
    expect(drop.defaultPrevented).toBe(true)
    expect(onText).not.toHaveBeenCalled()
  })

  it('defensively ignores paste, drop, and replacement input types', () => {
    const { input, onText } = renderInput()

    for (const inputType of ['insertFromPaste', 'insertFromDrop', 'insertReplacementText']) {
      fireEvent.input(input, { target: { value: 'blocked' }, inputType })
    }

    expect(onText).not.toHaveBeenCalled()
    expect(input).toHaveValue('')
  })

  it('forwards multi-grapheme commits and keeps repeated events distinct', () => {
    const { input, onText } = renderInput()

    fireEvent.input(input, { target: { value: 'ab' }, inputType: 'insertText' })
    fireEvent.input(input, { target: { value: 'c' }, inputType: 'insertText' })

    expect(onText).toHaveBeenNthCalledWith(1, 'ab')
    expect(onText).toHaveBeenNthCalledWith(2, 'c')
  })

  it('does not mutate the domain on blur or refocus', () => {
    const { input, onText, onBackspace } = renderInput('running')
    fireEvent.blur(input)
    fireEvent.focus(input)

    expect(onText).not.toHaveBeenCalled()
    expect(onBackspace).not.toHaveBeenCalled()
  })

  it('is read-only and ignores late input after completion', () => {
    const { input, onText, onBackspace } = renderInput('completed')
    expect(input).toHaveAttribute('readonly')

    fireEvent.input(input, { target: { value: 'a' }, inputType: 'insertText' })
    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(onText).not.toHaveBeenCalled()
    expect(onBackspace).not.toHaveBeenCalled()
  })
})
