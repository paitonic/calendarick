import React from 'react';
import {Calendarick} from "../../../src/Calendarick";


export const StaticDatePicker = (props) => <Calendarick {...{selectionMode: 'single', ...props}}/>;
