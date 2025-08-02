import type * as React from 'react';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full border-[#cfcfcf] rounded-lg relative overflow-hidden chat-container'>
      {children}
    </div>
  );
};

export default Container;
