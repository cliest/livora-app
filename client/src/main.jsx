import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ServiceErrorModal from './components/ServiceErrorModal.jsx';
import { isServiceError } from './lib/api.js';
import { reportServiceError } from './lib/serviceErrors.js';

// Cache-level onError fires once a query has used up its retries (or a
// mutation has failed), so the error modal never flashes up for a blip that
// the automatic retry would have recovered from.
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportServiceError }),
  mutationCache: new MutationCache({ onError: reportServiceError }),
  defaultOptions: {
    queries: {
      // Retry once for network/server failures only; a 4xx won't change.
      retry: (failureCount, err) => failureCount < 1 && isServiceError(err),
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
        <ServiceErrorModal />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
