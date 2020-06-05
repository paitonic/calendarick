import React, { useState } from 'react';
import { StaticDatePicker } from "calendarick";


export const StaticDatePickerExample = () => {
  const [date, setDate] = useState([ new Date() ]);

  return (
    <StaticDatePicker value={date} onChange={(newDate) => setDate(newDate)}/>
  );
}
