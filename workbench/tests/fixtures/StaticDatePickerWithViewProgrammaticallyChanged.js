import React from 'react';
import {Calendarick} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const StaticDatePickerWithViewProgrammaticallyChanged = (props) => {
  const [view, setView] = useStateDebug(props.view);

  const calendarikProps = {
    ...props,
    selectionMode: 'single',
    view,
    onViewChange: (toView) => setView(toView),
  };

  return (
    <div>
      <Calendarick {...calendarikProps} value={props.value}/>
      <div>{view ? `view: ${view.year}-${view.month}` : 'view: undefined'}</div>
      <button data-test-id="button-2020-02" type="button" onClick={() => setView({month: 2, year: 2020})}>View 2020-02</button>
      <button data-test-id="button-2021-03" type="button" onClick={() => setView({month: 3, year: 2021})}>View 2021-03</button>
    </div>
  )
};
