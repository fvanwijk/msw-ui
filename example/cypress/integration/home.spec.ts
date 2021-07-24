describe('Homepage', () => {
  it('should show users', () => {
    cy.visit('/');

    cy.setScenarioForHandler('GET /users', 'success users');
    cy.get('button').click();

    cy.get('pre').first().should('contain.text', 'Frank').should('contain.text', 'van Wijk');

    cy.setScenarioForHandler('GET /users', 'fail users');
    cy.get('button').click();

    cy.get('.error').should('contain.text', 'Error');
  });
});
