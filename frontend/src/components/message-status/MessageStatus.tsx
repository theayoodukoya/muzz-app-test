import { Check, CheckCheck } from 'lucide-react';
import type { MessageStatus } from '@/store/slices/messagesSlice';

interface MessageStatusProps {
  status?: MessageStatus;
  isOwnMessage: boolean;
}

const MessageStatusComponent = ({
  status,
  isOwnMessage,
}: MessageStatusProps) => {
  // Only show status for own messages
  if (!isOwnMessage || !status) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <div
            className='flex items-center gap-1'
            role='img'
            aria-label='Sending'
          >
            <div
              className='w-3 h-3 border-2 border-pink-200 border-t-white rounded-full animate-spin'
              aria-hidden='true'
            />
          </div>
        );
      case 'sent':
        return (
          <Check
            size={14}
            className='text-pink-200'
            role='img'
            aria-label='Sent'
          />
        );
      case 'delivered':
        return (
          <CheckCheck
            size={14}
            className='text-pink-200'
            role='img'
            aria-label='Delivered'
          />
        );
      case 'read':
        return (
          <CheckCheck
            size={14}
            className='text-blue-400'
            role='img'
            aria-label='Read'
          />
        );
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'sending':
        return 'Sending';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      default:
        return '';
    }
  };

  return (
    <div
      className='flex items-center gap-1'
      title={getStatusLabel()}
      role='status'
    >
      {getStatusIcon()}
    </div>
  );
};

export default MessageStatusComponent;
