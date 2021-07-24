// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to set a MSW UI global scenario based.
     * @example cy.setScenario('success');
     */
    setScenario(scenarioName: string): Chainable<Element>;
    /**
     * Custom command to set a MSW UI scenario based on handler name and scenario name.
     * @example cy.setScenarioForHandler('GET /users', 'success');
     */
    setScenarioForHandler(handlerName: string, scenarioName: string): Chainable<Element>;
  }
  interface Window {
    setScenario: (scenarioName: string) => void;
    setScenarioForHandler: (handlerName: string, scenarioName: string) => void;
  }
}

Cypress.Commands.add('setScenario', scenarioName => {
  return cy.window().then(window => {
    window.setScenario(scenarioName);
  });
});
Cypress.Commands.add('setScenarioForHandler', (handlerName, scenarioName) => {
  return cy.window().then(window => {
    window.setScenarioForHandler(handlerName, scenarioName);
  });
});
