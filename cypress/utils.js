import {encodeProps} from "../ui/withInjectPropsFromURL/propsSerializer";


export const defaultProps = {
  locale: 'en-US',
  weekday: 'narrow',
  isRTL: false,
  withOutsideDays: true,
  // firstDayOfWeek: WEEKDAYS[0], TODO
}

export const getJSON = (element) => {
  try {
    return JSON.parse(element.text());
  } catch (error) {
    return undefined;
  }
};

export const format = (date) => {
  const year = date.getFullYear();
  const month = `${(date.getMonth()+1)}`.padStart(2, '0');
  const day = `${(date.getDate())}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const toPlainObject = (date) => ({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()});

export const tid = (testId) => {
  const identifier = testId instanceof Date ? format(testId) : testId;
  return `[data-test-id="${identifier}"]`;
};

export const render = (componentName, props=defaultProps) => {
  if (props) {
    cy.visit(`/test-subjects/${componentName}?props=${encodeProps(props)}`);
  } else {
    cy.visit(`/test-subjects/${componentName}`);
  }
};

export const toDate = (strDate) => {
  if (typeof strDate === 'string') {
    return new Date(strDate);
  }
  if (Array.isArray(strDate)) {
    return strDate.map(toDate);
  }
};
