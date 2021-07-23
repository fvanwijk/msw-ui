import { DefaultRequestBody, MockedRequest, rest, RestHandler } from 'msw';
import { handlers } from './handlers';
import { scenariosPerHandler } from './mocks';
import worker, { scenarios } from './msw-init';

// This helper uses scenarios that are global and not per endpoint.
// So you can set a predefined set of responses for endpoints
export const setScenario = (scenarioName: string): void => {
  const handlers = scenarios[scenarioName];
  if (!handlers) {
    throw new Error(`Could not set scenario "${scenarioName}" because it does not exist`);
  }

  console.info('Set scenario', `"${scenarioName}"`);

  worker.use(...handlers);
};

// Additional helper that does setScenario but via an MSW endpoint /scenario (not used but kept for reference in case we need it, in Cypress for example)
export const registerAdminHandler = (): RestHandler => {
  const adminHandler = rest.put<{ scenario?: string }>('/scenario', (req, res, ctx) => {
    const scenarioName = req.body.scenario;
    if (!scenarioName) {
      throw new Error(`'Request body should have the form { scenario: "scenarioName" }'`);
    }
    try {
      setScenario(scenarioName);

      return res(ctx.status(200));
    } catch (e) {
      res(ctx.status(400, e.message));
    }
  });

  console.info(`Register admin handler ${adminHandler.info.header}`);

  return adminHandler;
};

// This helper creates one extra handler (PUT .../scenario) per MSW handler
export const registerAdminHandlersPerHandler = (): RestHandler<MockedRequest<DefaultRequestBody>>[] => {
  console.log('Register admin handlers per handler');
  const adminHandlers = handlers.map(handler => {
    const adminHandler = rest.put<{ scenario?: string }>(`${handler.info.mask}/scenario`, (req, res, ctx) => {
      const scenarioName = req.body.scenario;
      if (!scenarioName) {
        return res(ctx.status(400, 'Request body should have the form { scenario: "scenarioName" }'));
      }
      const header = handler.info.header;

      const handlerScenarios = scenariosPerHandler[header];
      if (!handlerScenarios) {
        return res(ctx.status(400, `There are no scenarios defined for handler ${header}`));
      }
      const scenario = handlerScenarios[scenarioName];

      if (!scenario) {
        return res(
          ctx.status(400, `Could not set scenario ${scenarioName} because it does not exist for handler ${header}`)
        );
      }

      worker.use(scenario);

      return res(ctx.status(200));
    });
    console.info(adminHandler.info.header);
    return adminHandler;
  });

  return adminHandlers;
};
