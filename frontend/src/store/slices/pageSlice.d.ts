export type Route = 'home' | 'chat' | 'profile';
export interface PageState {
    currentPage: Route;
}
export declare const setCurrentPage: import("@reduxjs/toolkit").ActionCreatorWithPayload<Route, "page/setCurrentPage">;
declare const _default: import("redux").Reducer<PageState>;
export default _default;
