import React from 'react';

import {DatePicker as TheDatePicker} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const DatePicker = (props) => {
  const [, setDate] = useStateDebug(props.value);

  return (
    <TheDatePicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};
