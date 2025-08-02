import { useAppSelector } from '@/hooks/useAppSelector';
import UserCard from '@/components/ui/UserCard';

const ProfileTab = () => {
  const currentRecipient = useAppSelector(
    (state) => state.user.currentRecipient
  );

  return (
    <div className='h-full overflow-auto'>
      <div className='text-center py-7 flex flex-col gap-4'>
        {currentRecipient && <UserCard user={currentRecipient} />}
        <p>This tab is a placeholder - no improvements are needed.</p>
      </div>
    </div>
  );
};

export default ProfileTab;
