import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { register, setScenario } from '../src';

jest.mock('msw/node', () => ({
  setupServer: () => ({ use: jest.fn() }),
}));

const usersSuccess = rest.get('/users', (_, res, ctx) => res(ctx.json([{ firstName: 'John', lastName: 'Doe' }])));

const usersError = rest.get('/users', (_, res, ctx) => res(ctx.status(200)));

describe('setScenario()', () => {
  it('Sets the handlers that belong to the given scenario', () => {
    const worker = setupServer();
    register(worker, {
      success: [usersSuccess, usersError],
      'users success': usersSuccess,
    });

    setScenario('users success');
    expect(worker.use).toHaveBeenCalledWith(usersSuccess);
  });
});
