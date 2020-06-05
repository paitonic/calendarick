import React from "react";

import {fromArray, isSame} from "../../src/core/calendar";
import {render, defaultProps, format, getJSON, tid, toPlainObject} from "../utils";
import {
  d_01,
  d_02,
  d_03,
  d_04,
  d_05,
  d_2020_01_01,
  tid_01,
  tid_02,
  tid_03,
  tid_04,
  tid_05,
  tid_test_output,
  tid_today,
  today
} from "../constants";
import {
  assertDayDoesNotExist,
  assertDayIsChosen,
  assertDayIsDisabled,
  assertDayIsNotChosen, assertDayIsNotHighlighted,
  assertMonthIs,
  assertYearIs
} from "../assertions";
import {chooseDay, clickLeftArrow, clickRightArrow, mouseOver} from "../actions";
import {StaticDatePickerWithViewProgrammaticallyChanged} from "../test-subjects/StaticDatePickerWithViewProgrammaticallyChanged";
import {StaticDatePickerWithDisabledDays} from "../test-subjects/StaticDatePickerWithDisabledDays";
import {StaticDatePicker} from "../test-subjects/StaticDatePicker";

describe('StaticDatePicker', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'single',
  };
  const {year: today_year, month: today_month} = toPlainObject(today);

  it('should display current month and year by default', () => {
    render(StaticDatePicker.name, props);

    const monthName = today.toLocaleString(props.locale, {month: 'long'});
    cy.get(tid('month-' + String(today_month).padStart(2, '0'))).should('have.text', monthName);
    cy.get(tid('year-' + today_year)).should('have.text', String(today_year));
  });

  it('should change the style of the day when mouse is over', () => {
    render(StaticDatePicker.name, props);
    // transparent
    cy.get(tid_today).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(tid_today).trigger('mouseenter').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });

  it('should no be selected days', () => {
    render(StaticDatePicker.name, props);
    cy.get('.calendarick-day--is-selected').should('not.exist')
  });

  it('should select date', () => {
    render(StaticDatePicker.name, props);
    cy.get(tid_today);
    cy.get(tid_today).should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_today).click().should('have.class', 'calendarick-day--is-selected');
  });

  it('should show initially selected day', () => {
    const d_2020_01_01 = fromArray([2020, 1, 1]);
    render(StaticDatePicker.name, {...props, value: [d_2020_01_01]});

    assertDayIsChosen(d_2020_01_01);
    assertMonthIs(1).should('have.text', 'January');
    assertYearIs(2020);
  });

  it('should not select disabled day', () => {
    render(StaticDatePickerWithDisabledDays.name, {...props, value: [ d_01 ]});

    assertDayIsNotChosen(d_02);
    assertDayIsDisabled(d_02);

    chooseDay(d_02);
    assertDayIsNotChosen(d_02);

    cy.get(tid_test_output).should((element) => {
      const value = new Date(getJSON(element));
      expect(format(value)).to.eql(format(d_01));
    });
  });

  it('should hide days outside of month', () => {
    render(StaticDatePicker.name, {...props, value: [fromArray([2020, 1, 1])], withOutsideDays: false});

    assertYearIs(2020);
    assertMonthIs(1);

    assertDayDoesNotExist(
      fromArray([2019, 12, 31]),
      fromArray([2019, 12, 30]),
      fromArray([2019, 12, 29]),
      fromArray([2020, 2, 1])
    );
  });

  it('should navigate month back when clicking on left arrow', () => {
    render(StaticDatePicker.name, {...props, value: [d_2020_01_01]});

    assertMonthIs(1);
    assertYearIs(2020);

    clickLeftArrow();

    assertMonthIs(12);
    assertYearIs(2019);
  });

  it('should navigate month forward when clicking on right arrow', () => {
    render(StaticDatePicker.name, {...props, value: [d_2020_01_01]});

    assertMonthIs(1);
    assertYearIs(2020);

    clickRightArrow();

    assertMonthIs(2);
    assertYearIs(2020);
  });

  it('should navigate month back when clicking on right arrow (isRTL=true)', () => {
    render(StaticDatePicker.name, {...props, value: [d_2020_01_01], isRTL: true});

    assertMonthIs(1);
    assertYearIs(2020);

    clickRightArrow();

    assertMonthIs(12);
    assertYearIs(2019);
  });

  it('should navigate month forward when clicking on left arrow (isRTL=true)', () => {
    render(StaticDatePicker.name, {...props, value: [d_2020_01_01], isRTL: true});

    assertMonthIs(1);
    assertYearIs(2020);

    clickLeftArrow();

    assertMonthIs(2);
    assertYearIs(2020);
  });

  it('should order of week day names properly (Saturday-last)', () => {
    render(StaticDatePicker.name, {...props, value: [d_01], isRTL: false, weekday: 'short'});

    cy.get(tid('week-day-7')).should('have.text', 'Sat');
  });

  it('should reverse order of week day names when isRTL=true (last day of week should be left-most)', () => {
    render(StaticDatePicker.name, {...props, value: [d_01], isRTL: true, weekday: 'short'});

    cy.get(tid('week-day-1')).should('have.text', 'Sat');
  });

  it('should order week from left to right when isRTL=false', () => {
    render(StaticDatePicker.name, {
      ...props,
      value: [d_2020_01_01],
      isRTL: false,
      locale: 'en-US',
      weekday: 'narrow'
    });

    // top most element - Sunday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(1)${tid('2019-12-29')}`);

    // Monday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(2)${tid('2019-12-30')}`);

    // Tuesday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(3)${tid('2019-12-31')}`);

    // Wednesday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(4)${tid('2020-01-01')}`);

    // Thursday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(5)${tid('2020-01-02')}`);

    // Friday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(6)${tid('2020-01-03')}`);

    // bottom most element - Saturday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(7)${tid('2020-01-04')}`);
  });

  it('should order week from right to left when isRTL=true', () => {
    render(
      StaticDatePicker.name, {
      ...props,
        value: [d_2020_01_01],
        isRTL: true,
        locale: 'he',
        weekday: 'narrow'
    });

    // check that every test-id is located at correct position (nth-child(N)) in the DOM
    // top most element - Saturday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(1)${tid('2020-01-04')}`);

    // Friday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(2)${tid('2020-01-03')}`);

    // Thursday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(3)${tid('2020-01-02')}`);

    // Wednesday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(4)${tid('2020-01-01')}`);

    // Tuesday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(5)${tid('2019-12-31')}`);

    // Monday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(6)${tid('2019-12-30')}`);

    // bottom most element - Sunday
    cy.get(`.calendarick-weekday-list + .calendarick-week .calendarick-day:nth-child(7)${tid('2019-12-29')}`);
  });

  it('should have today\'s day marked', () => {
    render(StaticDatePicker.name, props);
    cy.get(tid_today).should('have.class', 'calendarick-day--is-today');
  });

  it('should not have selection trail after selecting date', () => {
    render(StaticDatePicker.name, props);

    chooseDay(d_02);
    mouseOver(d_05);

    assertDayIsNotHighlighted(d_03, d_04);
  });

  it('should allow changing month & year programmatically', () => {
    render(StaticDatePickerWithViewProgrammaticallyChanged.name, {...props, view: {month: 1, year: 2019}});

    assertMonthIs(1);
    assertYearIs(2019);

    cy.get(tid('button-2020-02')).click();
    assertMonthIs(2);
    assertYearIs(2020);

    cy.get(tid('button-2021-03')).click();
    assertMonthIs(3);
    assertYearIs(2021);
  });

  it('should update view when navigating back', () => {
    render(StaticDatePickerWithViewProgrammaticallyChanged.name, {...props, view: {month: 1, year: 2020}});

    assertMonthIs(1);
    assertYearIs(2020);
    cy.get(tid_test_output).should((element) => {
      const view = getJSON(element);
      expect(view.month).to.eql(1);
      expect(view.year).to.eql(2020);
    });

    clickLeftArrow();
    assertMonthIs(12);
    assertYearIs(2019);

    cy.get(tid_test_output).should((element) => {
      const view = getJSON(element);
      expect(view.month).to.eql(12);
      expect(view.year).to.eql(2019);
    });
  });

  it('should update view when navigating forward', () => {
    render(StaticDatePickerWithViewProgrammaticallyChanged.name, {...props, view: {month: 1, year: 2020}});

    assertMonthIs(1);
    assertYearIs(2020);
    cy.get(tid_test_output).should((element) => {
      const view = getJSON(element);
      expect(view.month).to.eql(1);
      expect(view.year).to.eql(2020);
    });

    clickRightArrow();
    assertMonthIs(2);
    assertYearIs(2020);

    cy.get(tid_test_output).should((element) => {
      const view = getJSON(element);
      expect(view.month).to.eql(2);
      expect(view.year).to.eql(2020);
    });

  });
});

