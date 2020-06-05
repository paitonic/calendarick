import {getNextMonth, getPreviousMonth, isBefore, isSame, isDeepSameValue} from "./calendar";
import {useEffect, useReducer} from "react";
import {createDateRange} from "../utils";
import * as actions from "./actionTypes";
import {initialState} from "./context";
import {useWatchChanges} from "../hooks";


// TODO: propTypes for useCalendar?
export function useCalendar(props) {
  // user passed props
  const settings = {
    locale: props.locale,
    weekday: props.weekday,
    isRTL: props.isRTL,
    withOutsideDays: props.withOutsideDays,
    firstDayOfWeek: props.firstDayOfWeek,
    month: props.month,
    onDayClick: props.onDayClick,
    selectionMode: props.selectionMode,
    disableDays: props.disableDays,
    dayComponent: props.dayComponent,
    onViewChange: props.onViewChange,
  };

  useEffect(() => {
    if (!isDeepSameValue(props.value, state.value)) {
      changeValue(props.value);
      changeView(getViewDate(props.value));
    }
  }, [props.value]);

  useEffect(() => {
    if (props.view && state.view !== props.view) {
      changeView(props.view);
    }
  }, [props.view]);

  // TODO: for performance reasons, can this be moved outside of useCalendar even though it depends on `props`?
  function reducer(state, action) {
    function reduce(state, action) {

      function handleClickDay() {
        if (props.disableDays(action.payload)) {
          return state;
        }

        if (props.selectionMode === 'single' || props.selectionMode === 'multiple') {
          const isSelected = state.value.some(day => isSame(day, action.payload));
          // deselect date
          if (isSelected) {
            return {...state, value: [...state.value.filter(day => !isSame(day, action.payload))]}
          }

          if (props.selectionMode === 'single') {
            return {...state, value: [action.payload]};
          } else if (props.selectionMode === 'multiple') {
            return isSelected ? state : {...state, value: [...state.value, action.payload]}
          } else {
            return state;
          }
        } else if (props.selectionMode === 'range') {
          // selectDays might be [ <Date> ] (only start date selected)
          // or [ [<Date>, <Date>] ] when start & end selected
          const [value] = state.value;
          const [start, end] = Array.isArray(value) ? value : [value, undefined];

          if (!start) {
            return {...state, value: [action.payload]};
          } else if (start && !end && isBefore(start, action.payload)) {
            return {...state, value: createDateRange(start, action.payload)};
          } else {
            return {...state, value: [action.payload]};
          }
        } else {
          return state;
        }
      }

      switch (action.type) {
        case actions.ACTION_CLICK_DAY:
          return handleClickDay();

        case actions.ACTION_CLICK_PREV_MONTH: {
          const [year, month] = (props.isRTL ? getNextMonth : getPreviousMonth)(state.view.year, state.view.month);
          return {...state, view: {year, month}};
        }

        case actions.ACTION_CLICK_NEXT_MONTH: {
          const [year, month] = (props.isRTL ? getPreviousMonth : getNextMonth)(state.view.year, state.view.month);
          return {...state, view: {year, month}};
        }

        case actions.CHANGE_VALUE:
          return {...state, value: action.payload};

        case actions.MOUSE_ENTER_DAY:
          return {...state, mouseOverDay: action.payload};

        case actions.MOUSE_LEAVE_DAY:
          return {...state, mouseOverDay: null};

        case actions.CHANGE_VIEW:
          return {...state, view: action.payload};

        default:
          return state;
      }
    }

    const nextState = reduce(state, action);
    const stateOverride = props.stateReducer ? props.stateReducer(state, nextState, action) : nextState;

    // merge states
    return Object.assign({}, nextState, stateOverride);
  }

  const theInitialState = props.initialState ? props.initialState : getInitialState(props);
  const [state, dispatch] = useReducer(reducer, theInitialState);

  useEffect(() => {
    if (props.onViewChange && state.view !== props.view) {
      props.onViewChange(state.view);
    }
  }, [state.view]);

  useWatchChanges(() => {
    props.onChange(state.value);
  }, [state.value]);

  const goNextMonth = () => dispatch({type: actions.ACTION_CLICK_NEXT_MONTH});

  const goPreviousMonth = () => dispatch({type: actions.ACTION_CLICK_PREV_MONTH});

  const changeView = (toView) => {
    dispatch({type: actions.CHANGE_VIEW, payload: toView});
  }

  const changeValue = (value) => dispatch({type: actions.CHANGE_VALUE, payload: value})

  // TODO: mouseEnterDay & mouseLeaveDay cause component to rerender
  const mouseEnterDay = (date) => dispatch({type: actions.MOUSE_ENTER_DAY, payload: date});

  const mouseLeaveDay = (date) => dispatch({type: actions.MOUSE_LEAVE_DAY, payload: date});

  const clickDay = (date) => dispatch({type: actions.ACTION_CLICK_DAY, payload: date});

  return {
    // user passed props
    settings,

    // calendar state
    state,

    // support dispatching custom actions
    dispatch,

    actions: {
      goNextMonth,
      goPreviousMonth,
      changeView,
      changeValue,
      mouseEnterDay,
      mouseLeaveDay,
      clickDay
    }
  };
}

export const getStartDate = (value) => {
  if (!value || value.length === 0) {
    return new Date();
  }

  const [obj] = value;

  return Array.isArray(obj) ? obj[0] : obj;
};

export const getViewDate = (value) => {
  return {year: getStartDate(value).getFullYear(), month: getStartDate(value).getMonth() + 1}
};

export const getInitialState = (props) => {
  const initialValue = props.value || initialState.value;
  return {
    ...initialState,
    value: initialValue,
    view: props.view ? props.view : getViewDate(initialValue),
  }
}
