import React from 'react';
import {isSame} from "../../../src/calendar/calendar";
import {Calendarick} from "../../../src/Calendarick";
import {d_01, d_02, useStateDebug} from "../utils";

export const StaticDatePickerWithDisabledDays = (props) => {
  const [date, setDate] = useStateDebug([ d_01 ]);
  const disableDays = (day) => isSame(day, d_02);

  return (
    <Calendarick {...{selectionMode: 'single', disableDays: disableDays, ...props}} value={date}/>
  )
};
