import React from 'react';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import Application from 'components/Application';

describe('Appointment', () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
});
//switching Promise to using async and await.(not replacing, work well together)
//The asynchronous function has been defined as one using the async keyword.
//The Promise chain can be hidden by using the await keyword.