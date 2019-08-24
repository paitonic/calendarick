import ReactDOM from 'react-dom';
import React, { useState } from 'react';

import './calendar.sass';

import {
  getCalendar,
  getMonths,
  getNextMonth,
  getWeekDays,
  groupByWeeks,
  getPreviousMonth,
  isFirstDayOfWeek, isLastDayOfWeek
} from '../../src/calendar';
import clsx from 'clsx';


function Day(props) {
  return (
    <td className={clsx('day', {'day--empty': props.dayOfMonth === null})}>
      <span>{props.dayOfMonth}</span>
    </td>
  )
}

function WeekDayNames(props) {
  const dayNames = getWeekDays();
  return (
    <tr className='week-days'>
      {
        dayNames.map((dayName, index) => {
          return (
              <td key={`${dayName}-${index}`} className='day-name'>
                {dayName}
              </td>
          )
        })
      }
    </tr>
  )
}


function Week(props) {
  const dayNames = getWeekDays();

  function addMissingDaysPlaceholders() {
    if (props.week.length === 7) {
      return props.week;
    }

    const missingDaysCount = 7 - props.week.length;
    const placeholders = new Array(missingDaysCount).fill({dayOfMonth: null});

    if (!isFirstDayOfWeek(props.week[0].weekDay))  {
      // add placeholders to the start of the week
      return [...placeholders, ...props.week];
    } else if (!isLastDayOfWeek(props.week[props.week.length-1].weekDay)) {
      // add placeholders to the end of the week
      return [...props.week, ...placeholders];
    }
  }

  const weekWithPlaceholders = addMissingDaysPlaceholders();

  return (
    <tr className='week'>
      {
        weekWithPlaceholders.map((day, index) => {
          return <Day key={index} weekDay={day.weekDay} dayOfMonth={day.dayOfMonth}/>
        })
      }
    </tr>
  )
}

function Month(props) {
  const month = getCalendar(props.year, props.month);
  const weeks = groupByWeeks(month);

  return (
    <table className='month'>
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

function Header(props) {
  const readableMonth = getMonths().find(month => month.monthOfYear === props.month).month;
  return (
    <div className="header">
      <span className="header__button-back" onClick={props.onBackClick}>‹</span>
      <span className="header__date">{readableMonth}, {props.year}</span>
      <span className="header__button-next" onClick={props.onNextClick}>›</span>
    </div>
  )
}

function Calendar(props) {
  const today = new Date();
  const [date, setDate] = useState({month: today.getMonth()+1, year: today.getFullYear()});

  function goNextMonth() {
    const [year, month] = getNextMonth(date.year, date.month);
    setDate({year, month});
  }

  function goPreviousMonth() {
    const [year, month] = getPreviousMonth(date.year, date.month);
    setDate({year, month});
  }

  return (
    <>
      <Header year={date.year} month={date.month} onBackClick={goPreviousMonth} onNextClick={goNextMonth}/>
      <Month year={date.year} month={date.month}/>
    </>
  );
}

function App() {
  return (
    <Calendar/>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
