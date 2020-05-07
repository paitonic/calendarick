import React, {useEffect, useRef, useState} from 'react';
import {fromArray} from '../../src/calendar/calendar';

export const today = new Date();
export const d_01 = fromArray([today.getFullYear(), today.getMonth()+1, 1]);
export const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
export const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);

export const useStateDebug = (initialState) => {
  const [value, setValue] = useState(initialState);
  const debugPane = useRef(null);

  useEffect(() => {
    debugPane.current = document.createElement('pre');
    debugPane.current.setAttribute('data-test-id', 'debug-pane');
    debugPane.current.style.display = 'block';
    debugPane.current.style.background = '#000';
    debugPane.current.style.color = '#fff';
    document.body.append(debugPane.current);
  }, []);

  useEffect(() => {
    debugPane.current.innerText = JSON.stringify(value, null, 3);
  }, [value]);

  return [value, setValue];
}

export const withPropsDebug = (Component) => {
  return (props) => {
    return (
      <>
        <Component {...props}/>
        <pre>{JSON.stringify(props, null, 3)}</pre>
      </>
    )
  }
};

export const withComponentSourceCode = (Component) => {
  // TODO: experiment with replacing prop names in component source code with the actual props
  return (props) => {
    return (
      <>
        <Component {...props}/>
        <pre>{Component.toString()}</pre>
      </>
    )
  }
};
