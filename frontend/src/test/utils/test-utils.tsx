import type { ReactElement, ReactNode } from 'react';
import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMockStore, type MockStoreState } from './mock-store';

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: MockStoreState;
}

const createWrapper = (initialState?: MockStoreState) => {
  return function AllTheProviders({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const store = createMockStore(initialState);

    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  };
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { initialState, ...renderOptions } = options;

  return rtlRender(ui, {
    wrapper: createWrapper(initialState),
    ...renderOptions,
  });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render function with our custom one
export { customRender as render };
