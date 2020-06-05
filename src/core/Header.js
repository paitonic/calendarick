import React, {useContext} from "react";
import PropTypes from "prop-types";

import {getMonths} from "./calendar";
import {SettingsContext} from "./context";


export function Header(props) {
  const {locale, month} = useContext(SettingsContext);
  const {month: monthName, order} = getMonths({locale, month}).find(month => month.order === props.month);

  return (
    <div className="calendarick-header">
      <span className="calendarick-header__button-back"
            onClick={props.onBackClick} data-test-id="button-left">‹</span>
      <span className="calendarick-header__date">
        <span data-test-id={`month-${String(order).padStart(2, '0')}`}>{monthName}</span> <span
        data-test-id={`year-${props.year}`}>{props.year}</span>
      </span>
      <span className="calendarick-header__button-next"
            onClick={props.onNextClick} data-test-id="button-right">›</span>
    </div>
  )
}

Header.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
};
