describe('Homepage', () => {
  it('should show users', () => {
    cy.visit('/');

    cy.setScenario('users success');
    cy.get('button').click();

    cy.get('pre').first().should('contain.text', 'Frank').should('contain.text', 'van Wijk');

    cy.setScenario('users fail');
    cy.get('button').click();

    cy.get('.error').should('contain.text', 'Error');
  });
});
