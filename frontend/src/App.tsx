import Container from '@/components/ui/Container';
import Chat from '@/pages/chat/Chat';
import Home from '@/pages/home/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/useAppSelector';
import './App.css';

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

const AppContent = () => {
  const currentPage = useAppSelector((state) => state.page.currentPage);

  return (
    <Container>
      {currentPage === 'home' && <Home />}
      {currentPage === 'chat' && <Chat />}
    </Container>
  );
};

export default App;
