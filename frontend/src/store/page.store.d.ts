export type Route = 'home' | 'chat' | 'profile';
type PageState = {
    currentPage: Route;
    setCurrentPage: (page: Route) => void;
};
declare const usePageStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PageState>>;
export default usePageStore;
