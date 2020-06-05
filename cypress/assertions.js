import {tid_dateInput, tid_dialog} from "./constants";
import {format, tid} from "./utils";

export const assertDialogIsClosed = () =>
  cy.get(tid_dialog).should('have.class', 'calendarick-dialog--closed');

export const assertDialogIsOpen = () =>
  cy.get(tid_dialog).should('not.have.class', 'calendarick-dialog--closed');

export const assertInputIsEmpty = () =>
  cy.get(tid_dateInput).should('have.value', '');

export const assertInputIs = (value) =>
  cy.get(tid_dateInput).should('have.value', value);

export const assertDayIs = (expectation, expectationResult, ...days) => {
  days.forEach((day) => {
    cy.get(tid(format(day))).should(expectation, expectationResult);
  });
};
export const assertDayIsChosen = (...days) =>
  assertDayIs('have.class', 'calendarick-day--is-selected', ...days);

export const assertDayIsNotChosen = (...days) =>
  assertDayIs('not.have.class', 'calendarick-day--is-selected', ...days);

export const assertDayIsDisabled = (...days) =>
  assertDayIs('have.class', 'calendarick-day--is-disabled', ...days);

export const assertMonthIs = (monthNumber) =>
  cy.get(tid('month-' + String(monthNumber).padStart(2, '0')));

export const assertYearIs = (year) =>
  cy.get(tid('year-' + year)).should('have.text', String(year));

export const assertDayDoesNotExist = (...days) =>
  assertDayIs('not.exist', null, ...days);

export const assertDayIsHighlighted = (...days) =>
  assertDayIs('have.class', 'calendarick-day--is-highlighted', ...days);

export const assertDayIsNotHighlighted = (...days) =>
  assertDayIs('not.have.class', 'calendarick-day--is-highlighted', ...days);
