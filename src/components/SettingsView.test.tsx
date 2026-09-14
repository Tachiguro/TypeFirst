import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsView } from './SettingsView'

const renderSettings = () => {
  const handlers = {
    onBack: vi.fn(),
    onThemeChange: vi.fn(),
    onLanguageChange: vi.fn(),
    onKeyboardLayoutChange: vi.fn(),
  }

  render(
    <SettingsView
      themePreference="system"
      language="de"
      keyboardLayout="de-qwertz"
      {...handlers}
    />,
  )

  return handlers
}

describe('SettingsView', () => {
  it('renders a focused Settings heading, Back action, and button-only choice groups', () => {
    renderSettings()

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

    for (const name of [
      'System',
      'Light',
      'Dark',
      'German',
      'English',
      'German QWERTZ',
      'English QWERTY',
      'German Neo 2',
    ]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('exposes selected and unselected options with aria-pressed', () => {
    renderSettings()

    for (const selected of ['System', 'German', 'German QWERTZ']) {
      expect(screen.getByRole('button', { name: selected })).toHaveAttribute('aria-pressed', 'true')
    }
    for (const unselected of ['Light', 'Dark', 'English', 'English QWERTY', 'German Neo 2']) {
      expect(screen.getByRole('button', { name: unselected })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    }
  })

  it('fires Back and preference callbacks with canonical values', () => {
    const handlers = renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    fireEvent.click(screen.getByRole('button', { name: 'German Neo 2' }))

    expect(handlers.onBack).toHaveBeenCalledOnce()
    expect(handlers.onThemeChange).toHaveBeenCalledWith('dark')
    expect(handlers.onLanguageChange).toHaveBeenCalledWith('en')
    expect(handlers.onKeyboardLayoutChange).toHaveBeenCalledWith('de-neo2')
  })

  it('keeps the programmatically focusable heading out of sequential tab order', () => {
    renderSettings()
    const heading = screen.getByRole('heading', { level: 1, name: 'Settings' })

    expect(heading).toHaveAttribute('tabindex', '-1')
    heading.focus()
    expect(heading).toHaveFocus()
  })
})
