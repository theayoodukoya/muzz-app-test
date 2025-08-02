import Header from '@/components/chat/Header';
import { useState } from 'react';
import ChatTab from '@/components/chat/ChatTab/ChatTab';
import ProfileTab from './_components/profile-tab/ProfileTab';
import Tabs from '@/components/ui/Tabs';
import type { Message } from '@/store/slices/messagesSlice';

type TabId = 'chat' | 'profile';

const tabs = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'profile' as const, label: 'Profile' },
] as const;

const Chat = () => {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | undefined
  >();

  const handleMessageSelect = (message: Message) => {
    // Switch to chat tab if not already there
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    // Highlight the selected message
    setHighlightedMessageId(message.id);

    // Clear highlight after animation
    setTimeout(() => {
      setHighlightedMessageId(undefined);
    }, 3000);
  };

  return (
    <div
      className='flex flex-col h-screen max-h-screen overflow-hidden'
      role='application'
      aria-label='Chat application'
    >
      {/* Fixed Header + Tabs Section */}
      <div className='flex-shrink-0 bg-white border-b border-gray-100 shadow-sm'>
        {/* Header */}
        <Header onMessageSelect={handleMessageSelect} />

        {/* Tabs Navigation */}
        <div className='border-t border-gray-100'>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Scrollable Content Area - Takes remaining space */}
      <div className='flex-1 min-h-0 overflow-hidden'>
        {/* Chat Tab Content */}
        <div
          role='tabpanel'
          id='tabpanel-chat'
          aria-labelledby='tab-chat'
          className={`h-full ${activeTab !== 'chat' ? 'hidden' : ''}`}
        >
          {activeTab === 'chat' && (
            <ChatTab highlightedMessageId={highlightedMessageId} />
          )}
        </div>

        {/* Profile Tab Content */}
        <div
          role='tabpanel'
          id='tabpanel-profile'
          aria-labelledby='tab-profile'
          className={`h-full overflow-y-auto ${
            activeTab !== 'profile' ? 'hidden' : ''
          }`}
        >
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
