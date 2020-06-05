import React, {useContext} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import {format} from "../utils";
import {isBetween, isIn, isToday} from "./calendar";
import {SettingsContext, StateContext} from "./context";


export function DayView(props) {
    return (
      <td className={clsx('calendarick-day', {
          'calendarick-day--is-outside-month': props.day.isOutsideMonth,
          'calendarick-day--is-selected': props.isSelected,
          'calendarick-day--is-disabled': props.isDisabled,
          'calendarick-day--is-today': props.isToday,
          'calendarick-day--is-highlighted': props.isHighlighted,
          })}
          onClick={props.onClick}
          data-test-id={format(props.day.date)}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}>
        <span>{props.day.date ? props.day.date.getDate() : null}</span>
      </td>
    )
}

DayView.propTypes = {
  day: PropTypes.shape({
    isOutsideMonth: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
  }),

  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isToday: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
};

export function Day(props) {
  // props.day.date might be null if groupByWeeks called with fillMissingDaysWithNull=true
  if (props.day.date === null) {
    return <td className='calendarick-day--placeholder'></td>
  }

  const {onDayClick, disableDays, selectionMode, dayComponent: CustomDay} = useContext(SettingsContext);
  const {state, actions: {mouseEnterDay, mouseLeaveDay, clickDay}} = useContext(StateContext);
  const isDisabled = disableDays(props.day.date);
  const dayProps = {
    day: props.day,
    isSelected: isIn(props.day.date, state.value),
    isDisabled: disableDays(props.day.date),
    isToday: isToday(props.day.date),
    isHighlighted: isHighlighted(),
    onMouseEnter: () => mouseEnterDay(props.day.date),
    onMouseLeave: () => mouseLeaveDay(props.day.date),
    onClick: handleClick,
  };
  function handleClick() {
    if (isDisabled) {
      return;
    }

    onDayClick(props.day);
    clickDay(props.day.date);
  }

  function isHighlighted() {
    if (selectionMode !== 'range') {
      return false;
    }

    const [start, _] = state.value;
    return start !== undefined && state.mouseOverDay !== null && isBetween(props.day.date, start, state.mouseOverDay);
  }

  return CustomDay ? <CustomDay {...dayProps}/> : <DayView {...dayProps}/>
}
