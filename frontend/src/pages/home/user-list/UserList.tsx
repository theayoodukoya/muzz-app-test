import UserCard from '@/components/ui/UserCard';
import Button from '@/components/ui/button/Button';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCurrentUser, setCurrentRecipient } from '@/store/slices/userSlice';
import { setCurrentPage } from '@/store/slices/pageSlice';
import { useGetUsersQuery } from '@/store/slices/apiSlice';

const UserList = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // Use RTK Query for data fetching with caching
  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const switchUser = (userId: number) => {
    const user = users?.find((user) => user.id === userId);
    if (user) {
      dispatch(setCurrentUser(user));
      dispatch(setCurrentRecipient(null));
    }
  };

  const messageUser = (userId: number) => {
    const user = users?.find((user) => user.id === userId);
    if (user) {
      dispatch(setCurrentRecipient(user));
      dispatch(setCurrentPage('chat'));
    }
  };

  if (isLoading) {
    return (
      <div
        className='flex justify-center items-center py-8'
        role='status'
        aria-label='Loading users'
      >
        <div
          className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8506e]'
          aria-hidden='true'
        ></div>
        <span className='sr-only'>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8' role='alert' aria-live='assertive'>
        <p className='text-red-500 mb-4'>Failed to load users</p>
        <Button onClick={() => refetch()} ariaLabel='Retry loading users'>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row gap-8'>
      <section className='flex-1' aria-labelledby='switch-user-heading'>
        <h2 id='switch-user-heading' className='text-lg font-semibold mb-4'>
          Select Current User
        </h2>
        <ul className='flex flex-col gap-2.5' role='list'>
          {users?.map((user) => (
            <li className='flex items-center' key={user.id} role='listitem'>
              <UserCard user={user} />
              <div className='ml-auto'>
                <Button
                  onClick={() => switchUser(user.id)}
                  disabled={user.id === currentUser.id}
                  ariaLabel={
                    user.id === currentUser.id
                      ? `${user.name} is currently selected`
                      : `Switch to ${user.name}`
                  }
                >
                  {user.id === currentUser.id ? 'Current User' : 'Switch to'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className='flex-1' aria-labelledby='message-user-heading'>
        <h2 id='message-user-heading' className='text-lg font-semibold mb-4'>
          Message Someone
        </h2>
        <ul className='flex flex-col gap-2.5' role='list'>
          {users?.map((user) => (
            <li className='flex items-center' key={user.id} role='listitem'>
              <UserCard user={user} />
              <div className='ml-auto'>
                <Button
                  onClick={() => messageUser(user.id)}
                  disabled={user.id === currentUser.id}
                  ariaLabel={
                    user.id === currentUser.id
                      ? 'Cannot message yourself'
                      : `Start conversation with ${user.name}`
                  }
                >
                  Message
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserList;
