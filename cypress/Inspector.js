import React, { useState } from "react";
import PropTypes from 'prop-types';
import clsx from "clsx";


const VIEW = {
  OUTPUT: 'output',
  INPUT: 'input',
};

export const Inspector = (props) => {
  const [view, setView] = useState(VIEW.OUTPUT);

  const represent = (value) => {
    return (
      value ? JSON.stringify(value, null, 4) : null
    )
  }

  return (
    <>
      <div className="inspector">
        <div className={clsx("inspector__tab", {"inspector__tab--selected": view === VIEW.OUTPUT})}
             onClick={() => setView(VIEW.OUTPUT)}>
          OUTPUT
        </div>

        <div className={clsx("inspector__tab", {"inspector__tab--selected": view === VIEW.INPUT})}
             onClick={() => setView(VIEW.INPUT)}>
          INPUT
        </div>

      {
        view === VIEW.OUTPUT &&
        <pre data-test-id={'test-output'}>
          {represent(props.output)}
        </pre>
      }

      {
        view === VIEW.INPUT &&
        <pre data-test-id={'test-input'}>
          {represent(props.input)}
        </pre>
      }
      </div>
    </>
  )
}

Inspector.propTypes = {
  // output from the component (e.g value of variable) that can be used to determine
  // whether the component is in desired state.
  output: PropTypes.any,

  // component props
  input: PropTypes.object
};
