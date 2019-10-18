import React, { useState, useContext, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';

import './calendar.sass';

import { calendar } from '../../src';
import clsx from 'clsx';
import { isSame, prevDayOf, clone, nextDayOf } from '../../src/calendar';


function format(date) {
  const year = date.getFullYear();
  const month = `${(date.getMonth()+1)}`.padStart(2, '0');
  const day = `${(date.getDate())}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Day(props) {
  const {onDayClick, disableDays} = useContext(PreferencesContext);
  const {isIn} = useContext(CalendarContext);
  const {state: {value}, dispatch} = useContext(StateContext);
  const isDisabled = disableDays(props.day.date);

  function handleClick() {
    if (isDisabled) {
      return;
    }

    onDayClick(props.day);
    dispatch({type: ACTION_CLICK_DAY, day: props.day.date});
  }

  return (
    <td className={clsx('day', {
        'day--empty': props.day === null,
        'day--is-outside-month': props.day.isOutsideMonth,
        'day--is-selected': isIn(props.day.date, value),
        'day--is-disabled': disableDays(props.day.date),
    })}
        onClick={handleClick}
        data-testid={format(props.day.date)}>
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
              <td key={`${dayName}-${index}`} className='day-name' data-test-id={`week-day-${index+1}`}>
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
  const {month, order} = getMonths().find(month => month.order === props.month);

  return (
    <div className="header">
      <span className="header__button-back" onClick={props.onBackClick} data-testid="button-left">‹</span>
      <span className="header__date">
        <span data-testid={`month-${order}`}>{month}</span> <span data-testid={`year-${props.year}`}>{props.year}</span>
      </span>
      <span className="header__button-next" onClick={props.onNextClick} data-testid="button-right">›</span>
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
- CHANGE_MONTH - change current displayed month
- CLEAR_SELECTED_DAYS - clear selected dates
*/

const ACTION_CLICK_DAY = 'CLICK_DAY';
const ACTION_CLICK_LEFT_ARROW = 'CLICK_LEFT_ARROW';
const ACTION_CLICK_RIGHT_ARROW = 'CLICK_RIGHT_ARROW';
const CHANGE_VALUE = 'CHANGE_VALUE';

const initialState = {
  date: new Date(),
  /**
   * One day
   * value: [<Date>]
   *
   * Multiple selected days
   * value: [<Date>, <Date>]
   *
   * Range
   * value: [ [<Date>, <Date>] ]
   *
   * Multiple selected dates with range
   * value: [ <Date>, [<Date>, <Date>], <Date> ]
   */
  value: [],
};

const StateContext = React.createContext(initialState);

function useWatchChanges(fn, dependencies) {
  const wasCalledAtLeastOnce = useRef(false);

  useEffect(() => {
    if (wasCalledAtLeastOnce.current) {
      fn();
    } else {
      wasCalledAtLeastOnce.current = true;
    }
  }, dependencies);
}

function Calendar(props) {
  const {getNextMonth, getPreviousMonth, isSame, minDate, maxDate} = useContext(CalendarContext);
  const {disableDays, value} = useContext(PreferencesContext);

  useEffect(() => {
    // TODO: investigate. when using DatePickerWithPopup, CHANGE_VALUE is dispatched even though dates are equal
    if (value !== state.value) {
      dispatch({type: CHANGE_VALUE, value});
    }
  }, [value]);

  function reducer(state, action) {
    function reduce(state, action) {
      console.log(action);
      function handleClickDay() {
        if (disableDays(action.day)) {
          return state;
        }

        if (props.selectionMode === 'single' || props.selectionMode === 'multiple') {
          const isSelected = state.value.some(day => isSame(day, action.day));
          // deselect date
          if (isSelected) {
            return {...state, value: [...state.value.filter(day => !isSame(day, action.day))]}
          }

          if (props.selectionMode === 'single') {
            return {...state, value: [action.day]};
          } else if (props.selectionMode === 'multiple') {
            return isSelected ? state : {...state, value: [...state.value, action.day]}
          } else {
            return state;
          }
        } else if (props.selectionMode === 'range') {
          // selectDays might be [ <Date> ] (only start date selected)
          // or [ [<Date>, <Date>] ] when start & end selected
          const [ content ] = state.value;
          const [start, end] = Array.isArray(content) ? content : [content, undefined];

          if (start && !end) {
            return {...state, value: [ [minDate([start, action.day]), maxDate([start, action.day])] ]};
          } else {
            return {...state, value: [action.day]};
          }
        } else {
          return state;
        }
      }

      switch (action.type) {
        case ACTION_CLICK_DAY:
          return handleClickDay();

        case ACTION_CLICK_LEFT_ARROW:
          return state;

        case ACTION_CLICK_RIGHT_ARROW:
          return state;

        case CHANGE_VALUE:
          return {...state, value: action.value};

        default:
          return state;
      }
    }

    const nextState = reduce(state, action);
    // TODO: change it to pass: current state, next state and an action
    const stateOverride = props.stateReducer ? props.stateReducer(action, state, nextState) : nextState;

    // merge states
    const finalState = Object.assign({}, nextState, stateOverride);
    console.debug(finalState);

    return finalState;
  }

  const [state, dispatch] = useReducer(reducer, {...initialState, value: value || initialState.value});

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

  useWatchChanges(() => {
    props.onChange(state.value);
  }, [state.value]);

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
      calendar: props.calendar,
      onDayClick: props.onDayClick,
      selectionMode: props.selectionMode,
      disableDays: props.disableDays,
      value: props.value,
  };

  return (
    <CalendarContext.Provider value={calendar(preferences.calendar)}>
      <PreferencesContext.Provider value={preferences}>
          <Calendar stateReducer={props.stateReducer}
                    onChange={props.onChange}
                    selectionMode={props.selectionMode}
                    disableDays={props.disableDays}/>
      </PreferencesContext.Provider>
    </CalendarContext.Provider>
  );
}

Calendarik.propTypes = {
  onDayClick: PropTypes.func,
  onChange: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple', 'range']),
  disableDays: PropTypes.func,
  stateReducer: PropTypes.func,
  calendar: PropTypes.object,
  value: PropTypes.array,
};

Calendarik.defaultProps = {
  onDayClick: () => {},
  onChange: () => {},
  selectionMode: 'single',
  disableDays: () => {},
  calendar: {
    locale: 'he',
    weekday: 'narrow',
    isRTL: true,
    withOutsideDays: true,
  },
  value: [],
};

function useClickAway(targetRef, onClickAway = () => {}) {
  const [isShown, setIsShown] = useState(false);

  function handleClick(event) {
    if (isShown && !targetRef.current.contains(event.target)) {
      setIsShown(false);
      onClickAway();
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


function DateInput(props) {
  return (
    <input type="text" className="date-input"/>
  )
}

function Popup(props) {
  const popupRef = useRef(null);
  const [isShown, setIsShown] = useClickAway(popupRef, props.onClickAway);

  useEffect(() => {
    props.onChange(isShown);
  }, [isShown]);

  useEffect(() => {
    setIsShown(props.isShown);
  }, [props.isShown]);

  return (
    <>
    {
      <div className={`popup ${isShown ? '' : 'popup--closed'}`} ref={popupRef}>
        {props.children}
      </div>

    }
      {isShown && <div className="popup__backdrop"></div>}
    </>
  )
}

// TODO: write useDraftValue hook that handles the draft
// TODO: Idea for hook that reverts last action or series of actions? (undo)
function DatePickerWithPopup(props) {
  const [isShown, setIsShown] = useState(false);
  const [date, setDate] = useState(props.value);
  const [draftDate, setDraftDate] = useState(clone(props.value));
  const {isAutoClosed, ...calendarProps} = props;

  useEffect(() => {
    setDate(props.value);
    setDraftDate(props.value);
  }, [props.value]);

  function revertChanges() {
    setDraftDate(clone(date));
  }

  const calendarStateReducer = (action, previousState, nextState) => {
    switch (action.type) {
      case ACTION_CLICK_DAY:
        if (props.selectionMode === 'single' || !props.selectionMode) {
          setDraftDate(nextState.value);

          if (isAutoClosed) {
            setIsShown(false);
            setDate(nextState.value);
            props.onChange(nextState.value);
          }
          return nextState;
        } else if (props.selectionMode === 'range') {
          const days = nextState.value;
          if (days.length === 1 && Array.isArray(days) && Array.isArray(days[0])) {
            setDraftDate(nextState.value);

            if (isAutoClosed) {
              setIsShown(false);
              setDate(nextState.value);
              props.onChange(nextState.value);
            }
          }
          return nextState;
        } else if (props.selectionMode === 'multiple') {
          // isAutoClosed is not compatible with this selection mode.
          // there is no way to know when popup should be closed.
          setDraftDate(nextState.value);
          return nextState;
        }

        return nextState;

      default:
        return nextState;
    }
  };

  function representDate(date) {
    // handle single date, multiple dates and range
    if (!date || date && date.length === 0) {
      return '';
    } else if (date instanceof Date) {
      return format(date);
    } else if (date.length && date[0].length === 2) {
      // range
      return date[0].map(format).join(' - ');
    } else if (date.length) {
      // multiple
      return date.map(format).join(', ');
    }
  }

  function handleChange(newDate) {
    setDraftDate(newDate);
  }

  function confirm() {
    setDate(clone(draftDate));
    setIsShown(false);
  }

  function cancel() {
    revertChanges();
    setIsShown(false);
  }

  function isFooterShown() {
    return !isAutoClosed || props.selectionMode === 'multiple';
  }

  return (
    <>
      <input onClick={() => setIsShown(true)} value={representDate(draftDate)} readOnly={true}/>

      <Popup isShown={isShown} onChange={(change) => setIsShown(change)} onClickAway={revertChanges}>
         <Calendarik {...calendarProps}
                     stateReducer={calendarStateReducer}
                     onChange={(newDate) => handleChange(newDate)}
                     value={draftDate}/>
        {
          isFooterShown() &&
           <div className="popup__footer">
             <span className="popup__action popup__action--ok" onClick={confirm}>OK</span>
             <span className="popup__action popup__action--cancel" onClick={cancel}>Cancel</span>
           </div>
        }
      </Popup>
    </>
    )
}

DatePickerWithPopup.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export function DevelopmentPage(props) {
  const today = new Date();
  const tomorrow = nextDayOf(today);

  // single select
  const [date, setDate] = useState([ today ]);

  // multi select
  // const [date, setDate] = useState([today, tomorrow]);

  // range
  // const [date, setDate] = useState([ [today, tomorrow] ]);

  // TODO: implement custom state reducer for the calendar
  // TODO: see reducer function in Calendar
  const stateReducer = (action, previousState, nextState) => {
    switch (action.type) {
      default:
        return nextState;
    }
  };

  const yesterday = prevDayOf(new Date());
  function shouldDayBeDisabled(day) {
    return isSame(day, yesterday);
  }

  function handleChange(date) {
    setDate(date);
  }

  return (
    <>
    <Calendarik onDayClick={(day) => {}}
                onChange={(day) => {console.log('onChange: ', day)}}
                stateReducer={stateReducer}
                selectionMode="range"
                disableDays={shouldDayBeDisabled}
    />


    <DatePickerWithPopup selectionMode="single"
                         isAutoClosed={true}
                         value={date}
                         onChange={handleChange}
    />

      {/*<DateInput/>*/}
    </>
  );
}
