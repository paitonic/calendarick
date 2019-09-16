import ReactDOM from 'react-dom';
import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './calendar.sass';

import { calendar } from '../../src';
import clsx from 'clsx';

// TODO: date range
// TODO: add class to mark current day
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
  const {onDayClick} = useContext(PreferencesContext);

  function handleClick() {
    onDayClick(props.day);
  }

  return (
    <td className={clsx('day', {'day--empty': props.day === null, 'day--is-outside-month': props.day.isOutsideMonth})} onClick={handleClick}>
      <span>{props.day.date ? props.day.date.getDate() : null}</span>
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
  return (
    <tr className='week'>
      {
        props.week.map((day, index) => {
          return <Day key={index} day={day}/>
        })
      }
    </tr>
  )
}

function Month(props) {
  const {getCalendar, groupByWeeks, isOutsideMonth} = useContext(CalendarContext);
  const month = getCalendar(props.year, props.month);
  const weeks = groupByWeeks(month, {fillMissingDaysWithNull: true}).map((week) => {
    return week.map((day) => {
      return {date: day, isOutsideMonth: day ? isOutsideMonth(props.month, day) : true};
    });
  });


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

// TODO: if isRTL=true, change onBackClick handler with onNextClick handler
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
const PreferencesContext = React.createContext({});

function Calendarik(props) {
    const preferences = {
      calendar: {
        locale: 'he',
        weekday: 'narrow',
        isRTL: true,
        withOutsideDays: true,
      },
      onDayClick: props.onDayClick,
  };

  return (
    <CalendarContext.Provider value={calendar(preferences.calendar)}>
      <PreferencesContext.Provider value={preferences}>
        <Calendar/>
      </PreferencesContext.Provider>
    </CalendarContext.Provider>
  );
}

Calendarik.propTypes = {
  onDayClick: PropTypes.func,
};

Calendarik.defaultProps = {
  onDayClick: () => {},
};

function useClickAway(targetRef) {
  const [isShown, setIsShown] = useState(false);

  function handleClick(event) {
    if (isShown && !targetRef.current.contains(event.target)) {
      setIsShown(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return function() {
      document.removeEventListener('click', handleClick);
    }
  }, [isShown]);

  return [isShown, setIsShown]
}

function App(props) {
  // const [isShown, setIsShown] = useState(false);
  const calendarikRef = useRef(null);
  const [isShown, setIsShown] = useClickAway(calendarikRef);

  return (
    <>
    <Calendarik onDayClick={(day) => console.log(day)}/>

    <input onClick={() => setIsShown(true)}/>
      {
        isShown &&
        <div ref={calendarikRef}>
          <Calendarik/>
        </div>
      }
    </>
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
