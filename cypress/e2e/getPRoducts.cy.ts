/* ==== Test Created with Cypress Studio ==== */
it('Get-Products', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:5173/products');
  cy.get(':nth-child(2) > .overflow-visible > .p-6 > :nth-child(2)').should('have.text', 'Mi Increíble Producto Nuevo');
  cy.get(':nth-child(4) > .overflow-visible > .p-6 > :nth-child(2)').should('have.text', 'hola q hay');
  /* ==== End Cypress Studio ==== */
});