describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });


  //Add test:write a query to find the day that contains the text "Tuesday" and click on it
  it('should navigates to Tuesday', () => {
    cy.visit('/');

  
    // #chain the methods to get the list item that contains the text "Tuesday" and clicks on it.
    // cy.get("li").contains("Tuesday").click()
    // #With a manual test, we would check to see that the "Tuesday" list item has an off white background.
    // cy.contains("li", "Tuesday").should("have.css", "background-color", "rgb(242, 242, 242)")


    // Refactored to use a single command chain that finds the list item, clicks it and checks it for the correct background colour:
    // below: allows us to check that the "Tuesday" list item has a particular off white background colour.
    // clicks it and checks it for the correct background colour.
    // cy.contains('li', 'Tuesday')
    //   .click()
    //   .should('have.css', 'background-color', 'rgb(242, 242, 242)');



    // Refactored to align with best practice and use the data-testid attribute and 'selected' css class to make the test more durable:
    cy.contains('[data-testid=day]', 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });

});