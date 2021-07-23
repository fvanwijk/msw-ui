import { ResponseResolver, rest, RestContext, RestHandler, RestRequest } from 'msw';
import { User } from './components/user-service';

const frank: User = { firstName: 'Frank', lastName: 'van Wijk' };
const jim: User = { firstName: 'Jim', lastName: 'Bloemkolk' };

// Single user
export const userSuccess: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => res(ctx.json(frank));
export const userFail: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => res(ctx.status(500));

// List of users
export const usersSuccess: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => res(ctx.json([frank, jim]));
export const usersFail: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => res(ctx.status(500));

// Global scenarios to set multiple endpoints
export const scenarios: Record<string, RestHandler[]> = {
  success: [rest.get('/users', usersSuccess), rest.get('/user/:id', userSuccess)],
  fail: [rest.get('/users', usersFail), rest.get('/user/:id', userFail)],
};

// Scenarios per handler
export const scenariosPerHandler: Record<string, Record<string, RestHandler>> = {
  'GET /users': {
    'success users': rest.get('/users', usersSuccess),
    'fail users': rest.get('/users', usersFail),
  },
  'GET /user/:id': {
    success: rest.get('/user/:id', usersSuccess),
    fail: rest.get('/user/:id', usersFail),
  },
};

// Initial handlers to register with worker
export const handlers = Object.values(scenariosPerHandler).flatMap(handler => Object.values(handler)[0]);
