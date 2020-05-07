import React from 'react';
import {DateRangeInput, DateRangePicker as TheDateRangePicker} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const DateRangePickerWithDateInput = (props) => {
  const [, setDate] = useStateDebug(props.value);
  return <TheDateRangePicker {...{onChange: (newDate) => setDate(newDate), inputComponent: DateRangeInput, ...props}}/>
};
