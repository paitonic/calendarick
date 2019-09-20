import {
  getCalendar,
  getMonths,
  getNextMonth,
  getWeekDays,
  groupByWeeks,
  getPreviousMonth,
  isFirstDayOfWeek,
  isLastDayOfWeek,
  WEEKDAYS,
  isOutsideMonth
} from '../src/calendar';
import { isSame } from './calendar';


export function calendar({
                    locale='en-US',
                    weekday='short',
                    month='long',
                    firstDayOfWeek=WEEKDAYS[0],
                    withOutsideDays=false,
                    isRTL=false
                    } = {}
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
      return getWeekDays({locale, firstDayOfWeek, weekday, isRTL});
    },

    groupByWeeks(days, {fillMissingDaysWithNull = false} = {}) {
      return groupByWeeks(firstDayOfWeek, days, {isRTL, fillMissingDaysWithNull});
    },

    getPreviousMonth(...args) {
      return getPreviousMonth(...args);
    },

    isFirstDayOfWeek(...args) {
      return isFirstDayOfWeek(firstDayOfWeek, ...args);
    },

    isLastDayOfWeek(...args) {
      return isLastDayOfWeek(firstDayOfWeek, ...args, {isRTL});
    },

    isOutsideMonth(month, date) {
      return isOutsideMonth(month, date);
    },

    isSame(...args) {
      return isSame(...args);
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
