import ReactDOM from 'react-dom';
import React from 'react';

import './calendar.sass';

import { getCalendar } from '../../src/calendar';


// function Week(props) {
//   return ()
// }
//
function Day(props) {
  return (
    <div className="day">
      <span>{props.dayOfMonth}</span>
    </div>
  )
}

function App() {
  return (
    <>
      {getCalendar(2019, 8).map((day, index) => {
        return <Day key={day.dayOfMonth} weekDay={day.weekDay} dayOfMonth={day.dayOfMonth}/>
      })}
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
