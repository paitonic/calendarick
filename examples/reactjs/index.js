import ReactDOM from 'react-dom';
import React, { useState, useContext, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';

import './calendar.sass';

import { calendar } from '../../src';
import clsx from 'clsx';


function Day(props) {
  const {onDayClick} = useContext(PreferencesContext);
  const {dispatch} = useContext(StateContext);

  function handleClick() {
    onDayClick(props.day);
    dispatch({type: ACTION_CLICK_DAY, day: props.day.date});
  }

  return (
    <td className={clsx('day', {
        'day--empty': props.day === null,
        'day--is-outside-month': props.day.isOutsideMonth
    })}
        onClick={handleClick}>
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

/*
Possible actions
- CLICK_DAY
- HOVER_DAY ???
- CLOSE -- close date picker (only relevant if it can be opened/closed)
- OPEN -- open date picker (only relevant if it can be opened/closed)
- CLICK_RIGHT_ARROW - right arrow clicked
- CLICK_LEFT_ARROW - left arrow clicked
- VIEW_MONTH - view month

*/

const ACTION_CLICK_DAY = 'CLICK_DAY';
const ACTION_CLICK_LEFT_ARROW = 'CLICK_LEFT_ARROW';
const ACTION_CLICK_RIGHT_ARROW = 'CLICK_RIGHT_ARROW';

const initialState = {
  date: new Date(),
  selectedDays: {}, // TODO: {"2019-01-01": true, "2019-01-02": true} ???
};

const StateContext = React.createContext(initialState);

function Calendar(props) {
  // TODO: why reducer called twice first time?
  function reducer(state, action) {
    function reduce(state, action) {
      console.log(action);

      switch (action.type) {
        case ACTION_CLICK_DAY:
          return {...state, selectedDays: [action.day]}; // range or single date

        case ACTION_CLICK_LEFT_ARROW:
          return state;

        case ACTION_CLICK_RIGHT_ARROW:
          return state;

        default:
          return state;
      }
    }

    const newState = reduce(state, action);
    const maybeAlteredState = props.stateReducer ? props.stateReducer(newState, action) : newState;

    // merge states
    return Object.assign({}, newState, maybeAlteredState);
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const {getNextMonth, getPreviousMonth} = useContext(CalendarContext);
  const [date, setDate] = useState({month: state.date.getMonth()+1, year: state.date.getFullYear()});

  // TODO: replace with () => dispatch({type: ACTION_CLICK_RIGHT_ARROW})
  function goNextMonth() {
    const [year, month] = getNextMonth(date.year, date.month);
    setDate({year, month});
  }

  // TODO: replace with () => dispatch({type: ACTION_CLICK_LEFT_ARROW})
  function goPreviousMonth() {
    const [year, month] = getPreviousMonth(date.year, date.month);
    setDate({year, month});
  }

  return (
    <>
      <StateContext.Provider value={{state, dispatch}}>
        <Header year={date.year}
                month={date.month}
                onBackClick={goNextMonth}
                onNextClick={goPreviousMonth}/>
        <Month year={date.year} month={date.month}/>
      </StateContext.Provider>
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
          <Calendar stateReducer={props.stateReducer}/>
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

  // TODO: implement custom state reducer for the calendar
  // TODO: see reducer function in Calendar
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTION_CLICK_LEFT_ARROW:
        return {...state, selectedDays: []};

      case ACTION_CLICK_RIGHT_ARROW:
        return state;

      default:
        return state;
    }
  };

  return (
    <>
    <Calendarik onDayClick={(day) => console.log(day)} stateReducer={stateReducer}/>

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

ReactDOM.render(<App/>, document.getElementById('root'));
