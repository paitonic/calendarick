import {toDateRange} from "../utils";
import React from "react";
import {DateInput} from "./DateInput";


export function DateRangeInput(props) {
  return (
    <DateInput {...{
      ...props,
      dateParserFn: toDateRange,
      placeholder: 'YYYY-MM-DD - YYYY-MM-DD',
      testId: 'date-range-input'
    }}/>
  )
}
