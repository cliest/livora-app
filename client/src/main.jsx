import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ServiceErrorModal from './components/ServiceErrorModal.jsx';
import { createQueryClient } from './lib/queryClient.js';

const queryClient = createQueryClient();

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
