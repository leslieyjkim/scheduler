import React from 'react';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import Application from 'components/Application';

describe('Appointment', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => { //We can make our test asynchronous by returning a Promise.
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
});

//The waitForElement function returns a promise that resolves when the callback returns a truthy value and rejects after a time out when it cannot find the specified text. 
//When we return a Promise from the test function, the Jest framework knows that the test isn't complete until the promise chain has resolved or rejected.