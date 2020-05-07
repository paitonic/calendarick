import React from 'react';

import {DateMultiPicker as TheDateMultiPicker} from "../../../src/Calendarick";
import {useStateDebug} from "../utils";

export const DateMultiPicker = (props) => {
  const [, setDate] = useStateDebug(props.value);

  return (
    <TheDateMultiPicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};
