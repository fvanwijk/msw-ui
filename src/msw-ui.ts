import { RestHandler, SetupWorkerApi } from 'msw';

// Currently registered scenarios and active worker reference
export let scenarios: Record<string, RestHandler[]> = {};
export let scenariosPerHandler: Record<string, Record<string, RestHandler>> = {};
export let worker: SetupWorkerApi | undefined;

export const register = (
  newWorker: SetupWorkerApi,
  newScenarios: Record<string, RestHandler[]>,
  newScenariosPerHandler: Record<string, Record<string, RestHandler>>
): void => {
  worker = newWorker;
  scenarios = newScenarios;
  scenariosPerHandler = newScenariosPerHandler;
};

const hasWorker = (worker?: SetupWorkerApi): worker is SetupWorkerApi => {
  if (!worker) {
    throw new Error('Please register worker with MSW UI by calling registerWorker(worker)');
  }
  return true;
};

// Initial handlers to register with worker
export const getDefaultHandlers = (): RestHandler[] =>
  Object.values(scenariosPerHandler).map(handler => Object.values(handler)[0]);

// Set all default handlers
export const setDefaultHandlers = (): void => {
  if (hasWorker(worker)) {
    console.info('Set default mock handlers');
    worker.use(...getDefaultHandlers());
  }
};

// This helper uses scenarios that are global and not per endpoint.
// So you can set a predefined set of responses for endpoints
export const setScenario = (scenarioName: string): void => {
  if (hasWorker(worker)) {
    const handlers = scenarios[scenarioName];
    if (!handlers) {
      throw new Error(`Could not set scenario "${scenarioName}" because it does not exist`);
    }

    console.info('Set global scenario', `"${scenarioName}"`);

    worker.use(...handlers);
  }
};

export const setScenarioForHandler = (handlerName: string, scenarioName: string): void => {
  if (hasWorker(worker)) {
    console.info(`Set scenario for ${handlerName}`, `"${scenarioName}"`);
    worker.use(scenariosPerHandler[handlerName][scenarioName]);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(window as Window).setScenario = setScenario;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(window as Window).setScenarioForHandler = setScenarioForHandler;
