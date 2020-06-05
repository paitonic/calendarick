import React, {useContext} from "react";

import {Day} from "./Day";
import {getWeekDays} from "./calendar";
import {SettingsContext} from "./context";


export function WeekDayNames(props) {
  const {locale, firstDayOfWeek, weekday, isRTL} = useContext(SettingsContext);
  const dayNames = getWeekDays({locale, firstDayOfWeek, weekday, isRTL});

  return (
    <tr className='calendarick-weekday-list'>
      {
        dayNames.map((dayName, index) => {
          return (
            <td key={`${dayName}-${index}`} className='calendarick-weekday' data-test-id={`week-day-${index + 1}`}>
              {dayName}
            </td>
          )
        })
      }
    </tr>
  )
}

export function Week(props) {
  return (
    <tr className='calendarick-week'>
      {
        props.week.map((day, index) => {
          return <Day key={index} day={day}/>
        })
      }
    </tr>
  )
}
