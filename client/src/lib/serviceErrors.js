import { isServiceError } from './api.js';

// Tiny pub/sub between wherever a request fails (React Query's caches, or a
// form's own catch block) and the one ServiceErrorModal mounted in main.jsx.
// Only network and server failures are reported; 4xx errors stay inline.
const listeners = new Set();

export function reportServiceError(err) {
  if (!isServiceError(err)) return;
  listeners.forEach((listener) => listener(err));
}

export function onServiceError(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
