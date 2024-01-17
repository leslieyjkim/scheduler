import React, { useState } from 'react';

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]); //Implement a way to add a new mode to the history state array(initial array)


  //In some situations we'll transition twice and then have the back action return us to the initial state. (예:저장 중 오류발생화면/ 뒤로 가면 status상태말고, 초기양식으로 표시)
  function transition(newMode, replace = false) {
    setHistory((prev) =>
      replace
        ? [...prev.slice(0, prev.length - 1), newMode]  //When replace is true then set the history to reflect that we are replacing the current mode.
        : [...prev, newMode]
    );
  }


  function back() {
    // setHistory((prev) => [...prev.slice(0, prev.length - 1)]); //because of 'back limit':prevent from going back past the initial mode
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
    }
  }

  return { mode: history[history.length - 1], transition, back };
};
//before refactoring:
// const useVisualMode = (initialMode) => {
//   return { mode: initialMode };
//As seen here, the `useVisualMode` function can take an initial argument to set the mode state. We then return an object `{ mode }`, which can also be written as `{ mode: mode }`. 
// This lets our tests (and components) access the current value of the mode from the hook.
export default useVisualMode;