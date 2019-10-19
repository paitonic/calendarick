import { fromArray } from '../../../../src/calendar';
import { encodeProps } from '../../../../src/testUtils';

const BASE_URL = 'http://localhost:1234/variations';

const visit = (url, props) => {
  if (props) {
    cy.visit(`${url}?props=${encodeProps(props)}`);
  } else {
    cy.visit(url);
  }
};

const defaultProps = {
  calendar: {
    locale: 'en-US',
    weekDay: 'narrow',
    isRTL: false,
    withOutsideDays: true
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

describe('InlineDatePicker', () => {
  let today, today_year, today_month, today_day, todayTestId;

  const visitInlineDatePicker = (url=`${BASE_URL}/InlineDatePicker`, props=defaultProps) => visit(`${BASE_URL}/InlineDatePicker`, props);

  beforeEach(() => {
    today = new Date();
    [today_year, today_month, today_day] = [today.getFullYear(), today.getMonth()+1, today.getDate()];
    todayTestId = `[data-testid="${today_year}-${today_month}-${today_day}"]`;
  });

  it('should display current month and year by default', () => {
    visitInlineDatePicker();
    const monthName = today.toLocaleString(defaultProps.calendar.locale, {month: 'long'});
    cy.get(`[data-testid="month-${today_month}"]`).should('have.text', monthName);
    cy.get(`[data-testid="year-${today_year}"]`).should('have.text', String(today_year));
  });

  it('should change the style of the day when mouse is over', () => {
    visitInlineDatePicker();
    // transparent
    cy.get(todayTestId).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(todayTestId).trigger('mouseenter').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });

  it('should select date', () => {
    visitInlineDatePicker();
    cy.get(todayTestId);
    cy.get(todayTestId).should('not.have.class', 'day--is-selected');
    cy.get(todayTestId).click().should('have.class', 'day--is-selected');
  });

  it.skip('should show correct month and year when value props is given', () => {
    const d_2020_01_01 = fromArray([2020, 1, 1]);
    const test_id_2020_01_01 = `[data-testid="${format(d_2020_01_01)}"]`;
    visit(`${BASE_URL}/InlineDatePickerWithValue`, {...defaultProps, value: [ d_2020_01_01 ]});

    cy.get(test_id_2020_01_01).should('have.class', 'day--is-selected');
    cy.get(`[data-testid="month-1"]`).should('have.text', 'January');
    cy.get(`[data-testid="year-2020"]`).should('have.text', '2020');
  });

  it.skip('should not select disabled day', () => {
    visit(`${BASE_URL}/InlineDatePickerWithDisabledDays`);
    const d_2020_01_02 = fromArray([2020, 1, 2]);
    const test_id_2020_01_02 = `[data-testid="${format(d_2020_01_02)}"]`;

    cy.get(test_id_2020_01_02).should('not.have.class', 'day--is-selected');
    cy.get(test_id_2020_01_02).should('have.class', 'day--is-disabled');

    cy.get(test_id_2020_01_02)
      .click()
      .should('not.have.class', 'day--is-selected');
  });

  it.skip('should hide days outside of month', () => {
    visitInlineDatePicker({...defaultProps, withOutsideDays: false});
  });

  it.skip('should navigate month back when clicking on left arrow', () => {});

  it.skip('should navigate month forward when clicking on right arrow', () => {});

  it.skip('should navigate month back when clicking on right arrow (isRTL=true)', () => {});

  it.skip('should navigate month forward when clicking on left arrow (isRTL=true)', () => {});

  it.skip('should reverse order of week day names when isRTL=true (last day of week should be left-most)', () => {});
});

describe('InlineDateRangePicker', function () {
  beforeEach(() => {
    cy.visit(`${BASE_URL}/InlineRangeDatePicker`);
  });

  it.skip('should select range', () => {
    cy.get('[data-testid="2019-09-22"]').click().should('have.class', 'day--is-selected');
    cy.get('[data-testid="2019-09-24"]').click().should('have.class', 'day--is-selected');

    cy.get('[data-testid="2019-09-23"]').should('have.class', 'day--is-selected');
  });
});
