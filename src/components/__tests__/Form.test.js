import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Form from 'components/Appointment/Form';

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      student: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  it('renders without student name if not provided', () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );

    expect(getByPlaceholderText('Enter Student Name')).toHaveValue('');
  });
//We can use getByPlaceholderText("Enter Student Name") or getByTestId("student-name-input") to find the same element in the DOM.


  it('renders with initial student name', () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name='Lydia Miller-Jones' />
    );

    expect(getByTestId('student-name-input')).toHaveValue('Lydia Miller-Jones');
  });
//above: When we use getByTestId we need to add the matching data-testid value to the node that we want to find.
//Add the data-testid with the value "student-name-input" to the input element in the src/components/Appointment/Form.js file.


//#1.
  it('validates that the student name is not blank', () => {
    /* (1). Create the mock onSave function */
    const onSave = jest.fn();
    /* (2). Render the Form with interviewers and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined */
    const { getByText } = render(
      <Form 
        interviewers={interviewers} 
        onSave={onSave} 
      />
    );
    /* (3). Click the save button */
    fireEvent.click(getByText('Save'));

    /* 1. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    /* 2. onSave is not called */  
    expect(onSave).not.toHaveBeenCalled();
  });


//#2.
  it('validates that the interviewer cannot be null', () => {
    const onSave = jest.fn();

    const { getByText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        name='Lydia Miller-Jones'
      />
    );

    fireEvent.click(getByText('Save'));

    /* 3. validation is shown */
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    /* 4. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });

  //#3.
  it('calls onSave function when the name and interviewer is defined', () => {
    const onSave = jest.fn();

    const { getByText, queryByText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        name='Lydia Miller-Jones'
        interviewer={interviewers[0].id}
      />
    );
//"click", which lets us access the function as fireEvent.click(). 
//pass an argument that is the element we want to click.
    fireEvent.click(getByText('Save'));

    /* 5. validation is not shown */
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    /* 6. onSave is called once*/
    expect(onSave).toHaveBeenCalledTimes(1);
    /* 7. onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledWith('Lydia Miller-Jones', 1);
  });
});


//'onSave' reference is a mock function that we can pass to the Form component.
//'getByText' we should be confident that the element exists.
//test for the absence of something by using 'queryByText' and checking that the value is null.