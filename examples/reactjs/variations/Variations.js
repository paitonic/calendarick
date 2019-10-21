import React, { useState } from 'react';
import { Calendarik, DatePickerWithPopup } from '../DevelopmentPage';
import { fromArray, isSame, nextDayOf } from '../../../src/calendar';


export const StaticDatePicker = (props) => {
  return (
    <Calendarik {...{selectionMode: 'single', ...props}}/>
  )
};

export const StaticDatePickerWithValue = (props) => {
  return (
    <Calendarik {...{selectionMode: 'single', ...props}} value={props.value}/>
  )
};

export const StaticDatePickerWithDisabledDays = (props) => {
  const d_2020_01_01 = fromArray([2020, 1, 1]);
  const d_2020_01_02 = fromArray([2020, 1, 2]);

  const disableDays = (day) => isSame(day, d_2020_01_02);

  return (
    <Calendarik {...{selectionMode: 'single', disableDays: disableDays, ...props}} value={[ d_2020_01_01 ]}/>
  )
};

export const StaticRangeDatePicker = (props) => {
  return (
    <Calendarik {...{selectionMode: 'range', ...props}}/>
  );
};

export const StaticMultiSelectDatePicker = (props) => {
  return (
    <Calendarik {...{selectionMode: 'multiple', ...props}}/>
  )
};

export const PopupDatePicker = (props) => {
  const [date, setDate] = useState([ new Date() ]);

  return (
    <DatePickerWithPopup {...{selectionMode: 'single', onChange: (newDate) => setDate(newDate)}}/>
  )
};

export const PopupDateRangePicker = (props) => {};

export const PopupMultiSelectPicker = (props) => {};

