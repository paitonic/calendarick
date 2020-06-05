import React from "react";
import PropTypes from 'prop-types';

// import '../core/calendarick.sass';
import {WEEKDAYS} from '../core/calendar';
import {Calendar} from "../core/Calendar";
import {useCalendar} from "../core/useCalendar";


export function StaticDatePicker(props) {
  const {settings, state, actions} = useCalendar(props);

  return (
    <Calendar settings={settings} state={state} actions={actions}/>
  );
}

// TODO: useCalendar accepts similar props but it is not specified anywhere
StaticDatePicker.propTypes = {
  onDayClick: PropTypes.func,
  onChange: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple', 'range']),
  disableDays: PropTypes.func,
  stateReducer: PropTypes.func,
  calendar: PropTypes.object,
  value: PropTypes.array,
  view: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
  }),
  onViewChange: PropTypes.func,
};

StaticDatePicker.defaultProps = {
  onDayClick: () => {},
  onChange: () => {},
  selectionMode: 'single',
  disableDays: () => {},
  locale: 'en-US',
  weekday: 'short',
  isRTL: false,
  withOutsideDays: true,
  firstDayOfWeek: WEEKDAYS[0],
  month: 'long',
  value: [],
};
