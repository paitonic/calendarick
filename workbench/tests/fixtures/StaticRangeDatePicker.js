import React from 'react';

import {Calendarick} from "../../../src/Calendarick";

export const StaticRangeDatePicker = (props) => <Calendarick {...{selectionMode: 'range', ...props}}/>;
