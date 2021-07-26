import { rest, RestHandler } from 'msw';

export interface User {
  firstName: string;
  lastName: string;
}

const frank: User = { firstName: 'Frank', lastName: 'van Wijk' };
const jim: User = { firstName: 'Jim', lastName: 'Bloemkolk' };

// Single user
export const userSuccess: RestHandler = rest.get('/user/:id', (req, res, ctx) => res(ctx.json(frank)));
export const userFail: RestHandler = rest.get('/user/:id', (req, res, ctx) => res(ctx.status(500)));

// List of users
export const usersSuccess: RestHandler = rest.get('/users', (req, res, ctx) => res(ctx.json([frank, jim])));
export const usersFail: RestHandler = rest.get('/users', (req, res, ctx) => res(ctx.status(500)));

export const scenarios: Record<string, RestHandler | RestHandler[]> = {
  // Global scenarios
  success: [usersSuccess, userSuccess],
  fail: [usersFail, userFail],

  // Handlers for one endpoint
  'users success': usersSuccess,
  'users fail': usersFail,
  'user success': userSuccess,
  'user fail': userSuccess,
};
