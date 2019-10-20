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

const visit = (url, props=defaultProps) => {
  if (props) {
    cy.visit(`${url}?props=${encodeProps(props)}`);
  } else {
    cy.visit(url);
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

const tid = (testId) => `[data-testid="${testId}"]`;

describe('InlineDatePicker', () => {
  let today, today_year, today_month, today_day, todayTestId;

  beforeEach(() => {
    today = new Date();
    [today_year, today_month, today_day] = [today.getFullYear(), today.getMonth()+1, today.getDate()];
    todayTestId = tid(`${today_year}-${today_month}-${today_day}`);
  });

  it('should display current month and year by default', () => {
    visit('/InlineDatePicker', defaultProps);
    const monthName = today.toLocaleString(defaultProps.calendar.locale, {month: 'long'});
    cy.get(tid('month-' + today_month)).should('have.text', monthName);
    cy.get(tid('year-' + today_year)).should('have.text', String(today_year));
  });

  it('should change the style of the day when mouse is over', () => {
    visit('/InlineDatePicker', defaultProps);
    // transparent
    cy.get(todayTestId).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(todayTestId).trigger('mouseenter').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });

  it('should not select any day', () => {
    visit('/InlineDatePicker', defaultProps);
    cy.get('.day--is-selected').should('not.exist')
  });

  it('should select date', () => {
    visit('/InlineDatePicker', defaultProps);
    cy.get(todayTestId);
    cy.get(todayTestId).should('not.have.class', 'day--is-selected');
    cy.get(todayTestId).click().should('have.class', 'day--is-selected');
  });

  it.skip('should show correct month and year when value props is given', () => {
    const d_2020_01_01 = fromArray([2020, 1, 1]);
    const test_id_2020_01_01 = tid(format(d_2020_01_01));
    visit('/InlineDatePickerWithValue', {...defaultProps, value: [ d_2020_01_01 ]});

    cy.get(test_id_2020_01_01).should('have.class', 'day--is-selected');
    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');
  });

  it.skip('should not select disabled day', () => {
    visit('/InlineDatePickerWithDisabledDays');
    const d_2020_01_02 = fromArray([2020, 1, 2]);
    const test_id_2020_01_02 = tid(d_2020_01_02);

    cy.get(test_id_2020_01_02).should('not.have.class', 'day--is-selected');
    cy.get(test_id_2020_01_02).should('have.class', 'day--is-disabled');

    cy.get(test_id_2020_01_02)
      .click()
      .should('not.have.class', 'day--is-selected');
  });

  it.skip('should hide days outside of month', () => {
    visit('/InlineDatePickerWithValue', {
      ...defaultProps,
      value: [ [fromArray([2020, 1, 1])] ],
      withOutsideDays: false
    });

    const d_2019_12_31 = fromArray([2019, 12, 31]);
    const tid_2019_12_31 = tid(d_2019_12_31);

    cy.get(tid_2019_12_31).should('not.exist');
  });

  it.skip('should navigate month back when clicking on left arrow', () => {
    visit('/InlineDatePickerWithValue', {...defaultProps, value: [ fromArray([2020, 1, 1]) ]});

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-left')).click();

    cy.get(tid('month-12')).should('have.text', 'December');
    cy.get(tid('year-2019')).should('have.text', '2019');
  });

  it.skip('should navigate month forward when clicking on right arrow', () => {
    visit('/InlineDatePickerWithValue', {...defaultProps, value: [ fromArray([2020, 1, 1]) ]});

    cy.get(tid('month-1')).should('have.text', 'January');
    cy.get(tid('year-2020')).should('have.text', '2020');

    cy.get(tid('button-right')).click();

    cy.get(tid('month-2')).should('have.text', 'February');
    cy.get(tid('year-2020')).should('have.text', '2020');
  });

  it.skip('should navigate month back when clicking on right arrow (isRTL=true)', () => {
    visit('/InlineDatePickerWithValue', {
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
    visit('/InlineDatePickerWithValue', {
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
    visit('/InlineDatePickerWithValue', {
      ...defaultProps,
      value: [fromArray([2020, 1, 1])],
      calendar: {...defaultProps.calendar, isRTL: true}
    });

    cy.get(tid('week-day-1')).should('have.text', 'Sat');
  });
});

describe('InlineDateRangePicker', function () {
  beforeEach(() => {
    visit('/InlineRangeDatePicker');
  });

  it.skip('should select range', () => {
    cy.get('[data-testid="2019-09-22"]').click().should('have.class', 'day--is-selected');
    cy.get('[data-testid="2019-09-24"]').click().should('have.class', 'day--is-selected');

    cy.get('[data-testid="2019-09-23"]').should('have.class', 'day--is-selected');
  });
});
