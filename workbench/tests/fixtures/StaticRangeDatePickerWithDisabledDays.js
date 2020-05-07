import React from 'react';

import {isSame} from "../../../src/calendar/calendar";
import {Calendarick} from "../../../src/Calendarick";
import {d_02, d_03} from "../utils";

export const StaticRangeDatePickerWithDisabledDays = (props) => {
  const disableDays = (day) => [d_02, d_03].some(date => isSame(day, date));

  return (
    <Calendarick {...{selectionMode: 'range', disableDays: disableDays, ...props}}/>
  )
};
