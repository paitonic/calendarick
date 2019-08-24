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

/**

 <WeekDayNames names={getWeekDays()}/>
  {
    getWeekDays(getCalendar(2019, 8)).map((days) => {
      return <Week key={days[0].dayOfMonth} days={days}/>
    })
  }
**/
function App() {
  return (
    <Month year={2019} month={8}/>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
