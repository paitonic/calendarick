import React, { useState } from 'react';
import { Calendarik, DatePickerWithPopup } from '../DevelopmentPage';


export const InlineDatePicker = (props) => {
  return (
    <Calendarik {...{selectionMode: 'single', ...props}}/>
  )
};

export const InlineRangeDatePicker = (props) => {
  return (
    <Calendarik {...{selectionMode: 'range', ...props}}/>
  );
};

export const InlineMultiSelectDatePicker = (props) => {
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

