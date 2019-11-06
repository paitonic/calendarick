import { fromArray } from '../../../../src/calendar';
import { encodeProps, toDate } from '../../../../src/testUtils';

const defaultProps = {
  calendar: {
    locale: 'en-US',
    weekDay: 'narrow',
    isRTL: false,
    withOutsideDays: true
  }
};

const render = (variationName, props=defaultProps) => {
  if (props) {
    cy.visit(`/${variationName}?props=${encodeProps(props)}`);
  } else {
    cy.visit('/' + variationName);
  }
};

// const defaultProps = {
//   onDayClick: () => {},
//   onChange: () => {},
//   selectionMode: 'single',
//   disableDays: () => {},
//   calendar: {
//     locale: 'en-US',
//     weekday: 'narrow',
//     isRTL: false,
//     withOutsideDays: true,
//   },
//   value: [],
// };

function format(date) {
  const year = date.getFullYear();
  const month = `${(date.getMonth()+1)}`.padStart(2, '0');
  const day = `${(date.getDate())}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const toPlainObject = (date) => ({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()});

const tid = (testId) => {
  const str = testId instanceof Date ? format(testId) : testId;
  return `[data-test-id="${str}"]`;
};

const today = new Date();

const tid_today = tid(today);
const d_01 = fromArray([today.getFullYear(), today.getMonth()+1, 1]);
const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);
const d_04 = fromArray([today.getFullYear(), today.getMonth()+1, 4]);
const d_05 = fromArray([today.getFullYear(), today.getMonth()+1, 5]);
const d_2020_01_01 = fromArray([2020, 1, 1]);

const tid_01 = tid(d_01);
const tid_02 = tid(d_02);
const tid_03 = tid(d_03);
const tid_04 = tid(d_04);
const tid_05 = tid(d_05);

const tid_popup = tid('popup');
const tid_okButton = tid('popup__action--ok');
const tid_cancelButton = tid('popup__action--cancel');
const tid_dateInput = tid('popup__date-input');
const tid_footer = tid('popup__footer');
const tid_debug_pane = tid('debug-pane');

const clickDateInput = () => cy.get(tid_dateInput).click({force: true});
const ok = () => cy.get(tid_okButton).click();
const cancel = () => cy.get(tid_cancelButton).click();
const chooseDay = (day) => cy.get(tid(format(day))).click();
const clickLeftArrow = () => cy.get(tid('button-left')).click();
const clickRightArrow = () => cy.get(tid('button-right')).click();

const assertPopupIsClosed = () => cy.get(tid_popup).should('have.class', 'popup--closed');
const assertPopupIsOpen = () => cy.get(tid_popup).should('not.have.class', 'popup--closed');
const assertInputIsEmpty = () => cy.get(tid_dateInput).should('have.value', '');
const assertInputIs = (value) => cy.get(tid_dateInput).should('have.value', value);
const assertDayIs = (expectation, value, ...days) => {
  days.forEach((day) => {
    cy.get(tid(format(day))).should(expectation, value);
  });
};
const assertDayIsChosen = (...days) => assertDayIs('have.class', 'day--is-selected', ...days);
const assertDayIsNotChosen = (...days) => assertDayIs('not.have.class', 'day--is-selected', ...days);
const assertDayIsDisabled = (...days) => assertDayIs('have.class', 'day--is-disabled', ...days);
const assertMonthIs = (monthNumber) => cy.get(tid('month-' + String(monthNumber).padStart(2, '0')));
const assertYearIs = (year) => cy.get(tid('year-' + year)).should('have.text', String(year));
const assertDayDoesNotExist = (...days) => assertDayIs('not.exist', null, ...days);

const getJSON = (element) => {
  try {
    return JSON.parse(element.text());
  } catch (error) {
    return undefined;
  }
};

// TODO: make function that accepts a value and compares it to the value in the debug pane

describe('StaticDatePicker', () => {
  const {year: today_year, month: today_month} = toPlainObject(today);

  it('should display current month and year by default', () => {
    render('StaticDatePicker', defaultProps);
    const monthName = today.toLocaleString(defaultProps.calendar.locale, {month: 'long'});
    cy.get(tid('month-' + String(today_month).padStart(2, '0'))).should('have.text', monthName);
    cy.get(tid('year-' + today_year)).should('have.text', String(today_year));
  });

  it('should change the style of the day when mouse is over', () => {
    render('StaticDatePicker', defaultProps);
    // transparent
    cy.get(tid_today).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(tid_today).trigger('mouseenter').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });

  it('should no be selected days', () => {
    render('StaticDatePicker', defaultProps);
    cy.get('.day--is-selected').should('not.exist')
  });

  it('should select date', () => {
    render('StaticDatePicker', defaultProps);
    cy.get(tid_today);
    cy.get(tid_today).should('not.have.class', 'day--is-selected');
    cy.get(tid_today).click().should('have.class', 'day--is-selected');
  });

  it('should show initially selected day', () => {
    const d_2020_01_01 = fromArray([2020, 1, 1]);
    render('StaticDatePicker', {...defaultProps, value: [ d_2020_01_01 ]});

    assertDayIsChosen(d_2020_01_01);
    assertMonthIs(1).should('have.text', 'January');
    assertYearIs(2020);
  });

  it('should not select disabled day', () => {
    render('StaticDatePickerWithDisabledDays');

    assertDayIsNotChosen(d_02);
    assertDayIsDisabled(d_02);

    chooseDay(d_02);
    assertDayIsNotChosen(d_02);

    cy.get(tid_debug_pane).should((element) => {
      const value = toDate(getJSON(element));
      expect(value.length !== 0).to.eq(true);

      const [ date ] = value;
      expect(format(date)).to.eql(format(d_01));
    });
  });

  it('should hide days outside of month', () => {
    render('StaticDatePicker', {
      ...defaultProps,
      value: [ fromArray([2020, 1, 1]) ],
      calendar: {
        withOutsideDays: false
      }
    });

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
    render('StaticDatePicker', {...defaultProps, value: [ d_2020_01_01 ]});

    assertMonthIs(1);
    assertYearIs(2020);

    clickLeftArrow();

    assertMonthIs(12);
    assertYearIs(2019);
  });

  it('should navigate month forward when clicking on right arrow', () => {
    render('StaticDatePicker', {...defaultProps, value: [ d_2020_01_01 ]});

    assertMonthIs(1);
    assertYearIs(2020);

    clickRightArrow();

    assertMonthIs(2);
    assertYearIs(2020);
  });

  it('should navigate month back when clicking on right arrow (isRTL=true)', () => {
    render('StaticDatePicker', {
      ...defaultProps,
      value: [ d_2020_01_01 ],
      calendar: {...defaultProps.calendar, isRTL: true,}
    });

    assertMonthIs(1);
    assertYearIs(2020);

    clickRightArrow();

    assertMonthIs(12);
    assertYearIs(2019);
  });

  it('should navigate month forward when clicking on left arrow (isRTL=true)', () => {
    render('StaticDatePicker', {
      ...defaultProps,
      value: [ d_2020_01_01 ],
      calendar: {...defaultProps.calendar, isRTL: true}
    });

    assertMonthIs(1);
    assertYearIs(2020);

    clickLeftArrow();

    assertMonthIs(2);
    assertYearIs(2020);
  });

  it('should order of week day names properly (Saturday-last)', () => {
    render('StaticDatePicker', {
      ...defaultProps,
      value: [ d_01 ],
      calendar: {...defaultProps.calendar, isRTL: false}
    });

    cy.get(tid('week-day-7')).should('have.text', 'Sat');
  });

  it('should reverse order of week day names when isRTL=true (last day of week should be left-most)', () => {
    render('StaticDatePicker', {
      ...defaultProps,
      value: [ d_01 ],
      calendar: {...defaultProps.calendar, isRTL: true}
    });

    cy.get(tid('week-day-1')).should('have.text', 'Sat');
  });
});

describe('StaticDateRangePicker', () => {
  it('should select range', () => {
    render('StaticRangeDatePicker');
    cy.get(tid_01).should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
    cy.get(tid_03).should('not.have.class', 'day--is-selected');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should show initially selected range', () => {
    render('StaticRangeDatePicker', {
      ...defaultProps,
      value: [ [d_01, d_03] ]
    });

    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
    cy.get(tid_03).should('have.class', 'day--is-selected');
  });

  it('should change initially selected range', () => {
    render('StaticRangeDatePicker', {
      ...defaultProps,
      value: [ [d_01, d_03] ]
    });

    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_05).click().should('have.class', 'day--is-selected');

    cy.get(tid_04).should('have.class', 'day--is-selected');

    cy.get(tid_01).should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should not select disabled day', () => {
    render('StaticRangeDatePickerWithDisabledDays');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should allow selecting range if there are disabled days in between', () => {
    render('StaticRangeDatePickerWithDisabledDays');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_04).click().should('have.class', 'day--is-selected');
  });

  it('should allow selecting late date before early date (e.g first 2020-01-03, then 2020-01-01)', () => {
    render('StaticRangeDatePicker');

    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should select range of one day', () => {
    render('StaticRangeDatePicker');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');

    cy.get(tid_01).should('not.have.class', 'day--is-selected');
  });
});

describe('StaticMultiSelectDatePicker', () => {
  it('should select multiple days', () => {
    render('StaticMultiSelectDatePicker');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should not select disable day', () => {
    render('StaticMultiSelectDatePickerWithDisabledDays');

    cy.get(tid_02).should('have.class', 'day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');

    cy.get(tid_02).click().should('have.class', 'day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should show multiple initially selected days', () => {
    render('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should deselect day', () => {
    render('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_01).click().should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should change selected days', () => {
    render('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });
});

describe('DatePicker', () => {
  it('should render popup closed on start', () => {
    render('DatePicker');

    assertPopupIsClosed();
  });

  it('should render input empty on start', () => {
    render('DatePicker');

    assertInputIsEmpty();
  });

  it('should open popup', () => {
    render('DatePicker');

    clickDateInput();
    assertPopupIsOpen();
  });

  it('should close popup when clicking on cancel button', () => {
    render('DatePicker');

    clickDateInput();
    assertPopupIsOpen();
    cancel();
    assertPopupIsClosed();
  });

  it('should select date, close popup and show the date in the input field', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: true});

    clickDateInput();
    chooseDay(d_01);

    assertPopupIsClosed();
    assertInputIs(format(d_01));
  });

  it('should select date and save changes when OK is clicked', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    assertPopupIsOpen();

    ok();
    assertPopupIsClosed();
    assertInputIs(format(d_01));
  });

  it('should overwrite previous date', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    ok();

    clickDateInput();
    chooseDay(d_02);
    ok();

    assertPopupIsClosed();
    assertInputIs(format(d_02));
  });

  it('should cancel selection', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);

    cancel();
    assertPopupIsClosed();
    assertInputIsEmpty();
  });

  it('should revert to previous date on cancel', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    ok();

    clickDateInput();
    chooseDay(d_02);
    cancel();

    assertPopupIsClosed();
    assertInputIs(format(d_01));
  });

  it('should render footer', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: false});

    clickDateInput();
    cy.get(tid_footer);
  });

  it('should hide footer', () => {
    render('DatePicker', {...defaultProps, isAutoClosed: true});

    clickDateInput();
    cy.get(tid_footer).should('not.exist');
  });

  it('should exit popup on click away', () => {
    render('DatePicker');

    clickDateInput();
    cy.get('body').click({force: true});

    assertPopupIsClosed();
  });

  it('should extract date from debug pane', () => {
    render('DatePicker', {...defaultProps, value: [ today ]});

    cy.get(tid_debug_pane).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(today));
    });
  });

  it('should call onChange callback', () => {
    render('DatePicker', {...defaultProps, value: [ d_01 ]});

    cy.get(tid_debug_pane).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(d_01));
    });

    clickDateInput();
    chooseDay(d_02);
    ok();

    cy.get(tid_debug_pane).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(d_02));
    });
  });
});

describe('DateRangePicker:', () => {
  it('should select range of dates', () => {
    render('DateRangePicker', {...defaultProps, selectionMode: 'range'});

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    assertDayIsChosen(d_02, d_03, d_04);
    assertDayIsNotChosen(d_01, d_05);

    ok();
    assertInputIs(`${format(d_02)} - ${format(d_04)}`);

    // assertDebugValueIs([ [d_02, d_04] ]); ?
    cy.get(tid_debug_pane).should((element) => {
      const value = toDate(getJSON(element));
      expect(value.length !== 0).to.eq(true);

      const [ [start, end] ] = value;
      expect(format(start)).to.eql(format(d_02));
      expect(format(end)).to.eql(format(d_04));
    });
  });

  it('should cancel selection of date range', () => {
    render('DateRangePicker', {...defaultProps, selectionMode: 'range'});

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    cancel();
    assertInputIsEmpty();

    // assertDebugValueIsEmpty?
    cy.get(tid_debug_pane).should((element) => {
      const value = getJSON(element);
      expect(value).to.eq(undefined);
    });
  });
});

describe('DateMultiPicker', () => {
  it('should select multiple dates', () => {
    render('DateMultiPicker', {...defaultProps, selectionMode: 'multiple'});
    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    assertDayIsChosen(d_02, d_04);
    assertDayIsNotChosen(d_01, d_03, d_05);

    ok();
    assertInputIs(`${format(d_02)}, ${format(d_04)}`);
    cy.get(tid_debug_pane).should((element) => {
      const value = toDate(getJSON(element));
      expect(value.length !== 0).to.eq(true);

      const [ chosen_d_02, chosen_d_04 ] = value;
      expect(format(chosen_d_02)).to.eql(format(d_02));
      expect(format(chosen_d_04)).to.eql(format(d_04));
    });
  });

  it('should cancel selection of multiple dates', () => {
    render('DateMultiPicker', {...defaultProps, selectionMode: 'multiple'});

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    cancel();
    assertInputIsEmpty();

    cy.get(tid_debug_pane).should((element) => {
      const value = getJSON(element);
      expect(value).to.eq(undefined);
    });
  });
});
