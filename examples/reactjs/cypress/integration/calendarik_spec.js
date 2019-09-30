describe(' My First Test', () => {
  const URL = 'http://localhost:1234/';

  it('Open page', () => {
    cy.visit(URL);
  });

  it('select range', () => {
    cy.visit(URL);
    cy.get('[data-testid="2019-09-22"]').click().should('have.class', 'day--is-selected');
    cy.get('[data-testid="2019-09-24"]').click().should('have.class', 'day--is-selected');

    cy.get('[data-testid="2019-09-23"]').should('have.class', 'day--is-selected');
  });
});
