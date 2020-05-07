import React from 'react';

import {DateRangePicker as TheDateRangePicker} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const DateRangePicker = (props) => {
  const [, setDate] = useStateDebug(props.value);

  return (
    <TheDateRangePicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};
