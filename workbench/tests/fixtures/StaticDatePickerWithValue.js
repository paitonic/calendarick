import React from 'react';

import {Calendarick} from "../../../src/Calendarick";

export const StaticDatePickerWithValue = (props) =>
  <Calendarick {...{selectionMode: 'single', ...props}} value={props.value}/>;
