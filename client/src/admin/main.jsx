import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import '../index.css';
import AdminApp from './AdminApp.jsx';
import ServiceErrorModal from '../components/ServiceErrorModal.jsx';
import { createQueryClient } from '../lib/queryClient.js';

// The dashboard's address is private: Nginx serves admin.html only under it
// (see deploy/nginx-admin.conf), and it's never written into the code. The
// app reads it back from the URL it was opened at, e.g. /staff-x7k2m9/bookings
// → basename /staff-x7k2m9. In local dev that's /admin.
const basename = `/${window.location.pathname.split('/')[1] || 'admin'}`;

const queryClient = createQueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <AdminApp />
        <ServiceErrorModal staff />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
