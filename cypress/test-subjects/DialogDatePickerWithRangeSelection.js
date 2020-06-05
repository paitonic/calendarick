import React, { useState } from 'react';

import {DialogDatePicker} from "../../src";
import {ReadOnlyDateInput} from "../../src/DateInput/ReadOnlyDateInput";
import {Inspector} from "../Inspector";

export const DialogDatePickerWithRangeSelection = (props) => {
  const [date, setDate] = useState(props.value);

  return (
    <>
      <DialogDatePicker {...{onChange: (newDate) => setDate(newDate), ...props}}>
        {(inputProps) => <ReadOnlyDateInput {...inputProps}/>}
      </DialogDatePicker>
      <Inspector output={date} input={props}/>
    </>
  )
};
