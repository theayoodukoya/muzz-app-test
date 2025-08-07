export declare const useMessageSearch: (query: string, currentUserId: number) => {
    results: import("../store/slices/messagesSlice").Message[];
    isLoading: boolean;
    error: null;
};
