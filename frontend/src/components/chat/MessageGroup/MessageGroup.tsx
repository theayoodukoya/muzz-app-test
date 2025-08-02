import { forwardRef } from 'react';
import type { Message } from '@/store/slices/messagesSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { format, isValid } from 'date-fns';
import MessageStatus from '@/components/chat/MessageStatus';

type MessageGroupProps = {
  messages: Message[];
  highlightedMessageId?: number;
};

const MessageGroup = forwardRef<HTMLDivElement, MessageGroupProps>(
  ({ messages, highlightedMessageId }, ref) => {
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const currentRecipient = useAppSelector(
      (state) => state.user.currentRecipient
    );
    const isOwnMessage = messages[0].senderId === currentUser.id;

    // Safe timestamp formatting with error handling
    const formatTimestamp = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        if (!isValid(date)) {
          console.warn('Invalid timestamp:', timestamp);
          return 'Invalid time';
        }
        return format(date, 'HH:mm');
      } catch (error) {
        console.error('Error formatting timestamp:', timestamp, error);
        return 'Invalid time';
      }
    };

    // Get sender name for accessibility
    const getSenderName = (senderId: number) => {
      if (senderId === currentUser.id) return 'You';
      return currentRecipient?.name || `User ${senderId}`;
    };

    // Format full timestamp for screen readers
    const getFullTimestamp = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        if (!isValid(date)) return 'Invalid time';
        return format(date, "EEEE, MMMM do, yyyy 'at' h:mm a");
      } catch (error) {
        return 'Invalid time';
      }
    };

    // Get status description for screen readers
    const getStatusDescription = (status?: string) => {
      switch (status) {
        case 'sending':
          return 'Message is being sent';
        case 'sent':
          return 'Message sent';
        case 'delivered':
          return 'Message delivered';
        case 'read':
          return 'Message read';
        default:
          return '';
      }
    };

    return (
      <section
        className={`flex ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        } mb-4`}
        ref={ref}
        role='group'
        aria-label={`Message group from ${getSenderName(
          messages[0].senderId
        )} with ${messages.length} message${messages.length === 1 ? '' : 's'}`}
      >
        <div
          className={`max-w-[70%] ${
            isOwnMessage ? 'items-end' : 'items-start'
          } flex flex-col`}
        >
          {messages.map((message, index) => {
            const isLastInGroup = index === messages.length - 1;
            const showTimestampAndStatus = isLastInGroup;
            const senderName = getSenderName(message.senderId);
            const fullTimestamp = getFullTimestamp(message.timestamp);
            const statusDescription = getStatusDescription(message.status);

            return (
              <article
                key={message.id}
                data-message-id={message.id}
                className={`rounded-2xl px-4 py-2 transition-all duration-500 ${
                  isOwnMessage
                    ? 'bg-[#e8506e] text-white'
                    : 'bg-gray-100 text-gray-800'
                } ${index > 0 ? 'mt-1' : ''} ${
                  isOwnMessage
                    ? index === messages.length - 1
                      ? 'rounded-br-md'
                      : 'rounded-br-lg'
                    : index === messages.length - 1
                    ? 'rounded-bl-md'
                    : 'rounded-bl-lg'
                } ${
                  highlightedMessageId === message.id
                    ? 'ring-4 ring-yellow-300 ring-opacity-75 scale-105 shadow-lg'
                    : ''
                }`}
                role='article'
                aria-label={`Message from ${senderName} sent ${fullTimestamp}${
                  statusDescription ? `, ${statusDescription}` : ''
                }`}
                tabIndex={highlightedMessageId === message.id ? 0 : -1}
              >
                {/* Hidden heading for screen readers */}
                <h3 className='sr-only'>Message from {senderName}</h3>

                {/* Message Content */}
                <div
                  className='text-sm leading-relaxed'
                  role='text'
                  aria-label={`Message content: ${message.content}`}
                >
                  {message.content}
                </div>

                {/* Timestamp and Status - Only on last message in group */}
                {showTimestampAndStatus && (
                  <footer
                    className={`flex items-center justify-end gap-1 mt-1 ${
                      isOwnMessage ? 'text-pink-100' : 'text-gray-500'
                    }`}
                    role='contentinfo'
                    aria-label='Message metadata'
                  >
                    <time
                      className='text-xs'
                      dateTime={message.timestamp}
                      title={fullTimestamp}
                      aria-label={`Sent ${fullTimestamp}`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </time>

                    {/* Show status for own messages */}
                    {isOwnMessage && (
                      <div aria-label={statusDescription} role='status'>
                        <MessageStatus
                          status={message.status}
                          isOwnMessage={isOwnMessage}
                        />
                      </div>
                    )}
                  </footer>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  }
);

MessageGroup.displayName = 'MessageGroup';

export default MessageGroup;
