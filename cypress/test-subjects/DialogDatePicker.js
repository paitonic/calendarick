import React, { useState } from 'react';

import {DialogDatePicker as DatePicker} from "../../src/";
import {Inspector} from "../Inspector";

export const DialogDatePicker = (props) => {
  const [date, setDate] = useState(props.value);

  return (
    <>
      <DatePicker {...{onChange: (newDate) => setDate(newDate), value: date, ...props}}/>
      <Inspector output={date} input={props}/>
    </>
  );
};
