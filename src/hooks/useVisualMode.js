import React, { useState } from 'react';

const useVisualMode = (initialMode) => {
  const [mode, setMode] = useState(initialMode);

  function transition(newMode) {
    setMode(newMode);
  }

  return { mode, transition };
};
//before refactoring:
// const useVisualMode = (initialMode) => {
//   return { mode: initialMode };
//As seen here, the `useVisualMode` function can take an initial argument to set the mode state. We then return an object `{ mode }`, which can also be written as `{ mode: mode }`. 
// This lets our tests (and components) access the current value of the mode from the hook.
export default useVisualMode;