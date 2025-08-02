import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeDisabled();
  });

  it('should have correct aria-label', () => {
    render(<Button ariaLabel='Custom label'>Click me</Button>);

    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  it('should apply disabled styles when disabled', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
});
