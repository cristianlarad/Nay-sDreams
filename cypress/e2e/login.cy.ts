/* ==== Test Created with Cypress Studio ==== */
it("Register-Login", function () {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit("http://localhost:5173/login");
  cy.get("#username").type("Cris");
  cy.get("#password").type("12345678");
  cy.get(".flex-col > .inline-flex").click();
  cy.get(".min-h-screen").click();
  cy.get(".fixed > .mx-auto").click();
  cy.get(".min-h-screen").click();
  cy.get(".fixed > .mx-auto").should("be.visible");
  /* ==== End Cypress Studio ==== */
});
