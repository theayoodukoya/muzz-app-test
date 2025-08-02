import { useAppSelector } from '@/hooks/useAppSelector';
import UserCard from '@/components/ui/UserCard';
import Logo from '@/assets/logo.svg';
import UserList from './user-list/UserList';

const Home = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  return (
    <main className='flex flex-col h-full' role='main'>
      <header className='text-center py-8 px-4 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100'>
        <div className='flex flex-col items-center gap-3'>
          <img
            src={Logo || '/placeholder.svg'}
            alt='Muzz application logo'
            className='w-[150px] drop-shadow-sm'
            role='img'
          />
          <h1
            className='text-3xl font-bold text-gray-800 tracking-tight'
            role='heading'
            aria-level='1'
          >
            Muzz
          </h1>
          <p className='text-gray-600 max-w-md'>
            Connect and chat with your friends in a simple and elegant way.
          </p>
        </div>
      </header>

      <section
        className='p-6 flex-grow flex flex-col gap-6'
        aria-label='User management'
      >
        <div
          className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
          role='region'
          aria-label='Current user information'
        >
          <div className='flex items-center gap-3 mb-2'>
            <UserCard user={currentUser} />
            <div className='text-sm text-gray-500' aria-live='polite'>
              Currently logged in as
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <UserList />
        </div>
      </section>
    </main>
  );
};

export default Home;
