export type User = {
    id: number;
    name: string;
    profile: string;
};
type UserState = {
    currentUser: User;
    setCurrentUser: (user: User) => void;
    currentRecipient: User | null;
    setCurrentRecipient: (user: User | null) => void;
};
declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserState>>;
export default useUserStore;
