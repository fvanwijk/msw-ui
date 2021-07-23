import { DefaultRequestBody, MockedRequest, rest, RestHandler } from 'msw';
import { handlers } from './handlers';
import { scenariosPerHandler } from './mocks';
import worker from './msw-init';

// This helper uses scenarios that are global and not per endpoint.
// So you can set a predefined set of responses for endpoints
export const registerAdminHandler = (scenarios: Record<string, RestHandler[]>): RestHandler => {
  const adminHandler = rest.put<{ scenario?: string }>('/scenario', (req, res, ctx) => {
    const scenarioName = req.body.scenario;
    if (!scenarioName) {
      return res(ctx.status(400, 'Request body should have the form { scenario: "scenarioName" }'));
    }

    const scenario = scenarios[scenarioName];

    if (!scenario) {
      return res(ctx.status(400, `Could not set scenario ${scenarioName} because it does not exist`));
    }

    worker.use(...scenario);

    return res(ctx.status(200));
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
