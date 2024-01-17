import React, { useState } from 'react';

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]); //Implement a way to add a new mode to the history state array(initial array)

  function transition(newMode) {
    setHistory((prev) => [...prev, newMode]);
  }

  function back() {
    setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
  }

  return { mode: history[history.length - 1], transition, back };
};
//before refactoring:
// const useVisualMode = (initialMode) => {
//   return { mode: initialMode };
//As seen here, the `useVisualMode` function can take an initial argument to set the mode state. We then return an object `{ mode }`, which can also be written as `{ mode: mode }`. 
// This lets our tests (and components) access the current value of the mode from the hook.
export default useVisualMode;