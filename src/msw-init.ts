import { setupWorker } from 'msw';
import { handlers } from './handlers';
import { scenarios } from './mocks';
import { registerAdminHandler } from './msw-ui';

const adminHandler = registerAdminHandler(scenarios);

const worker = setupWorker(...handlers, adminHandler);

export default worker;
