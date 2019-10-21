import { fromArray } from '../../../../src/calendar';
import { encodeProps } from '../../../../src/testUtils';

const defaultProps = {
  calendar: {
    locale: 'en-US',
    weekDay: 'narrow',
    isRTL: false,
    withOutsideDays: true
  }
};

const open = (variationName, props=defaultProps) => {
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

const tid = (testId) => {
  const str = testId instanceof Date ? format(testId) : testId;
  return `[data-testid="${str}"]`;
};

const today = new Date();

const d_01 = fromArray([today.getFullYear(), today.getMonth()+1, 1]);
const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);
const d_04 = fromArray([today.getFullYear(), today.getMonth()+1, 4]);
const d_05 = fromArray([today.getFullYear(), today.getMonth()+1, 5]);

const tid_01 = tid(d_01);
const tid_02 = tid(d_02);
const tid_03 = tid(d_03);
const tid_04 = tid(d_04);
const tid_05 = tid(d_05);

describe('StaticDatePicker', () => {
  let today, today_year, today_month, today_day, todayTestId;

  beforeEach(() => {
    today = new Date();
    [today_year, today_month, today_day] = [today.getFullYear(), today.getMonth()+1, today.getDate()];
    todayTestId = tid(`${today_year}-${today_month}-${today_day}`);
  });

  it('should display current month and year by default', () => {
    open('StaticDatePicker', defaultProps);
    const monthName = today.toLocaleString(defaultProps.calendar.locale, {month: 'long'});
    cy.get(tid('month-' + today_month)).should('have.text', monthName);
    cy.get(tid('year-' + today_year)).should('have.text', String(today_year));
  });

  it('should change the style of the day when mouse is over', () => {
    open('StaticDatePicker', defaultProps);
    // transparent
    cy.get(todayTestId).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(todayTestId).trigger('mouseenter').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });

  it('should no be selected days', () => {
    open('StaticDatePicker', defaultProps);
    cy.get('.day--is-selected').should('not.exist')
  });

  it('should select date', () => {
    open('StaticDatePicker', defaultProps);
    cy.get(todayTestId);
    cy.get(todayTestId).should('not.have.class', 'day--is-selected');
    cy.get(todayTestId).click().should('have.class', 'day--is-selected');
  });

  it.skip('should show initially selected day', () => {
    const d_2020_01_01 = fromArray([2020, 1, 1]);
    const test_id_2020_01_01 = tid(format(d_2020_01_01));
    open('StaticDatePicker', {...defaultProps, value: [ d_2020_01_01 ]});

    cy.get(test_id_2020_01_01).should('have.class', 'day--is-selected');
    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');
  });

  it.skip('should not select disabled day', () => {
    open('StaticDatePickerWithDisabledDays');
    const d_2020_01_02 = fromArray([2020, 1, 2]);
    const test_id_2020_01_02 = tid(d_2020_01_02);

    cy.get(test_id_2020_01_02).should('not.have.class', 'day--is-selected');
    cy.get(test_id_2020_01_02).should('have.class', 'day--is-disabled');

    cy.get(test_id_2020_01_02)
      .click()
      .should('not.have.class', 'day--is-selected');
  });

  it.skip('should hide days outside of month', () => {
    open('StaticDatePicker', {
      ...defaultProps,
      value: [ [fromArray([2020, 1, 1])] ],
      withOutsideDays: false
    });

    const d_2019_12_31 = fromArray([2019, 12, 31]);
    const tid_2019_12_31 = tid(d_2019_12_31);

    cy.get(tid_2019_12_31).should('not.exist');
  });

  it.skip('should navigate month back when clicking on left arrow', () => {
    open('StaticDatePicker', {...defaultProps, value: [ fromArray([2020, 1, 1]) ]});

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-left')).click();

    cy.get(tid('month-12')).should('have.text', 'December');
    cy.get(tid('year-2019')).should('have.text', '2019');
  });

  it.skip('should navigate month forward when clicking on right arrow', () => {
    open('StaticDatePicker', {...defaultProps, value: [ fromArray([2020, 1, 1]) ]});

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-right')).click();

    cy.get(tid('month-2')).should('have.text', 'February');
    cy.get(tid('year-2020')).should('have.text', '2020');
  });

  it.skip('should navigate month back when clicking on right arrow (isRTL=true)', () => {
    open('StaticDatePicker', {
      ...defaultProps,
      value: [ fromArray([2020, 1, 1]) ],
      calendar: {...defaultProps.calendar, isRTL: true,}
    });

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-right')).click();

    cy.get(tid('month-12')).should('have.text', 'December');
    cy.get(tid('year-2019')).should('have.text', '2019');
  });

  it.skip('should navigate month forward when clicking on left arrow (isRTL=true)', () => {
    open('StaticDatePicker', {
      ...defaultProps,
      value: [fromArray([2020, 1, 1])],
      calendar: {...defaultProps.calendar, isRTL: true}
    });

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-left')).click();

    cy.get(tid('month-2')).should('have.text', 'February');
    cy.get(tid('year-2020')).should('have.text', '2020');
  });

  it.skip('should reverse order of week day names when isRTL=true (last day of week should be left-most)', () => {
    open('StaticDatePicker', {
      ...defaultProps,
      value: [fromArray([2020, 1, 1])],
      calendar: {...defaultProps.calendar, isRTL: true}
    });

    cy.get(tid('week-day-1')).should('have.text', 'Sat');
  });
});

describe('StaticDateRangePicker', () => {
  it('should select range', () => {
    open('StaticRangeDatePicker');
    cy.get(tid_01).should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
    cy.get(tid_03).should('not.have.class', 'day--is-selected');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should show initially selected range', () => {
    open('StaticRangeDatePicker', {
      ...defaultProps,
      value: [ [d_01, d_03] ]
    });

    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
    cy.get(tid_03).should('have.class', 'day--is-selected');
  });

  it('should change initially selected range', () => {
    open('StaticRangeDatePicker', {
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
    open('StaticRangeDatePickerWithDisabledDays');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should allow selecting range if there are disabled days in between', () => {
    open('StaticRangeDatePickerWithDisabledDays');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_04).click().should('have.class', 'day--is-selected');
  });

  it('should allow selecting late date before early date (e.g first 2020-01-03, then 2020-01-01)', () => {
    open('StaticRangeDatePicker');

    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should select range of one day', () => {
    open('StaticRangeDatePicker');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).click().should('have.class', 'day--is-selected');

    cy.get(tid_02).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');

    cy.get(tid_01).should('not.have.class', 'day--is-selected');
  });
});

describe('StaticMultiSelectDatePicker', () => {
  it('should select multiple days', () => {
    open('StaticMultiSelectDatePicker');

    cy.get(tid_01).click().should('have.class', 'day--is-selected');
    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should not select disable day', () => {
    open('StaticMultiSelectDatePickerWithDisabledDays');

    cy.get(tid_02).should('have.class', 'day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');

    cy.get(tid_02).click().should('have.class', 'day--is-disabled');
    cy.get(tid_02).should('not.have.class', 'day--is-selected');
  });

  it('should show multiple initially selected days', () => {
    open('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should deselect day', () => {
    open('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_01).click().should('not.have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });

  it('should change selected days', () => {
    open('StaticMultiSelectDatePicker', {...defaultProps, value: [ d_01, d_02 ]});

    cy.get(tid_03).click().should('have.class', 'day--is-selected');
    cy.get(tid_01).should('have.class', 'day--is-selected');
    cy.get(tid_02).should('have.class', 'day--is-selected');
  });
});
