import {
  getCalendar,
  getMonths,
  getNextMonth,
  getWeekDays,
  groupByWeeks,
  getPreviousMonth,
  isFirstDayOfWeek,
  isLastDayOfWeek, WEEKDAYS
} from '../src/calendar';


export function calendar({
                    locale='en-US',
                    weekday='short',
                    month='long',
                    firstDayOfWeek=WEEKDAYS[0],
                    withOutsideDays=false} = {}
                  ) {
  return {
    getCalendar(...args) {
      return getCalendar(...args, {locale, withOutsideDays, weekday, firstDayOfWeek})
    },

    getMonths() {
      return getMonths({locale, month});
    },

    getNextMonth(...args) {
      return getNextMonth(...args);
    },

    getWeekDays() {
      return getWeekDays({locale, firstDayOfWeek, weekday});
    },

    groupByWeeks(...args) {
      return groupByWeeks(firstDayOfWeek, ...args);
    },

    getPreviousMonth(...args) {
      return getPreviousMonth(...args);
    },

    isFirstDayOfWeek(...args) {
      return isFirstDayOfWeek(firstDayOfWeek, ...args);
    },

    isLastDayOfWeek(...args) {
      return isLastDayOfWeek(firstDayOfWeek, ...args);
    }
  }
}


/*
  calendar = createCalendar('en-US')(() => {});
  calendar.getCalendar();

  withCalendar('en-US')((getCalendar, getMonths, getNextMonth, getWeekDays) => {
    getMonths
  });

  const {getCalendar, getMonths, getNextMonth, getWeekDays} = configureCalendar({'en-US');
 */
// const {getCalendar, getMonths, getNextMonth, getWeekDays} = calendar({locale: 'en-US', firstDayOfWeek: WEEKDAYS[0], withOutsideDays: false});
