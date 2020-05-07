import React from 'react';
import {DateInput, DatePicker} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const DatePickerWithDateInput = (props) => {
  const [, setDate] = useStateDebug(props.value);
  return <DatePicker {...{onChange: (newDate) => setDate(newDate), inputComponent: DateInput, ...props}}/>
};
