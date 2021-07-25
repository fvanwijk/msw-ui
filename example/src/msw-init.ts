import { setupWorker } from 'msw';
import { scenarios } from './mocks';
import { register } from 'msw-ui';

// We do not register static handlers on the worker
const worker = setupWorker();

register(worker, scenarios);

export default worker;
