import React, { useState } from 'react';

const useVisualMode = (initialMode) => {
  const [mode, setMode] = useState(initialMode);

  return { mode };
};
//As seen here, the `useVisualMode` function can take an initial argument to set the mode state. We then return an object `{ mode }`, which can also be written as `{ mode: mode }`. 
// This lets our tests (and components) access the current value of the mode from the hook.
export default useVisualMode;