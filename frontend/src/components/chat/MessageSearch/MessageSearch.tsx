import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useMessageSearch } from '@/hooks/useMessageSearch';
import { format } from 'date-fns';
import type { Message } from '@/store/slices/messagesSlice';

interface MessageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSelect: (message: Message) => void;
}

const MessageSearch = ({
  isOpen,
  onClose,
  onMessageSelect,
}: MessageSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    results: searchResults,
    isLoading,
    error,
  } = useMessageSearch(searchQuery, currentUser.id);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard navigation for dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Helper function to get user name by ID
  const getUserName = (userId: number) => {
    if (userId === currentUser.id) return 'You';
    return `User ${userId}`;
  };

  // Helper function to highlight search terms in message content
  const highlightSearchTerm = (content: string, searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return content;

    const searchWords = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    let highlightedContent = content;

    // Highlight each search word
    searchWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex,
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    });

    return highlightedContent;
  };

  const handleMessageClick = (message: Message) => {
    onMessageSelect(message);
    onClose();
    setSearchQuery(''); // Reset search
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Generate search status message for screen readers
  const getSearchStatusMessage = () => {
    if (isLoading) return 'Searching messages...';
    if (error) return 'Search failed. Please try again.';
    if (searchQuery.length === 0) return 'Enter search terms to find messages';
    if (searchQuery.length < 2) return 'Type at least 2 characters to search';
    if (searchResults.length === 0)
      return `No messages found for "${searchQuery}"`;
    return `Found ${searchResults.length} message${
      searchResults.length === 1 ? '' : 's'
    } matching "${searchQuery}"`;
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20'
      role='dialog'
      aria-modal='true'
      aria-labelledby='search-dialog-title'
      aria-describedby='search-dialog-description'
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <section className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col'>
        {/* Search Header */}
        <header className='p-4 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <label htmlFor='message-search-input' className='sr-only'>
                Search through your messages
              </label>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
                aria-hidden='true'
              />
              <input
                id='message-search-input'
                ref={searchInputRef}
                type='search'
                placeholder="Search messages..."
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e8506e] focus:ring-2 focus:ring-[#e8506e]'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-describedby='search-instructions search-status'
                autoComplete='off'
                spellCheck='false'
              />
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8506e]'
              aria-label='Close search'
              type='button'
            >
              <X size={20} aria-hidden='true' />
            </button>
          </div>

          {/* Hidden title for screen readers */}
          <h1 id='search-dialog-title' className='sr-only'>
            Message Search
          </h1>

          {/* Search instructions */}
          <div id='search-instructions' className='sr-only'>
            Search through your conversation messages. Type at least 2
            characters to begin searching. Use arrow keys to navigate results
            and Enter to select.
          </div>

          {/* Search status - visible */}
          <div
            id='search-status'
            className='mt-2 text-xs text-gray-500'
            role='status'
            aria-live='polite'
            aria-atomic='true'
          >
            {getSearchStatusMessage()}
          </div>

          {/* Scroll hint for many results */}
          {searchResults.length > 3 && (
            <div
              className='mt-1 text-xs text-gray-400 flex items-center gap-1'
              aria-label='Navigation hint'
            >
              <span>Scroll to see all {searchResults.length} results</span>
              <svg
                className='w-3 h-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                />
              </svg>
            </div>
          )}
        </header>

        {/* Search Results */}
        <main
          className='flex-1 overflow-y-auto min-h-0'
          role='main'
          aria-label='Search results'
        >
          {/* Loading state */}
          {isLoading && (
            <div
              className='flex justify-center items-center py-8'
              role='status'
              aria-label='Searching messages'
            >
              <div
                className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#e8506e]'
                aria-hidden='true'
              ></div>
              <span className='sr-only'>
                Searching through your messages...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className='p-4 text-center text-red-500'
              role='alert'
              aria-live='assertive'
            >
              <p className='font-medium'>Search Error</p>
              <p className='text-sm mt-1'>
                Unable to search messages. Please try again.
              </p>
            </div>
          )}

          {/* Results list */}
          {searchResults.length > 0 && (
            <section aria-labelledby='results-heading'>
              <h2 id='results-heading' className='sr-only'>
                Search Results ({searchResults.length} message
                {searchResults.length === 1 ? '' : 's'} found)
              </h2>
              <ul className='divide-y divide-gray-100' role='list'>
                {searchResults.map((message, index) => (
                  <li key={message.id} role='listitem'>
                    <button
                      className='w-full p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-[#e8506e]'
                      onClick={() => handleMessageClick(message)}
                      aria-label={`Result ${index + 1} of ${
                        searchResults.length
                      }: Message from ${getUserName(
                        message.senderId
                      )} on ${format(
                        new Date(message.timestamp),
                        "MMMM d 'at' h:mm a"
                      )}: ${message.content}`}
                      aria-describedby={`message-${message.id}-details`}
                      type='button'
                    >
                      <article>
                        <header className='flex items-start justify-between mb-1'>
                          <div
                            className='text-sm font-medium text-gray-900'
                            aria-label='Message sender'
                          >
                            {getUserName(message.senderId)}
                          </div>
                          <time
                            className='text-xs text-gray-500'
                            dateTime={message.timestamp}
                            aria-label={`Sent on ${format(
                              new Date(message.timestamp),
                              "MMMM d 'at' h:mm a"
                            )}`}
                          >
                            {format(
                              new Date(message.timestamp),
                              'MMM d, HH:mm'
                            )}
                          </time>
                        </header>
                        <div
                          id={`message-${message.id}-details`}
                          className='text-sm text-gray-700'
                          aria-label='Message content with search terms highlighted'
                          dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(
                              message.content,
                              searchQuery
                            ),
                          }}
                        />
                      </article>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Empty states */}
          {searchResults.length === 0 &&
            searchQuery.length >= 2 &&
            !isLoading && (
              <section
                className='p-4 text-center text-gray-500'
                role='status'
                aria-live='polite'
              >
                <h2 className='text-base font-medium mb-2'>
                  No Messages Found
                </h2>
                <p className='mb-3'>
                  No messages match your search for "{searchQuery}"
                </p>
              </section>
            )}

          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <section
              className='p-4 text-center text-gray-500'
              role='status'
              aria-live='polite'
            >
              <h2 className='text-base font-medium mb-2'>Keep Typing</h2>
              <p>Type at least 2 characters to start searching your messages</p>
            </section>
          )}

          {searchQuery.length === 0 && (
            <section className='p-4 text-center text-gray-500' role='status'>
              <h2 className='text-base font-medium mb-2'>
                Search Your Messages
              </h2>
            </section>
          )}
        </main>

        {/* Hidden description for screen readers */}
        <div id='search-dialog-description' className='sr-only'>
          Search dialog for finding messages in your conversation. Use the
          search input to find specific messages, then select a result to jump
          to that message in the chat.
        </div>
      </section>
    </div>
  );
};

export default MessageSearch;
