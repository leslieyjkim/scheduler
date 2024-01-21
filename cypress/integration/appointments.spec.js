describe('Appointments', () => {
  beforeEach(() => {
    //Add the Cypress function to the beginning of the test function and rerun the tests.
    cy.request('GET', '/api/debug/reset');

    cy.visit('/');
    
    cy.contains('[data-testid=day]', 'Monday');
});

  it("should book an interview", () => {
    //We need to use first because there are two Add buttons, we hide the second one because it is part of the last appointment, which we only want to display the header with the time
    cy.get('[alt=Add]').first().click();

    //We use the testid that already exists to find the input field.
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    //We also want to choose one of the interviewers.
    //Each interviewer list item contains an image with an alt attribute matching the name of the interviewer. 
    cy.get("[alt='Sylvia Palmer']").click();

    //Clicks the save button
    //There is no testid or alt attribute on the save button.
    cy.contains('Save').click();

    //Sees the booked appointment
    //verify that we show the student and interviewer names within and element
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });
});