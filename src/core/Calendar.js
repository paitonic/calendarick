import React from "react";
import {Header} from "./Header";
import {Month} from "./Month";
import {StateContext, SettingsContext} from "./context";


export function Calendar(props) {
  const { settings, state, actions } = props;

  return (
    <div className='calendarick'>
      <SettingsContext.Provider value={settings}>
        <StateContext.Provider value={{state, actions}}>
          <Header year={state.view.year}
                  month={state.view.month}
                  onBackClick={actions.goPreviousMonth}
                  onNextClick={actions.goNextMonth}/>

          <Month year={state.view.year} month={state.view.month}/>
        </StateContext.Provider>
      </SettingsContext.Provider>
    </div>
  )
}
