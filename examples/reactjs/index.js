import ReactDOM from 'react-dom';
import React from 'react';

import './calendar.sass';

import { getCalendar, getWeekDays, groupByWeeks } from '../../src/calendar';
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
  const weekWithPlaceholders = props.week.length === 7 ? props.week : [...new Array(7 - props.week.length).fill({dayOfMonth: null}), ...props.week];

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
  return (
    <div className="header">
      <span className="header__button-back">‹</span>
      <span className="header__date">{props.month}, {props.year}</span>
      <span className="header__button-next">›</span>
    </div>
  )
}

function App() {
  return (
    <>
      <Header year={2019} month={'October'}/>
      <Month year={2019} month={8}/>
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));