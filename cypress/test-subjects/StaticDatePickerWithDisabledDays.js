import React, { useState } from 'react';

import {isSame} from "../../src/core/calendar";
import {StaticDatePicker} from "../../src";
import {d_02, d_03} from "../constants";
import {Inspector} from "../Inspector";


export const StaticDatePickerWithDisabledDays = (props) => {
  const [value, setValue] = useState(props.value);
  const disableDays = (day) => [d_02, d_03].some((disabledDay) => isSame(day, disabledDay));
  const combinedProps = {
    ...props,
    disableDays,
    onChange: (newDate) => setValue(newDate),
  };

  return (
    <>
      <StaticDatePicker {...combinedProps}/>
      <Inspector input={props} output={value}/>
    </>
  )
};
