// TODO: replace Int.DateFormat with toLocaleString?

const DAY_IN_MS = 60 * 60 * 24 * 1000; // 86,400,000 ms

export function countDaysInMonth(year, month) {
    // 0 in day returns total days in a previous month
    // month are zero-based.
    return new Date(year, month, 0).getDate();
}

export function getNextMonth(year, month) {
  if (month + 1 > 12) {
    return [year + 1, 1];
  } else {
    return [year, month + 1];
  }
}

export function getPreviousMonth(year, month) {
  if (month - 1 === 0) {
    return [year - 1, 12];
  } else {
    return [year, month - 1];
  }
}

export function getWeekDayIndex(firstDayOfWeek, weekDay) {
  const ordered = orderWeekDays(firstDayOfWeek);
  return ordered.findIndex(day => day.getDay() === weekDay.getDay())
}

export function isFirstDayOfWeek(firstDayOfWeek, date) {
  return firstDayOfWeek.getDay() === date.getDay();
}

export function isLastDayOfWeek(firstDayOfWeek, date, {isRTL=false} = {}) {
  const ordered = orderWeekDays(firstDayOfWeek, {isRTL});
  return ordered[isRTL ? 0 : ordered.length-1].getDay() === date.getDay();
}

export const WEEKDAYS = [
  new Date(1970, 0, 4, 0, 0, 0, 0), // 0 - sunday
  new Date(1970, 0, 5, 0, 0, 0, 0), // 1 - monday
  new Date(1970, 0, 6, 0, 0, 0, 0), // 2 - tuesday
  new Date(1970, 0, 7, 0, 0, 0, 0), // 3 - wednesday
  new Date(1970, 0, 8, 0, 0, 0, 0), // 4 - thursday
  new Date(1970, 0, 9, 0, 0, 0, 0), // 5 - friday
  new Date(1970, 0, 10, 0, 0, 0, 0) // 6 - saturday
];

export function getWeekDays({locale = 'en-US', firstDayOfWeek = WEEKDAYS[0], weekday = 'short', isRTL = false} = {}) {
  return orderWeekDays(firstDayOfWeek, {isRTL}).map((date) => {
    return new Intl.DateTimeFormat(locale, {weekday}).format(date);
  });
}

export function rotate(collection, n) {
  const clone = [...collection];

  if (n === 0 ) {
    return clone;
  }

  const [takeFn, insertFn] = n > 0 ?
    [Array.prototype.pop, Array.prototype.unshift] :
    [Array.prototype.shift, Array.prototype.push];

  const count = Math.abs(n);

  function shift(i) {
    if (i === count) {
      return clone;
    }

    const item = takeFn.call(clone);
    insertFn.call(clone, item);

    return shift(i + 1);
  }

  return shift(0);
}

export function take(n, generator, ...rest) {
  const iterator = generator(...rest);

  const values = [];
  let i = 0;

  while (i < n) {
    let iteration = iterator.next();
    values.push(iteration.value);

    if (iteration.done) {
      break;
    }

    i += 1;
  }

  return values;
}


export function getCalendar(year, month, {locale = 'en-US', weekday = 'short', withOutsideDays = false, firstDayOfWeek = WEEKDAYS[0], isRTL = false} = {}) {
    // const daysInMonthCount = countDaysInMonth(year, month);
    // let days = [];
    //
    // for (let i = 1; i <= daysInMonthCount; i += 1) {
    //     days.push(getDayRepresentation(year, month, i));
    // }

    function* calendar(year, month, options = {reverseOrder: false}) {
      const dec = (value) => value - 1;
      const inc = (value) => value + 1;

      const daysInMonthCount = countDaysInMonth(year, month);
      // iterate from beginning of the month to the end or from the end to the beginning
      let [dayOfMonth, end, next] = options.reverseOrder ?
        [daysInMonthCount, 0, dec] : // iterate in reverse from daysInMonthCount -> 0 (exclusive)
        [1, daysInMonthCount+1, inc];  // iterate 1 -> daysInMonthCount+1 (exclusive);

      while (dayOfMonth !== end) {
        yield new Date(year, month-1, dayOfMonth, 0, 0, 0, 0);
        dayOfMonth = next(dayOfMonth);
      }
    }

    let days = [...calendar(year, month)];

    if (withOutsideDays) {
      if (!isFirstDayOfWeek(firstDayOfWeek, days[0])) {
        const index = getWeekDayIndex(firstDayOfWeek, days[0]);
        const [maybePrevYear, prevMonth] = getPreviousMonth(year, month);
        days = [...take(index, () => calendar(maybePrevYear, prevMonth, {reverseOrder: true})).reverse(), ...days];
      }

      if (!isLastDayOfWeek(firstDayOfWeek, days[days.length-1], {isRTL})) {
        const index = getWeekDayIndex(firstDayOfWeek, days[days.length-1]);
        // week contains 7 days. but we are using zero based indexing. so the Saturday is 6.
        const [maybeNextYear, nextMonth] = getNextMonth(year, month);
        days = [...days, ...take(6 - index, () => calendar(maybeNextYear, nextMonth))];
      }
    }

    // return days.map(date => {
    //   return getDayRepresentation(date, {locale, weekday});
    // });

  return days;
}

