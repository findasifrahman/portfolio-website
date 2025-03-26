describe('Portfolio Website', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates through main sections', () => {
    // Check hero section
    cy.get('h1').contains('Md. Asifur Rahman');
    
    // Navigate to Projects
    cy.get('button').contains('Projects').click();
    cy.url().should('include', '/projects');
    
    // Check projects are loaded
    cy.get('[data-testid="project-card"]').should('have.length.at.least', 1);
    
    // Navigate to Skills
    cy.get('button').contains('Skills').click();
    cy.url().should('include', '/skills');
    
    // Check skills categories
    cy.get('[data-testid="skills-category"]').should('have.length.at.least', 1);
  });

  it('toggles theme mode', () => {
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('body').should('have.css', 'background-color', 'rgb(18, 18, 18)');
  });
}); 