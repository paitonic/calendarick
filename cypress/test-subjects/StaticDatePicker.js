import React, { useState } from 'react';

import {StaticDatePicker as DatePicker} from "../../src/";
import {Inspector} from "../Inspector";

export const StaticDatePicker = (props) => {
  const [date, setDate] = useState(props.value);

  return (
    <>
      <DatePicker {...{onChange: (newDate) => setDate(newDate), value: date, ...props}}/>
      <Inspector output={date} input={props}/>
    </>
  );
};
