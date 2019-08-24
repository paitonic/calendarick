// TODO: make DateTimeFormat accept locale as a parameter
// TODO: make DateTimeFormat to accept different options
// TODO: firstDayOfWeek parameter?

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

function getNextMonth(year, month) {
  if (month + 1 > 12) {
    return [year + 1, 1];
  } else {
    return [year, month + 1];
  }
}

function getPreviousMonth(year, month) {
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

function isFirstDayOfWeek(weekDay) {
  return weekDay === 'Sun';
}

function isLastDayOfWeek(day) {
  return day.weekDay === 'Sat';
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

/**
[
    {weekDay: 'Sunday', dayOfMonth: 1, year: 2019, month: 12},
    {weekDay: 'Sunday', dayOfMonth: 2, year: 2019, month: 12},
    ...
]
**/
