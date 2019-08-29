// TODO: replace Int.DateFormat with toLocaleString?

export function countDaysInMonth(year, month) {
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

// TODO: depends on firstDayOfWeek
function getWeekDayIndex(firstDayOfWeek, weekDay) {
  const ordered = orderWeekDays(firstDayOfWeek);
  return ordered.findIndex(day => day.getDay() === weekDay.getDay())
}

// TODO: depends on locale
function getDayRepresentation(date, {locale = 'en-US', weekday = 'short'} = {}) {
  return {
    weekDay: new Intl.DateTimeFormat(locale, {weekday}).format(date),
    dayOfMonth: date.getDate(),
    year: date.getFullYear(),
    month: date.getMonth() + 1
  }
}

// TODO: depends on firstDayOfWeek
export function isFirstDayOfWeek(firstDayOfWeek, date) {
  return firstDayOfWeek.getDay() === date.getDay();
}

// TODO: depends on firstDayOfWeek
export function isLastDayOfWeek(firstDayOfWeek, date) {
  const ordered = orderWeekDays(firstDayOfWeek);
  return ordered[ordered.length-1].getDay() === date.getDay();
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

// TODO: depends on the firstDayOfWeek

export const WEEKDAYS = [
  new Date(1970, 0, 4), // 0 - sunday
  new Date(1970, 0, 5), // 1 - monday
  new Date(1970, 0, 6), // 2 - tuesday
  new Date(1970, 0, 7), // 3 - wednesday
  new Date(1970, 0, 8), // 4 - thursday
  new Date(1970, 0, 9), // 5 - friday
  new Date(1970, 0, 10) // 6 - saturday
];



// TODO: depends on locale & firstDayOfWeek
// TODO: consider that week day may start from Sunday, Monday and Saturday
export function getWeekDays({locale = 'en-US', firstDayOfWeek = WEEKDAYS[0], weekday = 'short'} = {}) {
  return orderWeekDays(firstDayOfWeek).map((date) => {
    return new Intl.DateTimeFormat(locale, {weekday: weekday}).format(date);
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


export function getCalendar(year, month, {locale = 'en-US', weekday = 'short', withOutsideDays = false, firstDayOfWeek = WEEKDAYS[0]} = {}) {
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
        yield new Date(year, month-1, dayOfMonth);
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

      if (!isLastDayOfWeek(firstDayOfWeek, days[days.length-1])) {
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

export function groupByWeeks(firstDayOfWeek, days) {
  function partition(days, result=[]) {
    // TODO: list of days is actually contains objects returned by getDayRepresentation(). they are not Date() objects.
    const end = days.findIndex((day) => isLastDayOfWeek(firstDayOfWeek, day));
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

function orderWeekDays(firstDayOfWeek) {
  const rotateCount = WEEKDAYS.findIndex(day => day === firstDayOfWeek) * -1;
  return rotate([...WEEKDAYS], rotateCount);
}

// TODO: depends on locale
export function getMonths({locale =  'en-US', month = 'long'} = {}) {
  return months.map((monthObj, index) => {
    return {
      order: index + 1,
      month: new Intl.DateTimeFormat(locale, {month: month}).format(monthObj)
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

// format(new Date(), )
// function format(day, formatting) {
//
// }
function toRaw(day) {
  return [day.getFullYear(), day.getMonth(), day.getDate()];
}


// const calendar = new Calendar('en-Us', weekdays.sunday);
// calendar.next();
// calendar.previous();
// calendar.groupByWeeks();
// calendar.days

/*

const calendar = calendar('en-US')
calendar.getMonth()

 */
