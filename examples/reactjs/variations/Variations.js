import React, { useState } from 'react';
import { Calendarik, DatePickerWithPopup } from '../DevelopmentPage';
import { fromArray, isSame, nextDayOf } from '../../../src/calendar';

const today = new Date();
const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);

export const StaticDatePicker = (props) => <Calendarik {...{selectionMode: 'single', ...props}}/>;

export const StaticDatePickerWithValue = (props) =>
  <Calendarik {...{selectionMode: 'single', ...props}} value={props.value}/>;

export const StaticDatePickerWithDisabledDays = (props) => {
  const d_2020_01_01 = fromArray([2020, 1, 1]);
  const d_2020_01_02 = fromArray([2020, 1, 2]);

  const disableDays = (day) => isSame(day, d_2020_01_02);

  return (
    <Calendarik {...{selectionMode: 'single', disableDays: disableDays, ...props}} value={[ d_2020_01_01 ]}/>
  )
};

export const StaticRangeDatePicker = (props) => <Calendarik {...{selectionMode: 'range', ...props}}/>;

export const StaticRangeDatePickerWithDisabledDays = (props) => {
  const disableDays = (day) => [d_02, d_03].some(date => isSame(day, date));

  return (
    <Calendarik {...{selectionMode: 'range', disableDays: disableDays, ...props}}/>
  )
};

export const StaticMultiSelectDatePicker = (props) => <Calendarik {...{selectionMode: 'multiple', ...props}}/>;

export const StaticMultiSelectDatePickerWithDisabledDays = (props) => {
  const disableDays = (day) => [d_02, d_03].some(date => isSame(day, date));

  return (
    <Calendarik {...{selectionMode: 'multiple', disableDays: disableDays, ...props}}/>
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

