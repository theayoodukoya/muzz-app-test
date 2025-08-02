import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import MessageStatus from './MessageStatus';

describe('MessageStatus', () => {
  it('should not render for non-own messages', () => {
    const { container } = render(
      <MessageStatus status='sent' isOwnMessage={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render without status', () => {
    const { container } = render(<MessageStatus isOwnMessage={true} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render sending status with spinner', () => {
    render(<MessageStatus status='sending' isOwnMessage={true} />);

    expect(screen.getByTitle('Sending')).toBeInTheDocument();
    expect(screen.getByLabelText('Sending')).toBeInTheDocument();
  });

  it('should render sent status with single check', () => {
    render(<MessageStatus status='sent' isOwnMessage={true} />);

    expect(screen.getByTitle('Sent')).toBeInTheDocument();
    expect(screen.getByLabelText('Sent')).toBeInTheDocument();
  });

  it('should render delivered status with double check (pink)', () => {
    render(<MessageStatus status='delivered' isOwnMessage={true} />);

    expect(screen.getByTitle('Delivered')).toBeInTheDocument();
    expect(screen.getByLabelText('Delivered')).toBeInTheDocument();
  });

  it('should render read status with double check (blue)', () => {
    render(<MessageStatus status='read' isOwnMessage={true} />);

    expect(screen.getByTitle('Read')).toBeInTheDocument();
    expect(screen.getByLabelText('Read')).toBeInTheDocument();
  });
});
