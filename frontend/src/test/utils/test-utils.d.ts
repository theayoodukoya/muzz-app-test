import type { ReactElement } from 'react';
import { type RenderOptions } from '@testing-library/react';
import { type MockStoreState } from './mock-store';
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialState?: MockStoreState;
}
declare const customRender: (ui: ReactElement, options?: CustomRenderOptions) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export * from '@testing-library/react';
export { customRender as render };
