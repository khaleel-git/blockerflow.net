import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wordmark } from './Wordmark'

describe('Wordmark', () => {
  it('renders both parts of the brand name', () => {
    render(<Wordmark />)
    expect(screen.getByText('Blocker')).toBeInTheDocument()
    expect(screen.getByText('flow')).toBeInTheDocument()
  })
})
