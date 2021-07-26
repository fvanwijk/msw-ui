<h1 align="center">Mock Service Worker UI</h1>

<p align="center">Change predefined MSW handlers on run time via the user interface</p>

## Features

[Mock Service Worker](https://mswjs.io) is an awesome tool to setup mock responses for HTTP calls in the browser or in Node.

One of the benefits is that you can mock all requests to external APIs with a static mock reponse for rapid prototyping or quick local frontend development.

The nature of MSW is that all mocked handlers are set using code and the MSW client runs inside your application. This makes it hard to override handlers in a running application without making code changes.

MSW UI is an extension on top of MSW that allows you to set new mock handlers on run time, based on scenarios. A scenario is in fact a preset to set one or multiple handlers at once.
Then it is just as simple as calling `setScenario('badrequest')` somewhere in your code to activate the 'badrequest' scenario that you have defined upfront.

To prevent you from mixing `setScenario` calls with production code, this library also contains a Vue page component that you can conditionally load in Vue router only when `process.NODE_ENV === 'development'`. This is to ensure that you never ship any MSW UI (or MSW) code to production.
This component renders a simple but effective UI to quickly activate one of the scenarios.

![MSW UI](./msw-ui.png)

## How to use

1. `npm install msw-ui -D`
2. Add MSW to your project (see [MSW docs](https://mswjs.io/docs/getting-started/integrate/browser))
3. Define and export global scenarios and/or scenarios per endpoint, for example

```typescript
// mocks.ts
import { RestHandler } from 'msw';

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

4. Register the scenarios with MSW UI. Usually you do this after the `setupWorker()` call

```typescript
import { register } from 'msw-ui';
import { scenarios } from './mocks';

const worker = setupWorker();
register(worker, scenarios);
```

5. Somewhere in your code call `setScenario('success')` to set handlers for the 'success' scenario.

You could also skip step 5 and use the UI to set scenarios directly from the browser.

6. Integrate the page component into your Vue app that has Vue Router enabled (sorry no support for other frameworks or vanilla JS yet, but you could easily create something yourself):

### VueJS

```typescript
// router/index.ts
import MSWUI from 'msw-ui/src/vue/MSW-UI.vue';
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

### Angular

Conditionally import `MSWModule` and it will add the page to your app.

```typescript
// app-routing.module.ts
import { MSWModule } from 'msw-ui/dist/angular';
import { scenarios } from './mocks';

let mswModule = [];
if (process.env.NODE_ENV === 'development') {
  mswModule = [MSWModule.forRoot(scenarios)];
}

@NgModule({
  imports: [RouterModule.forRoot(routes), ...mswModule],
  exports: [RouterModule],
})

```

7. Visit `/msw-ui` in your local app

## Future work

MSW is designed to set handlers only once when the application initializes. It doesn't expect you to override handlers via user actions. This means that when you refresh the page, all handlers are reset.

To overcome this, we have to persist handlers so that you can restore state after refreshing the browser. MSW UI doesn't see which handlers are registered via `setupWorker` or `worker.use`, but we know when `setScenario` is called. Instead of persisting handlers, we can persist which scenarios are active. Therefore is it advised when you use MSW UI not so set handlers directly on the worker, but always use scenarios.

This also allows us to list the scenarios that are currently active.

### NodeJs

Theoretically all the scenario stuff should also work in Node but I haven't tested it yet. The use case is also less strong because usually you use MSW in unit tests and you will set mocks manually during a specific test.

## Run example (Vue)

To see how it works, clone this repo and install dependencies and start the dev server on http://localhost:8080.
Don't forget to open your browser development tools to see MSW and MSW UI logging.

```
cd example-vue
npm install
npm run serve
```

## Run example (Angular)

To see how it works, clone this repo and install dependencies and start the dev server on http://localhost:4200.
Don't forget to open your browser development tools to see MSW and MSW UI logging.

```
cd example-angular
npm install
npm run build msw-ui-angular
npm start
```

## Development

This is a TSdx project, so all relevant scripts related to the TS src are in package.json.

The Vue component can be imported directly from `msw-ui/src/MSW-UI.vue`.
The Angular module must be imported from dist so that means we have to build it.
It is developed as an Angular Library so you have to run from `example-angular`:

```
npm run build msw-ui-angular // build to library for use in the example app
npm run copy-lib // copy the built files to dist
```

This is done automatically when you run `npm publish` (`prepare` script).
