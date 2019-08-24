// TODO: make DateTimeFormat accept locale as a parameter
// TODO: make DateTimeFormat to accept different options
// TODO: firstDayOfWeek parameter?
// TODO: replace Int.DateFormat with toLocaleString?

export function getDaysInMonth(year, month) {
    // 0 in day returns total days in a previous month
    // month are zero-based.
    return new Date(year, month, 0).getDate();
}

function getWeekDay(year, month, day) {
  return new Date(year, month, day)
}

function getWeekdayDiff(weekDayA, weekDayB) {
  new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(new Date(year, month-1, i))
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

// getWeekDayDiff('Mon', 'Sun') -> 1
// getWeekDayDiff('Sun', 'Sun') -> 0
// getWeekDayDiff('Sun', 'Fri') -> 6
//  0   1   2   3   4   5   6
// Sun Mon Tue Wed Thu Fri Sat
const weekDays = new Map([
  ['Sun', 0],
  ['Mon', 1],
  ['Tue', 2],
  ['Wed', 3],
  ['Thu', 4],
  ['Fri', 5],
  ['Sat', 6]
]);

function getWeekDayIndex(weekDay) {
  return weekDays.get(weekDay);
}

function getDayRepresentation(year, month, day) {
  return {
    weekDay: new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(new Date(year, month-1, day)),
    dayOfMonth: day,
    year: year,
    month: month
  }
}

export function isFirstDayOfWeek(weekDay) {
  return weekDay === 'Sun';
}

export function isLastDayOfWeek(day) {
  return day.weekDay === 'Sat';
}


// export const WEEKDAY_NAMES = {
//   sunday: 0,
//   monday: 1,
//   tuesday: 2,
//   wednesday: 3,
//   thursday: 4,
//   friday: 5,
//   saturday: 6
// };

export const WEEKDAYS = [
  new Date(1970, 0, 4), // 0 - sunday
  new Date(1970, 0, 5), // 1 - monday
  new Date(1970, 0, 6), // 2 - tuesday
  new Date(1970, 0, 7), // 3 - wednesday
  new Date(1970, 0, 8), // 4 - thursday
  new Date(1970, 0, 9), // 5 - friday
  new Date(1970, 0, 10) // 6 - saturday
];

// TODO: consider that week day may start from Sunday, Monday and Saturday
export function getWeekDays(options = {locale: 'en-US', firstDayOfWeek: WEEKDAYS[0]}) {
  const rotateCount = WEEKDAYS.findIndex(day => day === options.firstDayOfWeek) * -1;
  return rotate(WEEKDAYS, rotateCount).map((date) => {
    return new Intl.DateTimeFormat('en-US', {weekday: 'short' /* TODO: make configurable */}).format(date);
  });
}

export function rotate(collection, n) {
  if (n === 0 ) {
    return collection;
  }

  const [takeFn, insertFn] = n > 0 ?
    [Array.prototype.pop, Array.prototype.unshift] :
    [Array.prototype.shift, Array.prototype.push];

  const count = Math.abs(n);

  function shift(i) {
    if (i === count) {
      return collection;
    }

    const item = takeFn.call(collection);
    insertFn.call(collection, item);

    return shift(i + 1);
  }

  return shift(0);
}

// function* calendar() { yield 1; yield 2; yield 3; yield 4 }

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


// TODO: enableOutsideDays
export function getCalendar(year, month, options = {withOutsideDays: false}) {
    // const daysInMonthCount = getDaysInMonth(year, month);
    // let days = [];
    //
    // for (let i = 1; i <= daysInMonthCount; i += 1) {
    //     days.push(getDayRepresentation(year, month, i));
    // }

    function* calendar(year, month, options = {reverseOrder: false}) {
      const dec = (value) => value - 1;
      const inc = (value) => value + 1;

      const daysInMonthCount = getDaysInMonth(year, month);
      // iterate from beginning of the month to the end or from the end to the beginning
      let [dayOfMonth, end, next] = options.reverseOrder ?
        [daysInMonthCount, 0, dec] : // iterate in reverse from daysInMonthCount -> 0 (exclusive)
        [1, daysInMonthCount+1, inc];  // iterate 1 -> daysInMonthCount+1 (exclusive);

      while (dayOfMonth !== end) {
        yield getDayRepresentation(year, month, dayOfMonth);
        dayOfMonth = next(dayOfMonth);
      }
    }

    let days = [...calendar(year, month)];

    if (options.withOutsideDays) {
      if (!isFirstDayOfWeek(days[0].weekDay)) {
        const index = getWeekDayIndex(days[0].weekDay);
        const [maybePrevYear, prevMonth] = getPreviousMonth(year, month);
        days = [...take(index, () => calendar(maybePrevYear, prevMonth, {reverseOrder: true})).reverse(), ...days];
        // TODO: reverse() solves the issue when days from take() are ordered incorrectly 31 -> 30 -> 29 -> 1 -> 2 ...
      }

      if (!isLastDayOfWeek(days[days.length-1].weekDay)) {
        const index = getWeekDayIndex(days[days.length-1].weekDay);
        // week contains 7 days. but we are using zero based indexing. so the Saturday is 6.
        const [maybeNextYear, nextMonth] = getNextMonth(year, month);
        days = [...days, ...take(6 - index, () => calendar(maybeNextYear, nextMonth))];
      }
    }

    return days;
    // const daysToGoback = getWeekDayIndex(result[0].weekDay);
    // // TODO: what if it starts on Monday?
    // // TODO: what if month-1 is December of previous year?
    // if (daysToGoback !== 0) {
    //
    // }
    // const previousMonth = [];
    // for (;) {
    //   result.unshift({});
    // }
    //
    // const lastWeekDayOfMonth = result[result.length-1].weekDay;


    // return days;
}

export function groupByWeeks(days) {
  function partition(days, result=[]) {
    const end = days.findIndex(isLastDayOfWeek);
    if (days.length === 0) {
      return result;
    } else if (end === -1) {
      // add the remaining days.
      result.push(days);
      return result;
    }

    return partition(days.slice(end+1, days.length), [...result, days.slice(0, end+1)])
  }

  return partition(days);
}


const months = new Array(12).fill(0).map((month, index) => {
  return new Date(1970, index, 1);
});

export function getMonths() {
  return months.map((month, index) => {
    return {
      monthOfYear: index + 1,
      month: new Intl.DateTimeFormat('en-US', {month: 'long' /* TODO: make configurable */}).format(month)
    };
  });
}

/**
[
    {weekDay: 'Sunday', dayOfMonth: 1, year: 2019, month: 12},
    {weekDay: 'Sunday', dayOfMonth: 2, year: 2019, month: 12},
    ...
]
**/
