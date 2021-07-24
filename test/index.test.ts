import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultHandlers, register } from '../src';

const usersSuccess = rest.get('/users', (_, res, ctx) =>
  res(ctx.json([{ firstName: 'John', lastName: 'Doe' }]))
);

const usersError = rest.get('/users', (_, res, ctx) => res(ctx.status(200)));

describe('getDefaultHandlers()', () => {
  it('Returns the first handlers of all registered endpoints', () => {
    const worker = setupServer();
    register(worker, {}, {});
    expect(getDefaultHandlers()).toEqual([]);

    register(
      worker,
      {},
      { users: { success: usersSuccess, error: usersError } }
    );
    expect(getDefaultHandlers()).toEqual([usersSuccess]);
  });
});
