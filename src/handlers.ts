import { rest } from 'msw';
import { usersSuccess, userSuccess } from './mocks';

export const handlers = [rest.get('/users', usersSuccess), rest.get('/user/:id', userSuccess)];
