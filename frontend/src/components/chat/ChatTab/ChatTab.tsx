import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { sendMessage as sendMessageAction } from '@/store/slices/messagesSlice';
import MessageGroup from '@/components/chat/MessageGroup';
import {
  format,
  differenceInHours,
  differenceInSeconds,
  isValid,
} from 'date-fns';
import type { Message, MessageInput } from '@/store/slices/messagesSlice';
import { useWebSocketRedux } from '@/hooks/useWebSocketRedux';
import { formatMessageText, formatInputText } from '@/utils/textFormatting';

interface ChatTabProps {
  highlightedMessageId?: number;
  onScrollToMessage?: (messageId: number) => void;
}

const ChatTab = ({ highlightedMessageId, onScrollToMessage }: ChatTabProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [newMessageAnnouncement, setNewMessageAnnouncement] = useState('');

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentRecipient = useAppSelector(
    (state) => state.user.currentRecipient
  );
  const allMessages = useAppSelector((state) => state.messages.messages);
  const dispatch = useAppDispatch();

  // Get connection status from Redux
  const isConnected = useAppSelector((state) => state.chat.isConnected);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useWebSocketRedux({
    userId: currentUser.id,
    recipientId: currentRecipient?.id || null,
  });

  const messages: Message[] = allMessages
    .filter(
      (message) =>
        (message.senderId === currentUser.id &&
          message.recipientId === currentRecipient?.id) ||
        (message.senderId === currentRecipient?.id &&
          message.recipientId === currentUser.id)
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  // Announce new messages for screen readers
  useEffect(() => {
    if (messages.length > lastMessageCount && lastMessageCount > 0) {
      const latestMessage = messages[messages.length - 1];

      if (latestMessage && latestMessage.senderId !== currentUser.id) {
        const senderName = currentRecipient?.name || 'Someone';
        setNewMessageAnnouncement(
          `New message from ${senderName}: ${latestMessage.content}`
        );

        // Clear announcement after screen reader has time to read it
        setTimeout(() => setNewMessageAnnouncement(''), 3000);
      }
    }
    setLastMessageCount(messages.length);
  }, [
    messages.length,
    lastMessageCount,
    currentUser.id,
    currentRecipient?.name,
    messages,
  ]);

  console.log('Current messages for conversation:', messages.length);

  // Group messages by time and sender with safe date handling
  const groupedMessages: Message[][] = [];
  let currentGroup: Message[] = [];
  let lastTimestamp: Date | null = null;
  let lastSenderId: number | null = null;

  for (const message of messages) {
    // Skip messages with invalid data
    if (!message.id || !message.timestamp || !message.content) {
      console.warn('Skipping invalid message:', message);
      continue;
    }

    const messageTime = new Date(message.timestamp);

    // Skip invalid timestamps
    if (!isValid(messageTime)) {
      console.warn('Skipping message with invalid timestamp:', message);
      continue;
    }

    const shouldCreateNewGroup =
      !lastTimestamp ||
      differenceInSeconds(messageTime, lastTimestamp) > 20 ||
      message.senderId !== lastSenderId;

    if (shouldCreateNewGroup) {
      if (currentGroup.length > 0) {
        groupedMessages.push(currentGroup);
      }
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }

    lastTimestamp = messageTime;
    lastSenderId = message.senderId;
  }

  if (currentGroup.length > 0) {
    groupedMessages.push(currentGroup);
  }

  // Add timestamp headers with improved logic for new messages
  const messagesWithHeaders: Array<
    | { type: 'header'; timestamp: string; content: string }
    | { type: 'group'; messages: Message[] }
  > = [];
  let lastHeaderTime: Date | null = null;
  const now = new Date();

  for (const group of groupedMessages) {
    if (group.length === 0) continue;

    const groupTime = new Date(group[0].timestamp);

    if (!isValid(groupTime)) {
      console.warn('Skipping group with invalid timestamp:', group[0]);
      continue;
    }

    const isToday = groupTime.toDateString() === now.toDateString();
    const isYesterday =
      groupTime.toDateString() ===
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

    // Determine if we need a new header
    const needsNewHeader =
      !lastHeaderTime || // First header
      groupTime.toDateString() !== lastHeaderTime.toDateString() || // Different day
      differenceInHours(groupTime, lastHeaderTime) >= 1 || // 1+ hour gap
      (isToday &&
        differenceInHours(now, groupTime) < 1 &&
        differenceInHours(groupTime, lastHeaderTime) >= 0.5); // Recent messages with 30+ min gap

    if (needsNewHeader) {
      let headerContent: string;

      if (isToday) {
        headerContent = `Today ${format(groupTime, 'h:mm a')}`;
      } else if (isYesterday) {
        headerContent = `Yesterday ${format(groupTime, 'h:mm a')}`;
      } else {
        // Show date with time for older messages
        headerContent = format(groupTime, 'MMMM d, yyyy h:mm a');
      }

      messagesWithHeaders.push({
        type: 'header',
        timestamp: group[0].timestamp,
        content: headerContent,
      });
      lastHeaderTime = groupTime;
    }

    messagesWithHeaders.push({
      type: 'group',
      messages: group,
    });
  }

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedMessageId && messagesContainerRef.current) {
      const messageElement = messagesContainerRef.current.querySelector(
        `[data-message-id="${highlightedMessageId}"]`
      );
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        // Focus the highlighted message for screen readers
        if (messageElement instanceof HTMLElement) {
          messageElement.focus();
        }
        // Call callback to notify parent
        if (onScrollToMessage) {
          onScrollToMessage(highlightedMessageId);
        }
      }
    }
  }, [highlightedMessageId, messagesWithHeaders, onScrollToMessage]);

  // Auto-scroll to bottom for new messages (but not when highlighting)
  useEffect(() => {
    if (!highlightedMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesWithHeaders, highlightedMessageId]);

  // Handle keydown for Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key for sending
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend(e as any);
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Only apply light formatting during typing
    const { text: formattedText, newCursorPosition } = formatInputText(
      inputValue,
      cursorPosition
    );

    setCurrentMessage(formattedText);

    // Restore cursor position after formatting
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentRecipient || !currentMessage.trim()) return;

    // Apply full formatting before sending
    const formattedContent = formatMessageText(currentMessage.trim());

    const newMessage: MessageInput = {
      senderId: currentUser.id,
      recipientId: currentRecipient.id,
      content: formattedContent,
    };

    console.log('Sending message:', newMessage);

    // Dispatch Redux action for local store (this will handle status updates)
    dispatch(sendMessageAction(newMessage));

    // Send via WebSocket for real-time delivery
    sendMessage({
      senderId: newMessage.senderId,
      recipientId: newMessage.recipientId,
      content: newMessage.content,
    });

    setCurrentMessage('');

    // Announce message sent for screen readers
    setNewMessageAnnouncement(`Message sent: ${formattedContent}`);
    setTimeout(() => setNewMessageAnnouncement(''), 2000);
  };

  return (
    <div
      className='flex flex-col h-full'
      role='main'
      aria-label={`Chat conversation with ${
        currentRecipient?.name || 'recipient'
      }`}
    >
      {/* Screen reader announcements */}
      <div
        className='sr-only'
        role='status'
        aria-live='polite'
        aria-atomic='true'
        aria-label='Chat announcements'
      >
        {newMessageAnnouncement}
      </div>

      {/* Messages Area - Scrollable content that takes remaining space */}
      <div
        className='flex-1 min-h-0 overflow-y-auto overscroll-contain'
        ref={messagesContainerRef}
        role='log'
        aria-label='Chat message history'
        aria-live='polite'
        tabIndex={0}
      >
        <section className='flex flex-col p-4 min-h-full'>
          {/* Spacer to push messages to bottom initially */}
          <div className='flex-1 min-h-0' />

          {/* Connection Status */}
          {!isConnected && (
            <div
              className='text-center py-2'
              role='alert'
              aria-live='assertive'
              aria-label='Connection status'
            >
              <div className='inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full'>
                <span className='sr-only'>Warning: </span>
                Connecting to real-time chat...
              </div>
            </div>
          )}

          {/* Messages with Headers */}
          <div role='feed' aria-label='Chat messages' aria-busy={!isConnected}>
            {messagesWithHeaders.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <header
                    key={`header-${index}`}
                    className='text-center my-4'
                    role='separator'
                    aria-label={`Messages from ${item.content}`}
                  >
                    <h2 className='sr-only'>Messages from {item.content}</h2>
                    <div className='inline-block bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full'>
                      <time dateTime={item.timestamp} aria-label={item.content}>
                        {item.content}
                      </time>
                    </div>
                  </header>
                );
              }

              return (
                <MessageGroup
                  key={`group-${index}`}
                  messages={item.messages}
                  highlightedMessageId={highlightedMessageId}
                />
              );
            })}
          </div>

          <div ref={messagesEndRef} aria-hidden='true' />
        </section>
      </div>

      {/* Fixed Input Area - Sticky at bottom */}
      <footer className='flex-shrink-0 border-t border-gray-100 bg-white'>
        <section className='p-4 pb-safe' aria-label='Send message'>
          <h2 className='sr-only'>Send a message</h2>
          <form
            onSubmit={handleMessageSend}
            className='flex gap-3 items-end'
            role='form'
            aria-label={`Send message to ${
              currentRecipient?.name || 'recipient'
            }`}
          >
            <div className='flex-1 relative'>
              <label htmlFor='message-input' className='sr-only'>
                Type your message to {currentRecipient?.name || 'recipient'}
              </label>
              <input
                id='message-input'
                ref={inputRef}
                type='text'
                placeholder={`Message ${currentRecipient?.name || ''}`}
                className='w-full rounded-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#e8506e] focus:ring-2 focus:ring-[#e8506e] focus:ring-offset-2 transition-colors bg-gray-50 focus:bg-white text-base sm:text-sm'
                value={currentMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                aria-describedby='message-help'
                aria-invalid={false}
                autoComplete='off'
                maxLength={1000}
              />
              <div id='message-help' className='sr-only'>
                Type your message and press Enter to send, or click the Send
                button. Maximum 1000 characters.
              </div>
            </div>
            <button
              type='submit'
              className='bg-[#e8506e] text-white px-4 sm:px-6 py-3 rounded-full hover:bg-[#cc3d59] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-2 focus:ring-[#e8506e] focus:ring-offset-2 text-sm sm:text-base'
              disabled={!currentMessage.trim()}
              aria-label={`Send message "${currentMessage.trim()}" to ${
                currentRecipient?.name || 'recipient'
              }`}
              aria-describedby='send-button-help'
            >
              Send
            </button>
            <div id='send-button-help' className='sr-only'>
              {currentMessage.trim()
                ? `Ready to send message: ${currentMessage.trim()}`
                : 'Enter a message to enable sending'}
            </div>
          </form>
        </section>
      </footer>
    </div>
  );
};

export default ChatTab;
