import { RestHandler, SetupWorkerApi } from 'msw';
import { SetupServerApi } from 'msw/node';

export { SetupWorkerApi };

// Currently registered scenarios and active worker reference
export let scenarios: Record<string, RestHandler | RestHandler[]> = {};
export let worker: SetupWorkerApi | SetupServerApi | undefined;

export const register = (
  newWorker: SetupWorkerApi | SetupServerApi,
  newScenarios: Record<string, RestHandler | RestHandler[]>
): void => {
  worker = newWorker;
  scenarios = newScenarios;
};

const hasWorker = (worker?: SetupWorkerApi | SetupServerApi): worker is SetupWorkerApi | SetupServerApi => {
  if (!worker) {
    throw new Error('Please register worker with MSW UI by calling registerWorker(worker)');
  }
  return true;
};

// So you can set a predefined set of responses for endpoints or just one single response
export const setScenario = (scenarioName: string): void => {
  if (hasWorker(worker)) {
    const handlers = scenarios[scenarioName];
    if (!handlers) {
      throw new Error(`Could not set scenario "${scenarioName}" because it does not exist`);
    }

    console.info('Set scenario', `"${scenarioName}"`);

    if (Array.isArray(handlers)) {
      worker.use(...handlers);
    } else {
      worker.use(handlers);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(window as Window).setScenario = setScenario;
