# Mock Service Worker UI

[Mock Service Worker](https://mswjs.io) is an awesome tool to setup mock responses for HTTP calls in the browser or in Node.

One of the benefits is that you can mock all requests to external APIs with a static mock reponse for rapid prototyping or quick local frontend development.

The nature of MSW is that all mocked handlers are set using code and the MSW client runs inside your application. This makes it hard to override handlers.

MSW-UI is an extension on top of MSW that allows you to set new mock handlers on run time, based on scenarios. A scenario is in fact a preset to set one or multiple handlers at once.
Then it is just as simple as calling `setScenario('badrequest')` somewhere in your code to activate the 'badrequest' scenario that you have defined upfront.

To prevent you from mixing `setScenario` calls with production code, this library also contains a Vue page component that you can conditionally load in Vue router only when `process.NODE_ENV === 'development'`. This is to ensure that you never ship any MSW-UI (or MSW) code to production.
This component renders a simple but effective UI to quickly activate one of the scenarios.

![MSW-UI](./msw-ui.png)

## How to use

1. `npm install msw-ui -D`
2. Add MSW to your project (see [MSW docs](https://mswjs.io/docs/getting-started/integrate/browser))
3. Define and export global scenarios and/or scenarios per endpoint, for example

```typescript
// mocks.ts

const usersSuccess: RestHandler = rest.get('/users', (req, res, ctx) =>
  res(
    ctx.json([
      { firstName: 'Frank', lastName: 'van Wijk' },
      { firstName: 'Jim', lastName: 'Bloemkolk' },
    ])
  )
);
const usersFail: RestHandler = rest.get('/users', (req, res, ctx) => res(ctx.status(500)));
const userSuccess: RestHandler = rest.get('/user/:id', (req, res, ctx) =>
  res(ctx.json({ firstName: 'Frank', lastName: 'van Wijk' }))
);
const userFail: RestHandler = rest.get('/user/:id', (req, res, ctx) => res(ctx.status(500)));

export const scenarios: Record<string, RestHandler[]> = {
  success: [usersSuccess, userSuccess],
  fail: [usersFail, userFail],

  'users success': usersSuccess,
  'users fail': usersFail,
  'user success': userSuccess,
  'user fail': userSuccess,
};
```

4. Register the scenarios with MSW-UI. Usually you do this after the `setupWorker()` call

```typescript
import { register } from 'msw-ui';
import { scenarios } from './mocks';

const worker = setupWorker(); // Do not pass initial handlers directly to setupWorker
register(worker, scenarios);
```

5. Somewhere in your code call `setScenario('success')` to set handlers for the 'success' scenario.

You could also skip step 4 and use the UI to set scenarios directly from the browser.

6. Integrate the page component into your Vue app that has Vue Router enabled (sorry no support for other frameworks or vanilla JS yet, but you could easily create something yourself):

```typescript
// router/index.js
import MSWUI from 'msw-ui/src/MSW-UI.vue';
import { scenarios } from '@/mocks';

if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: '/msw-ui',
    name: 'MSW UI',
    component: MSWUI,
    props: {
      scenarios,
    },
  });
}
```

7. Visit `/msw-ui` in your local app

## Future work

- When you hard refresh the page, the MSW client is reinitialized so that all handlers that were set after initialization are gone. You also can't see which scenarios are currently active. MSW is designed to set handlers only once when the application initializes. Persisting scenarios that are active will be implemented in MSW-UI, so that you can restore state after refreshing the browser.
- Theoretically all the scenario stuff should also work in Node but I haven't tested it yet. The use case is also less strong because usually you use MSW in unit tests and you will set mocks manually during a specific test.

## Run example locally

To see how it works, clone this repo and install dependencies and start the dev server on http://localhost:8080.
Don't forget to open your browser development tools to see MSW and MSW-UI logging.

```
npm install
npm run serve
```
