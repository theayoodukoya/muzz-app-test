import type { Message } from '@/store/slices/messagesSlice';
interface HeaderProps {
    onMessageSelect?: (message: Message) => void;
}
declare const Header: ({ onMessageSelect }: HeaderProps) => import("react").JSX.Element | null;
export default Header;
