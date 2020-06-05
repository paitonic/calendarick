import {formatDate} from "../utils";
import PropTypes from "prop-types";
import React from "react";

export function ReadOnlyDateInput(props) {
  return (
    <input onClick={props.openDialog}
           value={formatDate(props.value)}
           readOnly={true}
           data-test-id="dialog__date-input"/>
  )
}

ReadOnlyDateInput.propTypes = {
  openDialog: PropTypes.func.isRequired,
  value: PropTypes.array,
};
