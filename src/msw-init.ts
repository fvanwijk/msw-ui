import { setupWorker } from 'msw';
import { handlers } from './handlers';
import { registerAdminHandler } from './msw-ui';

const adminHandler = registerAdminHandler();

const worker = setupWorker(...handlers, adminHandler);

export default worker;
