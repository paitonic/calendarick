import React, { useState } from 'react';
import {DialogDatePicker} from "../../src";
import {DateRangeInput} from "../../src/DateInput/DateRangeInput";
import {Inspector} from "../Inspector";

export const DialogDateRangePickerWithDateInput = (props) => {
  const [date, setDate] = useState(props.value);
  return (
    <>
      <DialogDatePicker {...{onChange: (newDate) => setDate(newDate), ...props}}>
        {(inputProps) => <DateRangeInput {...inputProps}/>}
      </DialogDatePicker>
      <Inspector output={date} input={props}/>
    </>
  )
};
