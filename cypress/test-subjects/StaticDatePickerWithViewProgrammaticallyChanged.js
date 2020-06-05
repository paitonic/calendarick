import React, { useState } from 'react';
import {StaticDatePicker} from "../../src";
import {Inspector} from "../Inspector";

export const StaticDatePickerWithViewProgrammaticallyChanged = (props) => {
  const [view, setView] = useState(props.view);

  const calendarikProps = {
    ...props,
    view,
    onViewChange: (toView) => setView(toView),
  };

  return (
    <div>
      <StaticDatePicker {...calendarikProps} value={props.value}/>
      <button data-test-id="button-2020-02" type="button" onClick={() => setView({month: 2, year: 2020})}>View 2020-02</button>
      <button data-test-id="button-2021-03" type="button" onClick={() => setView({month: 3, year: 2021})}>View 2021-03</button>
      <Inspector output={view} input={props}/>
    </div>
  )
};
