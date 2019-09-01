import {
  chunk,
  getCalendar,
  countDaysInMonth,
  getMonths,
  getWeekDays,
  groupByWeeks,
  rotate,
  take,
  WEEKDAYS,
  isFirstDayOfWeek,
  isLastDayOfWeek, orderWeekDays, getWeekDayIndex, isOutsideMonth
} from './calendar';

// TODO: Note on internationalization (Int.DateTimeFormat(), toLocaleString()) in Node:
// https://github.com/nodejs/node/issues/19214

function toArray(date) {
  if (date instanceof Date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  } else {
    return date;
  }
}

function fromArray(arr) {
  const [year, month, day] = arr;
  return new Date(year, month-1, day);
}

// function toObject(date) {
//   return {year: date.getFullYear(), month: date.getMonth() + 1, dayOfMonth: date.getDate()};
// }

describe('countDaysInMonth', () => {
  test('should return 31 for January 2019', () => {
    expect(countDaysInMonth(2019, 1)).toBe(31);
  });

  test('should work with leap years', () => {
    expect(countDaysInMonth(2020, 2)).toBe(29);
  });
});

// day.weekDay    -> day.getDay()
// day.dayOfMonth -> day.getDate()
// day.month      -> day.getMonth()+1
// day.year       -> day.getFullYear()
describe('getCalendar', () => {
  test('should return calendar', () => {
    const december = getCalendar(2019, 12);
    const [firstDay, lastDay] = [december[0], december[december.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 12, 1]);
    expect(toArray(lastDay)).toEqual([2019, 12, 31]);
  });

  test('should not return outside days when withOutsideDays is false (default)', () => {
    const july = getCalendar(2019, 7);
    const [firstDay, lastDay] = [july[0], july[july.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 7, 1]);
    expect(toArray(lastDay)).toEqual([2019, 7, 31]);
  });

  test('should return outside days of current month when withOutsideDays=true', () => {
    const calendar = getCalendar(2019, 7, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 6, 30]);
    expect(toArray(lastDay)).toEqual([2019, 8, 3]);
  });

  test('should return outside days for December calendar', () => {
    const calendar = getCalendar(2019, 12, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 12, 1]);
    expect(toArray(lastDay)).toEqual([2020, 1, 4]);
  });

  test('should return outside days for January calendar', () => {
    const calendar = getCalendar(2020, 1, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 12, 29]);
    expect(toArray(lastDay)).toEqual([2020, 2, 1]);
  });

});

describe('take', () => {
  test('take of 0', () => {
    function* days() { yield 1; yield 2; yield 3; yield 4 }

    const values = take(0, days);
    expect(values.length).toEqual(0);
  });

  test('should take 3 values', () => {
    function* days() { yield 1; yield 2; yield 3; yield 4 }

    const values = take(3, days);
    expect(values).toEqual([1, 2, 3]);
  });
});

describe('groupByWeeks', () => {
  test('should group days into weeks', () => {
    const october = getCalendar(2019, 10);
    const weeks = groupByWeeks(WEEKDAYS[0], october);
    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[0];
    const lastDayOfMonth = lastWeek[lastWeek.length-1];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(5);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 10, 1]);

    expect(lastWeek.length).toBe(5);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 10, 31]);
  });

  test('should group days into weeks with isRTL=true', () => {
    const october = getCalendar(2019, 10, {isRTL: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october, {isRTL: true});

    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[firstWeek.length-1];
    const lastDayOfMonth = lastWeek[0];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(5);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 10, 1]);

    expect(lastWeek.length).toBe(5);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 10, 31]);
  });

  test('should work with outsideDays', () => {
    const october = getCalendar(2019, 10, {withOutsideDays: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october);
    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[0];
    const lastDayOfMonth = lastWeek[lastWeek.length-1];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(7);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 9, 29]);

    expect(lastWeek.length).toBe(7);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 11, 2]);
  });

  test('should work with outsideDays and isRTL=true', () => {
    const october = getCalendar(2019, 10, {withOutsideDays: true, isRTL: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october, {isRTL: true});
    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[lastWeek.length-1];
    const lastDayOfMonth = lastWeek[0];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(7);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 9, 29]);

    expect(lastWeek.length).toBe(7);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 11, 2]);
  });

  test('should fill missing days in week with null', () => {
    const august = getCalendar(2019, 10);
    const weeks = groupByWeeks(WEEKDAYS[0], august, {fillMissingDaysWithNull: true});
    const firstWeek = weeks[0].map(toArray);
    const lastWeek = weeks[weeks.length-1].map(toArray);

    expect(firstWeek).toEqual([
      null,
      null,
      [2019, 10, 1],
      [2019, 10, 2],
      [2019, 10, 3],
      [2019, 10, 4],
      [2019, 10, 5],
    ]);

    expect(lastWeek).toEqual([
      [2019, 10, 27],
      [2019, 10, 28],
      [2019, 10, 29],
      [2019, 10, 30],
      [2019, 10, 31],
      null,
      null,
    ]);
  });

  test('should fill missing days in week with null when isRTL=true', () => {
    const august = getCalendar(2019, 10);
    const weeks = groupByWeeks(WEEKDAYS[0], august, {isRTL: true, fillMissingDaysWithNull: true});
    const [firstWeek, lastWeek] = [weeks[0].map(toArray), weeks[weeks.length-1].map(toArray)];

    expect(firstWeek).toEqual([
      [2019, 10, 5],
      [2019, 10, 4],
      [2019, 10, 3],
      [2019, 10, 2],
      [2019, 10, 1],
      null,
      null,
    ]);

    expect(lastWeek).toEqual([
      null,
      null,
      [2019, 10, 31],
      [2019, 10, 30],
      [2019, 10, 29],
      [2019, 10, 28],
      [2019, 10, 27],
    ]);
  });
});

