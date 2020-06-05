import React, {useEffect, useState} from "react";
import {useWatchChanges} from "../hooks";
import {formatDate, toDate} from "../utils";
import PropTypes from "prop-types";


export function DateInput(props) {
  const [displayValue, setDisplayValue] = useState(props.dateFormatterFn(props.value));

  useWatchChanges(() => {
    const parse = props.dateParserFn ? props.dateParserFn : toDate;
    const parsedDate = parse(displayValue);
    if (parsedDate) {
      props.setValue(parsedDate);
    }
  }, [displayValue]);

  useEffect(() => {
    setDisplayValue(props.dateFormatterFn(props.value));
  }, [props.value]);

  function handleChange(event) {
    setDisplayValue(event.target.value);
  }

  return (
    <>
      <input value={displayValue} onChange={handleChange} data-test-id={props.testId} placeholder={props.placeholder}/>
      <button onClick={props.openDialog} data-test-id="date-input-open-button">open</button>
    </>
  )
}

DateInput.propTypes = {
  dateParserFn: PropTypes.func,
  dateFormatterFn: PropTypes.func,
  testId: PropTypes.string,
  value: PropTypes.array,
  setValue: PropTypes.func,
};

DateInput.defaultProps = {
  testId: 'date-input',
  dateParserFn: toDate,
  dateFormatterFn: formatDate,
};
