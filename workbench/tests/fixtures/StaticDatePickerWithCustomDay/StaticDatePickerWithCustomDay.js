import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";

import {Calendarick, format} from "../../../../src/Calendarick";
import './StaticDatePickerWithCustomDay.sass';

export const StaticDatePickerWithCustomDay = (props) => {
  const config = {
    selectionMode: 'single',
    dayComponent: CustomDay,
    ...props,
  };

  return <Calendarick {...config}/>
};

function EventDetails(props) {
  return (
    <div className="event-details">
      <h5 className="event-details__title">Event</h5>
      <p>wow. such day.</p>
    </div>
  )
}

function CustomDay(props) {
  const [isMouseOverDay, setIsMouseOverDay] = useState(false);

  const showEventDetails = () => {
    props.onMouseEnter();
    setIsMouseOverDay(true);
  };

  const hideEventDetails = () => {
    props.onMouseLeave();
    setIsMouseOverDay(false);
  };

  return (
    <td className={clsx('day-custom', 'day', {
      'day--is-outside-month': props.day.isOutsideMonth,
      'day--is-selected': props.isSelected,
      'day--is-disabled': props.isDisabled,
      'day--is-today': props.isToday,
      'day--is-highlighted': props.isHighlighted,
    })}
        onClick={props.onClick}
        data-test-id={format(props.day.date)}
        onMouseEnter={showEventDetails}
        onMouseLeave={hideEventDetails}>
      <span>{props.day.date ? props.day.date.getDate() : null}</span>
      {
        isMouseOverDay &&
        <EventDetails date={props.day.date}/>
      }
    </td>
  )
}

StaticDatePickerWithCustomDay.propTypes = {
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
