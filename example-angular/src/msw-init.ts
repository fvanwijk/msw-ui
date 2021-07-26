import { setupWorker } from 'msw';
import { register } from 'msw-ui';
import { scenarios } from './mocks';

const worker = setupWorker();
register(worker, scenarios);

export default worker;
