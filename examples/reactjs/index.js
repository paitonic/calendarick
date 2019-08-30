import ReactDOM from 'react-dom';
import React, { useState, useContext } from 'react';

import './calendar.sass';

import { calendar } from '../../src';
import clsx from 'clsx';

// TODO: date range
// TODO: add class to mark current day
// TODO: mark outside days with different class
// TODO: add option to disable days by condition
// TODO: year selection (open dropdown to select custom year?)
// TODO: keyboard navigation
// TODO: locale configuration

// problem with that approach is that, it is not possible to change properties dynamically
// e.g if calendar has button to toggle between outside days (show/hide), it's not possible to change it in runtime.
// const {
//   getCalendar,
//   getMonths,
//   getNextMonth,
//   getWeekDays,
//   groupByWeeks,
//   getPreviousMonth,
//   isFirstDayOfWeek,
//   isLastDayOfWeek
// } = calendar();


function Day(props) {
  return (
    <td className={clsx('day', {'day--empty': props.day === null})}>
      <span>{props.day ? props.day.getDate() : null}</span>
    </td>
  )
}

function WeekDayNames(props) {
  const {getWeekDays} = useContext(CalendarContext);
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
  const {isFirstDayOfWeek, isLastDayOfWeek} = useContext(CalendarContext);

  function addMissingDaysPlaceholders() {
    if (props.week.length === 7) {
      return props.week;
    }

    const missingDaysCount = 7 - props.week.length;
    const placeholders = new Array(missingDaysCount).fill(null);

    if (!isFirstDayOfWeek(props.week[0]))  {
      // add placeholders to the start of the week
      return [...placeholders, ...props.week];
    } else if (!isLastDayOfWeek(props.week[props.week.length-1])) {
      // add placeholders to the end of the week
      return [...props.week, ...placeholders];
    }
  }

  const weekWithPlaceholders = addMissingDaysPlaceholders();

  return (
    <tr className='week'>
      {
        weekWithPlaceholders.map((day, index) => {
          return <Day key={index} day={day}/>
        })
      }
    </tr>
  )
}

function Month(props) {
  const {getCalendar, groupByWeeks} = useContext(CalendarContext);
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
  const {getMonths} = useContext(CalendarContext);
  const readableMonth = getMonths().find(month => month.order === props.month).month;
  return (
    <div className="header">
      <span className="header__button-back" onClick={props.onBackClick}>‹</span>
      <span className="header__date">{readableMonth}, {props.year}</span>
      <span className="header__button-next" onClick={props.onNextClick}>›</span>
    </div>
  )
}

function Calendar(props) {
  const {getNextMonth, getPreviousMonth} = useContext(CalendarContext);
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

const CalendarContext = React.createContext({});

function App() {
  return (
    <CalendarContext.Provider value={calendar()}>
      <Calendar/>
    </CalendarContext.Provider>
  );
}

// function withCalendar(WrappedComponent) {
//   return function(props) {
//     return (
//       <WrappedComponent calendar={calendar()} {...props}/>
//     )
//   }
// }

// hook?
// function useCalendar(state) {
//
// }

ReactDOM.render(<App/>, document.getElementById('root'));
