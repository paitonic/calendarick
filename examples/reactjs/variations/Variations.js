import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
  Calendarik,
  DatePicker as TheDatePicker,
  DateRangePicker as TheDateRangePicker,
  DateMultiPicker as TheDateMultiPicker,
  DateInput
} from '../DevelopmentPage';
import { fromArray, isSame, nextDayOf } from '../../../src/calendar';

const today = new Date();
const d_01 = fromArray([today.getFullYear(), today.getMonth()+1, 1]);
const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);

function useStateDebug(initialState) {
  const [something, setSomething] = useState(initialState);
  const debugPane = useRef(null);

  useEffect(() => {
    debugPane.current = document.createElement('pre');
    debugPane.current.setAttribute('data-test-id', 'debug-pane');
    debugPane.current.style.display = 'block';
    debugPane.current.style.background = '#000';
    debugPane.current.style.color = '#fff';
    document.body.append(debugPane.current);
  }, []);

  useEffect(() => {
    debugPane.current.innerText = JSON.stringify(something, null, 3);
  }, [something]);

  return [something, setSomething];
}

export const StaticDatePicker = (props) => <Calendarik {...{selectionMode: 'single', ...props}}/>;

export const StaticDatePickerWithValue = (props) =>
  <Calendarik {...{selectionMode: 'single', ...props}} value={props.value}/>;

export const StaticDatePickerWithDisabledDays = (props) => {
  const [date, setDate] = useStateDebug([ d_01 ]);
  const disableDays = (day) => isSame(day, d_02);

  return (
    <Calendarik {...{selectionMode: 'single', disableDays: disableDays, ...props}} value={date}/>
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

export const DatePicker = (props) => {
  const [date, setDate] = useStateDebug(props.value);

  return (
    <TheDatePicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};

export const DateRangePicker = (props) => {
  const [date, setDate] = useStateDebug(props.value);

  return (
    <TheDateRangePicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};

export const DateMultiPicker = (props) => {
  const [date, setDate] = useStateDebug(props.value);

  return (
    <TheDateMultiPicker {...{onChange: (newDate) => setDate(newDate), ...props}}/>
  )
};

export const DatePickerWithDateInput = (props) => {
  const [date, setDate] = useStateDebug(props.value);
  return <DatePicker onChange={(newDate) => setDate(newDate)} inputComponent={DateInput}/>
};

export const PopupMultiSelectPicker = (props) => {};

