import { RestHandler, setupWorker } from 'msw';
import { handlers } from './handlers';

export let scenarios: Record<string, RestHandler[]> = {};
const worker = setupWorker(...handlers);

export default worker;

export const registerScenarios = (newScenarios: Record<string, RestHandler[]>): void => {
  scenarios = newScenarios;
};
