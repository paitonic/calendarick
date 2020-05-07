import React from 'react';

import {Calendarick} from "../../../src/Calendarick";

export const StaticMultiSelectDatePicker = (props) => <Calendarick {...{selectionMode: 'multiple', ...props}}/>;
