type Tab<T extends string> = {
  id: T;
  label: string;
};

type TabsProps<T extends string> = {
  tabs: readonly Tab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
};

const Tabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabsProps<T>) => {
  return (
    <div role='tablist' aria-label='Chat navigation tabs'>
      <ul className='flex shadow-[0_10px_10px_rgba(0,0,0,0.05)]' role='none'>
        {tabs.map((tab) => (
          <li key={tab.id} role='none' className='flex-1'>
            <button
              role='tab'
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-center cursor-pointer font-semibold border-b-2 border-transparent py-3 px-4 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#e8506e] focus:ring-inset ${
                activeTab === tab.id
                  ? 'text-[#e8506e] border-[#e8506e] bg-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
