import { setupWorker } from 'msw';
import { scenarios, scenariosPerHandler } from './mocks';
import { register, setDefaultHandlers } from './msw-ui';

// We do not register static handlers on the worker
const worker = setupWorker();

register(worker, scenarios, scenariosPerHandler);
setDefaultHandlers();

export default worker;
