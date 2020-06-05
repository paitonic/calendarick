import React, { useState } from 'react';
import {DialogDatePicker} from "../../src";
import {DateInput} from "../../src/DateInput/DateInput";
import {Inspector} from "../Inspector";

export const DialogDatePickerWithDateInput = (props) => {
  const [date, setDate] = useState(props.value);

  return (
    <>
      <DialogDatePicker {...{onChange: (newDate) => setDate(newDate), ...props}}>
        {(inputProps) => <DateInput {...inputProps}/>}
      </DialogDatePicker>
      <Inspector output={date} input={props}/>
    </>
  )
};
