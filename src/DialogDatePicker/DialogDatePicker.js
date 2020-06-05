import React from "react";
import PropTypes from "prop-types";

import {ACTION_CLICK_DAY} from "../core/actionTypes";
import {Dialog} from "./Dialog";
import {useWatchChanges} from "../hooks";
import {getInitialState, getViewDate, useCalendar} from "../core/useCalendar";
import {Calendar} from "../core/Calendar";
import {isDeepSameValue, WEEKDAYS} from "../core/calendar";
import {
  ACTION_CLOSE_DIALOG,
  ACTION_COMMIT_VALUE,
  ACTION_OPEN_DIALOG,
  ACTION_REVERT_VALUE,
  ACTION_SET_VALUE
} from "./actionTypes";
import {ReadOnlyDateInput} from "../DateInput/ReadOnlyDateInput";


export function DialogDatePicker(props) {
  const {isAutoClosed, ...componentProps} = props;
  const {settings, state, dispatch, actions} = useCalendar({
    ...componentProps,
    onChange: () => {}, // invoke props.onChange only when `committedValue` is changed. (but not `value`)
    stateReducer: calendarStateReducer,

    // extend the initial state
    initialState: {
      ...getInitialState(props),

      // `commitedValue` is the actual value that user have chosen
      // `value` is a temporal value
      committedValue: props.value,
      isDialogShown: false,
    }
  });

  const inputProps = {
    openDialog,
    closeDialog,
    value: state.committedValue,
    draftValue: state.value,
    setValue,
  };

  function openDialog() {
    dispatch({type: ACTION_OPEN_DIALOG});
  }

  function closeDialog() {
    dispatch({type: ACTION_CLOSE_DIALOG});
  }

  function commitValue() {
    dispatch({type: ACTION_COMMIT_VALUE});
  }

  function revertValue() {
    dispatch({type: ACTION_REVERT_VALUE});
  }

  function setValue(newValue) {
    dispatch({type: ACTION_SET_VALUE, payload: newValue});
  }

  // synchronize the state with the new value if props.value is changed from outside
  useWatchChanges(() => {
    if (!isDeepSameValue(props.value, state.committedValue)) {
      setValue(props.value);
    }
  }, [props.value]);

  // when user approves changes made, call props.onChange()
  useWatchChanges(() => {
    props.onChange(state.committedValue);
  }, [state.committedValue]);

  function calendarStateReducer(state, nextState, action) {
    switch (action.type) {
      case ACTION_CLICK_DAY:
          if (props.selectionMode === 'single' || !props.selectionMode) {
            const finalState = {...nextState};

            if (isAutoClosed) {
              finalState.isDialogShown = false;
              finalState.committedValue = nextState.value;
            }

            return finalState;

        } else if (props.selectionMode === 'range') {
          const days = nextState.value;
          if (days.length === 1 && Array.isArray(days) && Array.isArray(days[0])) {
            const finalState = {...nextState};

            if (isAutoClosed) {
              finalState.isDialogShown = false;
              finalState.committedValue = nextState.value;
            }

            return finalState;
          }
          return nextState;
        } else if (props.selectionMode === 'multiple') {
          // isAutoClosed is not compatible with this selection mode.
          // there is no way to know when dialog should be closed.
          return nextState;
        }

        return nextState;

      case ACTION_OPEN_DIALOG:
        return {...nextState, isDialogShown: true};

      case ACTION_CLOSE_DIALOG:
        return {...nextState, isDialogShown: false};

      case ACTION_COMMIT_VALUE:
        return {...nextState, committedValue: nextState.value};

      case ACTION_REVERT_VALUE:
        return {...nextState, value: nextState.committedValue};

      case ACTION_SET_VALUE:
        return {...nextState, value: action.payload, committedValue: action.payload, view: getViewDate(action.payload)};

      default:
        return nextState;
    }
  }

  function confirm() {
    commitValue();
    closeDialog();
  }

  function cancel() {
    revertValue();
    closeDialog();
  }

  function isFooterShown() {
    return !isAutoClosed || props.selectionMode === 'multiple';
  }

  function changeDialogVisibility(isShown) {
    // exit if nothing was changed
    if (state.isDialogShown === isShown) {
      return;
    }

    if (isShown) {
      openDialog();
    } else {
      closeDialog();
    }
  }

  return (
    <>
      {
        props.children ? props.children(inputProps) : <ReadOnlyDateInput {...inputProps}/>
      }

      <Dialog isShown={state.isDialogShown}
              onChange={changeDialogVisibility}
              onClickAway={revertValue}>

        <Calendar settings={settings} state={state} actions={actions}/>

        {
          isFooterShown() &&
          <div className="calendarick-dialog__footer" data-test-id="dialog__footer">
            <span className="calendarick-dialog__action calendarick-dialog__action--ok" onClick={confirm}
                  data-test-id="dialog__action--ok">OK</span>
            <span className="calendarick-dialog__action calendarick-dialog__action--cancel" onClick={cancel}
                  data-test-id="dialog__action--cancel">Cancel</span>
          </div>
        }
      </Dialog>
    </>
  )
}
// TODO: DRY violation. Identical to StaticDatePicker.
DialogDatePicker.propTypes = {
  /* trigger element (a button, link, input etc) to open the dialog */
  children: PropTypes.func,
  onDayClick: PropTypes.func,
  onChange: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple', 'range']),
  disableDays: PropTypes.func,
  stateReducer: PropTypes.func,
  calendar: PropTypes.object,
  value: PropTypes.array,
  view: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
  }),
  onViewChange: PropTypes.func,
};

DialogDatePicker.defaultProps = {
  onDayClick: () => {},
  onChange: () => {},
  selectionMode: 'single',
  disableDays: () => {},
  locale: 'en-US',
  weekday: 'short',
  isRTL: false,
  withOutsideDays: true,
  firstDayOfWeek: WEEKDAYS[0],
  month: 'long',
  value: [],
};

