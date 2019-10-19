const BASE_URL = 'http://localhost:1234/variations';

const serializeProps = (props) => {
  return encodeURIComponent(JSON.stringify(props));
};

const visit = (url, props) => {
  if (props) {
    cy.visit(`${url}?props=${serializeProps(props)}`);
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

describe('InlineDatePicker', () => {
  let today, today_year, today_month, today_day, todayTestId;

  const visitInlineDatePicker = (props=defaultProps) => visit(`${BASE_URL}/InlineDatePicker`, props);

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

  // requires to pass a function
  // it('should not select disabled day', () => {
  //
  // });

  it.skip('should hide days outside of month', () => {});

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

  it('should select range', () => {
    cy.get('[data-testid="2019-09-22"]').click().should('have.class', 'day--is-selected');
    cy.get('[data-testid="2019-09-24"]').click().should('have.class', 'day--is-selected');

    cy.get('[data-testid="2019-09-23"]').should('have.class', 'day--is-selected');
  });
});
