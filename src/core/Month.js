import React, {useContext} from "react";

import {getCalendar, groupByWeeks, isOutsideMonth} from "./calendar";
import {Week, WeekDayNames} from "./Week";
import {SettingsContext} from "./context";


export function Month(props) {
  const {locale, withOutsideDays, weekday, firstDayOfWeek, isRTL} = useContext(SettingsContext);
  const month = getCalendar(props.year, props.month, {locale, withOutsideDays, weekday, firstDayOfWeek, isRTL});
  const weeks = groupByWeeks(firstDayOfWeek, month, {fillMissingDaysWithNull: true, isRTL}).map((week) => {
    return week.map((day) => {
      return {date: day, isOutsideMonth: day ? isOutsideMonth(props.month, day) : true};
    });
  });

  return (
    <table className='calendarick-month'>
      <tbody>
      <WeekDayNames/>

      {
        weeks.map((week, index) => {
          return <Week key={index} week={week}/>
        })
      }
      </tbody>
    </table>
  )
}
