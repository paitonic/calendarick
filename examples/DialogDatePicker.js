import React, {useState} from 'react';
import { DialogDatePicker as DatePicker } from "calendarick";


export const DialogDatePicker = (props) => {
  const [date, setDate] = useState([ new Date() ]);

  return (
    <DatePicker value={date} onChange={(newDate) => setDate(newDate)}/>
  );
}
