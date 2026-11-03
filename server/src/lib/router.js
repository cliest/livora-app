import { Router } from 'express';

// Express 4 doesn't catch errors from async handlers: a rejected promise
// never reaches the error middleware, so the request hangs and Node treats
// it as an unhandled rejection (which crashes the process on Node 15+).
// Routers made here forward those rejections to next(), so the central
// error handler in src/index.js answers with a generic 500 instead.
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const forwardRejections = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export function createRouter() {
  const router = Router();
  for (const method of METHODS) {
    const register = router[method].bind(router);
    router[method] = (path, ...handlers) => register(path, ...handlers.map(forwardRejections));
  }
  return router;
}
