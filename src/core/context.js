import React from "react";

// TODO: Can propTypes used along with to SettingsContext?
export const SettingsContext = React.createContext({});

export const initialState = {
  /**
   * One day
   * value: [<Date>]
   *
   * Multiple selected days
   * value: [<Date>, <Date>]
   *
   * Range
   * value: [ [<Date>, <Date>] ]
   *
   * Multiple selected dates with range
   * value: [ <Date>, [<Date>, <Date>], <Date> ]
   */
  value: [],
  view: {year: null, month: null},
  mouseOverDay: null,
};
export const StateContext = React.createContext(initialState);
