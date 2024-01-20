import React from 'react';
import { 
  render, 
  waitForElement, 
  fireEvent, 
  prettyDOM, 
  getByText, 
  getByPlaceholderText, 
  getByAltText, 
  getAllByTestId, 
  queryByText, 
  queryByAltText 
} from '@testing-library/react';
import Application from 'components/Application';
import axios from "axios";

describe('Application', () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  //TestPlan
  // 1. Render the Application.
  // 2. Wait until the text "Archie Cohen" is displayed.
  // 3. Click the "Add" button on the first empty appointment.
  // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  // 5. Click the first interviewer in the list.
  // 6. Click the "Save" button on that same appointment.
  // 7. Check that the element with the text "Saving" is displayed.
  // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
  // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".

  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));
   

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();

  });

//cancelling
//TestPlan
  // 1. Render the Application.
  // 2. Wait until the text "Archie Cohen" is displayed.
  // 3. Click the "Delete" button on the booked appointment.
  // 4. Check that the confirmation message is shown.
  // 5. Click the "Confirm" button on the confirmation.
  // 6. Check that the element with the text "Deleting" is displayed.
  // 7. Wait until the element with the "Add" button is displayed.
  // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);
    //2
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    //3
    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Delete'));
    //4
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();
    //5
    fireEvent.click(queryByText(appointment, 'Confirm'));
    //6
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
    //7
    await waitForElement(() => getByAltText(appointment, 'Add'));
    //8
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  //editing
  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Spiderman' },
    });

    fireEvent.click(queryByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Spiderman'));


    //Find the specific day node that contains the text "Monday". 
    //Import the getAllByTestId query to search the original container for the nodes with data-testid="day".
    //We cannot use getBy and queryBy interchangeably
    //In this situation, we want to use queryByText because we want to have the value null returned if it doesn't find the node.
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  //error handling when booking fails in saving
  //We need to import the axios library into the test file so that we can access the instance and change the put mock.
  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();


    fireEvent.click(queryByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Save')).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, 'Cancel'));

    expect(getByText(container, 'Archie Cohen')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  //error handling when booking fails in deleting
  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(queryByAltText(appointment, 'Delete'));

    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();


    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });
});
//switching Promise to using async and await.(not replacing, work well together)
//The asynchronous function has been defined as one using the async keyword.
//The Promise chain can be hidden by using the await keyword.