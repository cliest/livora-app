import { QueryCache, QueryClient, MutationCache } from '@tanstack/react-query';
import { isServiceError } from './api.js';
import { reportServiceError } from './serviceErrors.js';

// Shared by the public site (main.jsx) and the staff dashboard
// (admin/main.jsx). Cache-level onError fires once a query has used up its
// retries (or a mutation has failed), so the error modal never flashes up for
// a blip that the automatic retry would have recovered from.
export function createQueryClient() {
  return new QueryClient({
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
}
