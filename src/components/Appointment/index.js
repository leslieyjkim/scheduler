import React from 'react';
import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import useVisualMode from '../../hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const EDIT = 'EDIT';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  //When props.interview contains a value, then we want to pass useVisualMode the SHOW mode, if it is empty then we should pass EMPTY.
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //1. save function (save interview appointment)
  //In order to save appointments, the save function should be passed as a prop to our “Create” component
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }
  //2. delete function (delete interview appointment)
  function destroy() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
  }

  return (
    <article className='appointment' data-testid='appointment'>
      <Header time={props.time} />
      {/* above line: Update the onAdd function we pass to our Empty component to transition to the CREATE mode when the user clicks the add appointment button */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />} 
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}

      {/* When the mode === CREATE we want to show the Form component. */}
      {/* Pass in props.interviewers to the interviewers prop for Form. */}
      {/* Backing out : add the onCancel prop so that we return to the EMPTY state when we click the cancel button. Use back function.*/}
      {/* Pass in the save function to the correct prop in the Form component. After that is done, pass in the back function from useVisualMode to the Form component. */}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={back} 
          onSave={save} />
      )}

      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message='Saving' />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === CONFIRM && (
        <Confirm
          message='Are you sure you would like to delete?'
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message='Could not book appointment.' onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message='Could not cancel appointment.' onClose={back} />
      )}
    </article>
  );
}