describe('StaticDatePicker - Range', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'range'
  };

  it('should select range', () => {
    render(StaticDatePicker.name, props);
    cy.get(tid_01).should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).should('not.have.class', 'calendarick-day--is-selected');

    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).click().should('have.class', 'calendarick-day--is-selected');

    cy.get(tid_02).should('have.class', 'calendarick-day--is-selected');
  });

  it('should show initially selected range', () => {
    render(StaticDatePicker.name, {...props, value: [[d_01, d_03]]});

    cy.get(tid_01).should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).should('have.class', 'calendarick-day--is-selected');
  });

  it('should change initially selected range', () => {
    render(StaticDatePicker.name, {...props, value: [[d_01, d_03]]});

    cy.get(tid_03).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_05).click().should('have.class', 'calendarick-day--is-selected');

    cy.get(tid_04).should('have.class', 'calendarick-day--is-selected');

    cy.get(tid_01).should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');
  });

  it('should not select disabled day', () => {
    render(StaticDatePickerWithDisabledDays.name, props);

    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).click().should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');
  });

  it('should allow selecting range if there are disabled days in between', () => {
    render(StaticDatePickerWithDisabledDays.name, props);

    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_04).click().should('have.class', 'calendarick-day--is-selected');
  });

  it('should reset range selection if late date selected before early date (e.g first 2020-01-03, then 2020-01-01)', () => {
    render(StaticDatePicker.name, props);

    chooseDay(d_03);
    chooseDay(d_01);
    assertDayIsNotChosen(d_02, d_03);

    chooseDay(d_03);
    assertDayIsChosen(d_02, d_03);
  });

  it('should select range of one day', () => {
    render(StaticDatePicker.name, props);

    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');

    cy.get(tid_02).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).click().should('have.class', 'calendarick-day--is-selected');

    cy.get(tid_01).should('not.have.class', 'calendarick-day--is-selected');
  });
});

describe('StaticDatePicker - Multi-Selection', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'multiple'
  };

  it('should select multiple days', () => {
    render(StaticDatePicker.name, props);

    cy.get(tid_01).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_03).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');
  });

  it('should not select disable day', () => {
    render(StaticDatePickerWithDisabledDays.name, props);

    cy.get(tid_02).should('have.class', 'calendarick-day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');

    cy.get(tid_02).click().should('have.class', 'calendarick-day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'calendarick-day--is-selected');
  });

  it('should show multiple initially selected days', () => {
    render(StaticDatePicker.name, {...props, value: [d_01, d_02]});

    cy.get(tid_01).should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('have.class', 'calendarick-day--is-selected');
  });

  it('should deselect day', () => {
    render(StaticDatePicker.name, {...props, value: [d_01, d_02]});

    cy.get(tid_01).click().should('not.have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('have.class', 'calendarick-day--is-selected');
  });

  it('should change selected days', () => {
    render(StaticDatePicker.name, {...props, value: [d_01, d_02]});

    cy.get(tid_03).click().should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_01).should('have.class', 'calendarick-day--is-selected');
    cy.get(tid_02).should('have.class', 'calendarick-day--is-selected');
  });
});