describe('getWeekDays', () => {
  test('should return week day names', () => {
    const names = getWeekDays();
    expect(names).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  test('should return correct week day names if firstDayOfWeek is specified', () => {
    const names = getWeekDays({firstDayOfWeek: WEEKDAYS[3] /* wednesday */});
    expect(names).toEqual(['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']);
  });

  test('should return week day names in RTL order', () => {
    const names = getWeekDays({locale: 'he', firstDayOfWeek: WEEKDAYS[0], isRTL: true});
    expect(names).toEqual(['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun']);
  });
});

describe('rotate', () => {
  test('should rotate the array n indexes left', () => {
    expect(rotate([0, 1, 2, 3, 4, 5, 6], -2)).toEqual([2, 3, 4, 5, 6, 0, 1]);
  });

  test('should rotate the array n indexes right', () => {
    expect(rotate([0, 1, 2, 3, 4, 5, 6], 2)).toEqual([5, 6, 0, 1, 2, 3, 4]);
  });
});

describe('getMonths', () => {
  test('should return total of 12 months', () => {
    expect(getMonths().length).toEqual(12);
  });

  test('should return list of months', () => {
    const months = getMonths();
    const firstMonthOfYear = months[0];
    const lastMonthOfYear = months[months.length-1];

    expect(firstMonthOfYear.order).toBe(1);
    expect(firstMonthOfYear.month).toBe('January');

    expect(lastMonthOfYear.order).toBe(12);
    expect(lastMonthOfYear.month).toBe('December');
  });
});

describe('isFirstDayOfWeek', () => {
  test('should return return true for Sunday', () => {
    expect(isFirstDayOfWeek(WEEKDAYS[0], fromArray([2019, 8, 4]))).toBe(true);
  });

  test('should return true for Monday when firstDayOfWeek is Monday', () => {
    expect(isFirstDayOfWeek(WEEKDAYS[1], fromArray([2019, 8, 5]))).toBe(true);
  });
});

describe('isLastDayOfWeek', () => {
  test('should return return true for Saturday', () => {
    expect(isLastDayOfWeek(WEEKDAYS[0], fromArray([2019, 8, 31]))).toBe(true);
  });

  test('should return true for Saturday when isRTL=true', () => {
    expect(isLastDayOfWeek(WEEKDAYS[0], fromArray([2019, 8, 31]), {isRTL: true})).toBe(true);
  });

  test('should return true for Sunday when firstDayOfWeek is Monday', () => {
    expect(isLastDayOfWeek(WEEKDAYS[1], fromArray([2019, 8, 25]))).toBe(true);
  });
});

describe('orderWeekDays', () => {
  test('should order week days', () => {
    expect(orderWeekDays(WEEKDAYS[1])).toEqual([
      WEEKDAYS[1], // Monday
      WEEKDAYS[2],
      WEEKDAYS[3],
      WEEKDAYS[4],
      WEEKDAYS[5],
      WEEKDAYS[6],
      WEEKDAYS[0] // Sunday
    ]);
  });

  test('should order week days in RTL order', () => {
    expect(orderWeekDays(WEEKDAYS[1], {isRTL: true})).toEqual([
      WEEKDAYS[0], // Sunday
      WEEKDAYS[6],
      WEEKDAYS[5],
      WEEKDAYS[4],
      WEEKDAYS[3],
      WEEKDAYS[2],
      WEEKDAYS[1] // Monday
    ]);
  });
});

describe('getWeekDayIndex', () => {
  test('should return correct week day index', () => {
    expect(getWeekDayIndex(WEEKDAYS[0], WEEKDAYS[1])).toBe(1);
  });

  test('should return correct week day index if firstDayOfWeek is different from Sunday', () => {
    // firstDayOfWeek is Monday
    // Mon - Tue - Wed - Thu - Fri - Sat - Sun
    expect(getWeekDayIndex(WEEKDAYS[1], WEEKDAYS[0])).toBe(6);
  });
});

describe('isOutsideMonth', () => {
  test('should return false if given date in the same month', () => {
    const month =  12;
    const december = getCalendar(2019, month);
    expect(isOutsideMonth(month, fromArray([2019, month, 1]))).toBe(false);
  });

  test('should return true if given date is outside of month', () => {
    const month = 12;
    const december = getCalendar(2019, month);
    expect(isOutsideMonth(month, fromArray([2019, 11, 1]))).toBe(true);
  });
});
