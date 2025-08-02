import type { User } from '@/store/user.store';

const UserCard = ({ user }: { user: User }) => {
  return (
    <div
      className='flex gap-2.5 items-center justify-center'
      role='group'
      aria-label={`User ${user.name}`}
    >
      <img
        className='w-10 h-auto rounded-full'
        src={user.profile || '/placeholder.svg'}
        alt={`Profile picture of ${user.name}`}
        role='img'
      />
      <div className='font-semibold' aria-label={`Username: ${user.name}`}>
        {user.name}
      </div>
    </div>
  );
};

export default UserCard;