const DAYS_IN_WEEK = 7;
export function groupByWeeks(firstDayOfWeek, days, {isRTL = false, fillMissingDaysWithNull = false} = {}) {
  function partition(days, result=[]) {
    if (days.length === 0) {
      return result;
    }

    const end = days.findIndex((day) => isLastDayOfWeek(firstDayOfWeek, day));
    if (end === -1) {
      // add the remaining days.
      result.push(isRTL ? [...days].reverse() : days);
      return result;
    }

    const week = days.slice(0, end+1);

    return partition(days.slice(end+1, days.length), [...result, isRTL ? week.reverse() : week])
  }

  let weeks = partition(days);

  if (fillMissingDaysWithNull) {
    const firstWeek = weeks[0];
    if (firstWeek.length < DAYS_IN_WEEK) {
      const placeholders = new Array(DAYS_IN_WEEK - firstWeek.length).fill(null);
      weeks[0] = isRTL ? [...firstWeek, ...placeholders] : [...placeholders, ...firstWeek];
    }

    const lastWeek = weeks[weeks.length-1];
    if (lastWeek.length < DAYS_IN_WEEK) {
      const placeholders = new Array(DAYS_IN_WEEK - lastWeek.length).fill(null);
      weeks[weeks.length-1] = isRTL ? [...placeholders, ...lastWeek] : [...lastWeek, ...placeholders];
    }
  }

  return weeks;
}


const months = new Array(12).fill(0).map((month, index) => {
  return new Date(1970, index, 1);
});

export function orderWeekDays(firstDayOfWeek, {isRTL = false} = {}) {
  const weekdays = isRTL ? [...WEEKDAYS].reverse() : [...WEEKDAYS];
  const index = weekdays.findIndex(day => day === firstDayOfWeek);
  const rotateCount = isRTL ? (WEEKDAYS.length-1) - index : index * -1;
  return rotate(weekdays, rotateCount);
}

export function getMonths({locale =  'en-US', month = 'long'} = {}) {
  return months.map((monthObj, index) => {
    return {
      order: index + 1,
      month: new Intl.DateTimeFormat(locale, {month: month}).format(monthObj)
    };
  });
}

export function isOutsideMonth(month, date) {
  return month !== date.getMonth()+1;
}

export function isBefore(date, otherDate) {
  return !isSame(date, otherDate) && !isAfter(date, otherDate);
}

export function isAfter(date, otherDate) {
  const [year, month, day] = toArray(date);
  const [yearOther, monthOther, dayOther] = toArray(otherDate);

  if (year > yearOther) {
    return true;
  } else if (year === yearOther && month > monthOther) {
    return true;
  } else if (year === yearOther && month === monthOther && day > dayOther) {
    return true;
  }

  return false;
}

export function compareDates(date, otherDate) {
  if (isBefore(date, otherDate)) {
    return -1;
  } else if (isAfter(date, otherDate)) {
    return 1;
  } else {
    return 0;
  }
}

export function reduceDates(dates, comparisonFn) {
  return dates.reduce((result, date) => {
    if (comparisonFn(date, result)) {
      return date;
    } else {
      return result;
    }
  }, dates[0]);
}

export function minDate(dates) {
  return reduceDates(dates, isBefore);
}

export function maxDate(dates) {
  return reduceDates(dates, isAfter);
}

export function isToday(date) {
  return isSame(date, new Date());
}

export function isBetween(date, start, end, inclusive=false) {
  return isAfter(date, start) && isBefore(date, end) ?
    true :
    inclusive && (isSame(date, start) || isSame(date, end));
}

export function isSame(date, otherDate) {
  return ['getFullYear', 'getMonth', 'getDate'].every((method) => {
    return date[method]() === otherDate[method]();
  });
}

export function toArray(datetime) {
  return datetime instanceof Date ?
    [
      datetime.getFullYear(),
      datetime.getMonth() + 1,
      datetime.getDate(),
      datetime.getHours(),
      datetime.getMinutes(),
      datetime.getSeconds(),
      datetime.getMilliseconds(),
    ] :
    datetime;
}

export function fromArray(datetime) {
  const [year, month, day, hour=0, minute=0, second=0, millisecond=0] = datetime;
  return new Date(year, month-1, day, hour, minute, second, millisecond);
}

export function isIn(date, listOfDates) {
  return listOfDates.some((someDate) => {
    return Array.isArray(someDate) ? isBetween(date, someDate[0], someDate[1], true) : isSame(date, someDate);
  });
}

export function nextDayOf(date) {
  return new Date(date.getTime() + DAY_IN_MS);
}

export function prevDayOf(date) {
  return new Date(date.getTime() - DAY_IN_MS);
}

export function clone(date) {
  if (date instanceof Date) {
    return new Date(date.getTime());
  } else if (Array.isArray(date)) {
    return date.map(clone);
  } else {
    return date;
  }
}
