# MSW UI for Angular

This library contains a module that integrates a MSW UI on route `/msw`.

## Build

Run `ng build msw-ui-angular` from the `example-angular` directory to build the library. The build artifacts will be stored in the `dist/` directory. After building, the library can be imported in the example app.

We also need to build this to the `dist` directory of the root project, so that it can be imported from the `msw-ui` package in any Angular app.

```
npm run copy-lb
```
