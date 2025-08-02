import { ChevronLeft, Ellipsis, Search } from 'lucide-react';
import { useState } from 'react';
import UserCard from '@/components/ui/UserCard';
import MessageSearch from '@/components/chat/MessageSearch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCurrentPage } from '@/store/slices/pageSlice';
import type { Message } from '@/store/slices/messagesSlice';

interface HeaderProps {
  onMessageSelect?: (message: Message) => void;
}

const Header = ({ onMessageSelect }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentRecipient = useAppSelector(
    (state) => state.user.currentRecipient
  );
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (!currentRecipient || !currentUser) {
    return null;
  }

  const handleMessageSelect = (message: Message) => {
    if (onMessageSelect) {
      onMessageSelect(message);
    }
  };

  return (
    <>
      <header
        className='sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm'
        role='banner'
      >
        <div className='flex justify-between items-center p-5'>
          <button
            onClick={() => dispatch(setCurrentPage('home'))}
            className='cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8506e]'
            aria-label='Go back to home page'
            type='button'
          >
            <ChevronLeft size={28} aria-hidden='true' />
          </button>

          <div
            role='heading'
            aria-level={1}
            className='flex-1 flex justify-center'
          >
            <UserCard user={currentRecipient} />
          </div>

          <nav
            className='flex items-center gap-2'
            role='navigation'
            aria-label='Chat actions'
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className='cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8506e]'
              aria-label='Search messages'
              type='button'
            >
              <Search size={28} aria-hidden='true' />
            </button>
            <button
              className='cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8506e]'
              aria-label='More options'
              type='button'
            >
              <Ellipsis size={28} aria-hidden='true' />
            </button>
          </nav>
        </div>
      </header>

      <MessageSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onMessageSelect={handleMessageSelect}
      />
    </>
  );
};

export default Header;
