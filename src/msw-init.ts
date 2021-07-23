import { setupWorker } from 'msw';
import { handlers } from './mocks';

const worker = setupWorker(...handlers);

export default worker;
