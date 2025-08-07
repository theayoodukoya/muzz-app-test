export interface User {
    id: number;
    name: string;
    profile: string;
}
export interface UserState {
    currentUser: User;
    currentRecipient: User | null;
}
export declare const setCurrentUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User, "user/setCurrentUser">, setCurrentRecipient: import("@reduxjs/toolkit").ActionCreatorWithPayload<User | null, "user/setCurrentRecipient">;
declare const _default: import("redux").Reducer<UserState>;
export default _default;
