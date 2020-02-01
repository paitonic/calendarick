import {
  getCalendar,
  countDaysInMonth,
  getMonths,
  getWeekDays,
  groupByWeeks,
  rotate,
  take,
  WEEKDAYS,
  isFirstDayOfWeek,
  isLastDayOfWeek,
  orderWeekDays,
  getWeekDayIndex,
  isOutsideMonth,
  isBefore,
  isAfter,
  compareDates,
  minDate,
  maxDate,
  isToday,
  isBetween,
  isSame,
  toArray,
  fromArray,
  isIn,
  nextDayOf,
  prevDayOf, clone
} from './calendar';

// TODO: Note on internationalization (Int.DateTimeFormat(), toLocaleString()) in Node:
// https://github.com/nodejs/node/issues/19214

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

    expect(toArray(firstDay)).toEqual([2019, 12, 1, 0, 0, 0, 0]);
    expect(toArray(lastDay)).toEqual([2019, 12, 31, 0, 0, 0, 0]);
  });

  test('should not return outside days when withOutsideDays is false (default)', () => {
    const july = getCalendar(2019, 7);
    const [firstDay, lastDay] = [july[0], july[july.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 7, 1, 0, 0, 0, 0]);
    expect(toArray(lastDay)).toEqual([2019, 7, 31, 0, 0, 0, 0]);
  });

  test('should return outside days of current month when withOutsideDays=true', () => {
    const calendar = getCalendar(2019, 7, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 6, 30, 0, 0, 0, 0]);
    expect(toArray(lastDay)).toEqual([2019, 8, 3, 0, 0, 0, 0]);
  });

  test('should return outside days for December calendar', () => {
    const calendar = getCalendar(2019, 12, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 12, 1, 0, 0, 0, 0]);
    expect(toArray(lastDay)).toEqual([2020, 1, 4, 0, 0, 0, 0]);
  });

  test('should return outside days for January calendar', () => {
    const calendar = getCalendar(2020, 1, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(toArray(firstDay)).toEqual([2019, 12, 29, 0, 0, 0, 0]);
    expect(toArray(lastDay)).toEqual([2020, 2, 1, 0, 0, 0, 0]);
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
    expect(toArray(firstDayOfMonth)).toEqual([2019, 10, 1, 0, 0, 0, 0]);

    expect(lastWeek.length).toBe(5);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 10, 31, 0, 0, 0, 0]);
  });

  test('should group days into weeks with isRTL=true', () => {
    const october = getCalendar(2019, 10, {isRTL: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october, {isRTL: true});

    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[firstWeek.length-1];
    const lastDayOfMonth = lastWeek[0];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(5);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 10, 1, 0, 0, 0, 0]);

    expect(lastWeek.length).toBe(5);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 10, 31, 0, 0, 0, 0]);
  });

  test('should work with outsideDays', () => {
    const october = getCalendar(2019, 10, {withOutsideDays: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october);
    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[0];
    const lastDayOfMonth = lastWeek[lastWeek.length-1];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(7);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 9, 29, 0, 0, 0, 0]);

    expect(lastWeek.length).toBe(7);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 11, 2, 0, 0, 0, 0]);
  });

  test('should work with outsideDays and isRTL=true', () => {
    const october = getCalendar(2019, 10, {withOutsideDays: true, isRTL: true});
    const weeks = groupByWeeks(WEEKDAYS[0], october, {isRTL: true});
    const [firstWeek, lastWeek] = [weeks[0], weeks[weeks.length-1]];
    const firstDayOfMonth = firstWeek[lastWeek.length-1];
    const lastDayOfMonth = lastWeek[0];

    expect(weeks.length).toBe(5);

    expect(firstWeek.length).toBe(7);
    expect(toArray(firstDayOfMonth)).toEqual([2019, 9, 29, 0, 0, 0, 0]);

    expect(lastWeek.length).toBe(7);
    expect(toArray(lastDayOfMonth)).toEqual([2019, 11, 2, 0, 0, 0, 0]);
  });

  test('should fill missing days in week with null', () => {
    const august = getCalendar(2019, 10);
    const weeks = groupByWeeks(WEEKDAYS[0], august, {fillMissingDaysWithNull: true});
    const firstWeek = weeks[0].map(toArray);
    const lastWeek = weeks[weeks.length-1].map(toArray);

    expect(firstWeek).toEqual([
      null,
      null,
      [2019, 10, 1, 0, 0, 0, 0],
      [2019, 10, 2, 0, 0, 0, 0],
      [2019, 10, 3, 0, 0, 0, 0],
      [2019, 10, 4, 0, 0, 0, 0],
      [2019, 10, 5, 0, 0, 0, 0],
    ]);

    expect(lastWeek).toEqual([
      [2019, 10, 27, 0, 0, 0, 0],
      [2019, 10, 28, 0, 0, 0, 0],
      [2019, 10, 29, 0, 0, 0, 0],
      [2019, 10, 30, 0, 0, 0, 0],
      [2019, 10, 31, 0, 0, 0, 0],
      null,
      null,
    ]);
  });

  test('should fill missing days in week with null when isRTL=true', () => {
    const august = getCalendar(2019, 10);
    const weeks = groupByWeeks(WEEKDAYS[0], august, {isRTL: true, fillMissingDaysWithNull: true});
    const [firstWeek, lastWeek] = [weeks[0].map(toArray), weeks[weeks.length-1].map(toArray)];

    expect(firstWeek).toEqual([
      [2019, 10, 5, 0, 0, 0, 0],
      [2019, 10, 4, 0, 0, 0, 0],
      [2019, 10, 3, 0, 0, 0, 0],
      [2019, 10, 2, 0, 0, 0, 0],
      [2019, 10, 1, 0, 0, 0, 0],
      null,
      null,
    ]);

    expect(lastWeek).toEqual([
      null,
      null,
      [2019, 10, 31, 0, 0, 0, 0],
      [2019, 10, 30, 0, 0, 0, 0],
      [2019, 10, 29, 0, 0, 0, 0],
      [2019, 10, 28, 0, 0, 0, 0],
      [2019, 10, 27, 0, 0, 0, 0],
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

describe('compareDates', () => {
  test('should return -1 if first given date is earlier than the second provided date', () => {
    expect(compareDates(fromArray([2019, 1, 1]), fromArray([2019, 1, 2]))).toEqual(-1); // days
    expect(compareDates(fromArray([2019, 1, 1]), fromArray([2019, 2, 1]))).toEqual(-1); // months
    expect(compareDates(fromArray([2019, 1, 1]), fromArray([2020, 1, 1]))).toEqual(-1); // years
  });

  test('should return 1 if first given date is later than the second provided date', () => {
    expect(compareDates(fromArray([2019, 1, 2]), fromArray([2019, 1, 1]))).toEqual(1); // days
    expect(compareDates(fromArray([2019, 2, 1]), fromArray([2019, 1, 1]))).toEqual(1); // months
    expect(compareDates(fromArray([2019, 1, 1]), fromArray([2018, 1, 1]))).toEqual(1); // years
  });

  test('should return 0 if dates are equal', () => {
    const date = fromArray([2019, 1, 1]);

    expect(compareDates(date, date)).toEqual(0);
  });
});

describe('minDate', () => {
  test('should return the earliest of dates', () => {
    const earliest = fromArray([2019, 9, 1]);

    expect(toArray(minDate([earliest, fromArray([2019, 9, 3]), fromArray([2019, 9, 2])]))).toEqual(toArray(earliest));
    expect(toArray(minDate([fromArray([2019, 9, 3]), earliest, fromArray([2019, 9, 2])]))).toEqual(toArray(earliest));
    expect(toArray(minDate([fromArray([2019, 9, 3]), fromArray([2019, 9, 2]), earliest]))).toEqual(toArray(earliest));
  });
});

describe('maxDate', () => {
  test('should return the latest of dates', () => {
    const latest = fromArray([2019, 9, 3]);

    expect(toArray(maxDate([latest, fromArray([2019, 9, 1]), fromArray([2019, 9, 2])]))).toEqual(toArray(latest));
    expect(toArray(maxDate([fromArray([2019, 9, 1]), latest, fromArray([2019, 9, 2])]))).toEqual(toArray(latest));
    expect(toArray(maxDate([fromArray([2019, 9, 1]), fromArray([2019, 9, 2]), latest]))).toEqual(toArray(latest));
  });
});

describe('isToday', () => {
  test('should return true if given date is today', () => {
    const date = new Date();
    expect(isToday(date)).toBe(true);
  });

  test('should return false if given date is different than today', () => {
    const date = fromArray([2019, 9, 1]);
    expect(isToday(date)).toBe(false);
  });
});

describe('isBefore', () => {
  test('should return true if first date is earlier than the other', () => {
    expect(isBefore(fromArray([2019, 9, 1]), fromArray([2019, 9, 2]))).toBe(true);
    expect(isBefore(fromArray([2019, 8, 2]), fromArray([2019, 9, 1]))).toBe(true);
    expect(isBefore(fromArray([2018, 9, 2]), fromArray([2019, 9, 1]))).toBe(true);
    expect(isBefore(fromArray([2018, 10, 2]), fromArray([2019, 9, 1]))).toBe(true);
  });

  test('should return false if first date is later than the other', () => {
    expect(isBefore(fromArray([2019, 9, 1]), fromArray([2019, 9, 1]))).toBe(false);
    expect(isBefore(fromArray([2019, 9, 2]), fromArray([2019, 9, 1]))).toBe(false);
    expect(isBefore(fromArray([2019, 10, 1]), fromArray([2019, 9, 2]))).toBe(false);
    expect(isBefore(fromArray([2020, 9, 1]), fromArray([2019, 9, 2]))).toBe(false);
    expect(isBefore(
      fromArray([2019, 9, 1], [18, 59, 59, 999]),
      fromArray([2019, 9, 1], [19, 0, 0, 0]))
    ).toBe(false);
  });

  test('should return false if dates are same', () => {
    const date = fromArray([2019, 1, 1]);
    const otherDate = fromArray([2019, 1, 1]);
    expect(isBefore(date, otherDate)).toBe(false);
  });
});

describe('isAfter', () => {
  test('should return true if first date is later than the other', () => {
    expect(isAfter(fromArray([2019, 9, 2]), fromArray([2019, 9, 1]))).toBe(true);
    expect(isAfter(fromArray([2019, 10, 1]), fromArray([2019, 9, 2]))).toBe(true);
    expect(isAfter(fromArray([2020, 10, 1]), fromArray([2019, 9, 2]))).toBe(true);
    expect(isAfter(fromArray([2020, 8, 1]), fromArray([2019, 9, 2]))).toBe(true);
  });

  test('should return false if first date is earlier than the other', () => {
    expect(isAfter(fromArray([2019, 9, 1]), fromArray([2019, 9, 1]))).toBe(false);
    expect(isAfter(fromArray([2019, 9, 1]), fromArray([2019, 9, 2]))).toBe(false);
    expect(isAfter(fromArray([2018, 8, 2]), fromArray([2019, 9, 1]))).toBe(false);
    expect(isAfter(fromArray([2018, 10, 2]), fromArray([2019, 9, 1]))).toBe(false);
    expect(isAfter(
      fromArray([2019, 1, 1], [18, 0, 0]),
      fromArray([2019, 1, 1], [17, 59, 59, 999]))
    ).toBe(false);
  });

  test('should return false if dates are same', () => {
    const date = fromArray([2019, 1, 1]);
    const otherDate = fromArray([2019, 1, 1]);
    expect(isAfter(date, otherDate)).toBe(false);
  });
});

describe('isBetween', () => {
  test('should return true if given date is between the two dates (inclusive=false)', () => {
    const date = fromArray([2019, 9, 2]);
    const start = fromArray([2019, 9, 1]);
    const end = fromArray([2019, 9, 3]);

    expect(isBetween(date, start, end)).toBe(true);
  });

  test('should return false if given date is not between the two dates (inclusive=false)', () => {
    const date = fromArray([2019, 9, 2]);
    const start = fromArray([2019, 9, 1]);
    const end = fromArray([2019, 9, 3]);

    expect(isBetween(date, end, start)).toBe(false);
  });

  test('should return true if given date is between the two dates (inclusive=true)', () => {
    const start = fromArray([2019, 9, 1]);
    const middle = fromArray([2019, 9, 2]);
    const end = fromArray([2019, 9, 3]);

    expect(isBetween(start, start, end, true)).toBe(true);
    expect(isBetween(end, start, end, true)).toBe(true);
    expect(isBetween(middle, start, end, true)).toBe(true);
  });

  test('should return false if given date is not between the two dates (inclusive=true', () => {
    const start = fromArray([2019, 9, 2]);
    const end = fromArray([2019, 9, 3]);
    const before = fromArray([2019, 9, 1]);
    const after = fromArray([2019, 9, 4]);

    expect(isBetween(before, start, end, true)).toBe(false);
    expect(isBetween(after, start, end, true)).toBe(false);
  });
});

describe('isSame', () => {
  test('should return true if two dates are same', () => {
    const date = fromArray([2019, 9, 1]);
    const sameDate = fromArray([2019, 9, 1]);
    expect(isSame(date, sameDate)).toBe(true);
  });

  test('should ignore time and return true', () => {
    const day = fromArray([2019, 9, 1], [18, 0, 0]);
    const sameDayWithDifferentTime = fromArray([2019, 9, 1], [18, 30, 0]);
    expect(isSame(day, sameDayWithDifferentTime)).toBe(true);
  });

  test('should return false if two dates are not the same', () => {
    const date = fromArray([2019, 9, 1]);
    const otherDate = fromArray([2020, 9, 1]);
    expect(isSame(date, otherDate)).toBe(false);
  });
});

describe('toArray', () => {
  test('convert Date object to array [yyyy, mm, dd, hh, mm, ss, ms]', () => {
    const date = new Date(2019, 9-1, 1);
    expect(toArray(date)).toEqual([2019, 9, 1, 0, 0, 0, 0]);

    const withTime = new Date(2019, 9-1, 1, 2, 3, 4, 5);
    expect(toArray(withTime)).toEqual([2019, 9, 1, 2, 3, 4, 5]);
  });
});

describe('fromArray', () => {
  test('convert array [yyyy, mm, dd] to Date object', () => {
    expect(toArray(fromArray([2019, 9, 1]))).toEqual([2019, 9, 1, 0, 0, 0, 0]);
  });

  test('create Date object from [yyyy, mm, dd, hh, mm, ss, ms]', () => {
    const date = fromArray([2019, 9, 1, 18, 1, 2, 3]);
    expect(date.getFullYear()).toBe(2019);
    expect(date.getMonth()).toBe(9-1);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(18);
    expect(date.getMinutes()).toBe(1);
    expect(date.getSeconds()).toBe(2);
    expect(date.getMilliseconds()).toBe(3)
  });
});

describe('isIn', () => {
  const d_2018_01_01 = fromArray([2018, 1, 1]);

  const d_2019_01_01 = fromArray([2019, 1, 1]);
  const d_2019_01_02 = fromArray([2019, 1, 2]);
  const d_2019_01_03 = fromArray([2019, 1, 3]);
  const d_2019_01_04 = fromArray([2019, 1, 4]);

  const d_2019_02_01 = fromArray([2019, 2, 1]);
  const d_2019_02_02 = fromArray([2019, 2, 2]);

  const d_2020_01_01 = fromArray([2020, 1, 1]);

  it('should return true if date is in the array', () => {
    expect(isIn(d_2019_01_01, [ d_2019_01_01 ])).toBe(true);
    expect(isIn(d_2019_01_01, [ d_2019_01_01, d_2019_02_02 ])).toBe(true);
    expect(isIn(d_2019_01_02, [ d_2019_01_01, d_2019_01_02 ])).toBe(true);
    expect(isIn(d_2019_01_02, [ [d_2019_01_01, d_2019_01_02] ])).toBe(true);
    expect(isIn(d_2019_01_02, [ [d_2019_01_01, d_2019_01_03] ])).toBe(true);
    expect(isIn(d_2019_01_03, [ [d_2019_01_01, d_2019_01_02], d_2019_01_03 ])).toBe(true);
  });

  it('should return false if date is not in the array', () => {
    expect(isIn(d_2019_01_01, [ d_2019_01_02 ])).toBe(false);
    expect(isIn(d_2019_01_01, [ d_2018_01_01, d_2019_02_01, d_2020_01_01 ])).toBe(false);
    expect(isIn(d_2019_01_02, [ d_2019_01_01, [d_2019_01_03, d_2019_01_04] ])).toBe(false);
    expect(isIn(d_2019_01_04, [ d_2019_01_03, [d_2019_01_01, d_2019_01_02] ])).toBe(false);
  });
});


const d_2019_01_01 = fromArray([2019, 1, 1]);
const d_2019_01_02 = fromArray([2019, 1, 2]);

const d_2019_09_30 = fromArray([2019, 9, 30]);
const d_2019_10_01 = fromArray([2019, 10, 1]);

const d_2019_12_31 = fromArray([2019, 12, 31]);
const d_2020_01_01 = fromArray([2020, 1, 1]);

const d_2019_02_28 = fromArray([2019, 2, 28]);
const d_2019_03_01 = fromArray([2019, 3, 1]);

const d_2020_02_29 = fromArray([2020, 2, 29]);
const d_2020_03_01 = fromArray([2020, 3, 1]);

describe('nextDayOf', () => {
  it('should return next day', () => {
    expect(isSame(nextDayOf(d_2019_01_01), d_2019_01_02)).toBe(true);

    // end of month
    expect(isSame(nextDayOf(d_2019_09_30), d_2019_10_01)).toBe(true);

    // end of year
    expect(isSame(nextDayOf(d_2019_12_31), d_2020_01_01)).toBe(true);

    // non leap year
    expect(isSame(nextDayOf(d_2019_02_28), d_2019_03_01)).toBe(true);

    // leap year
    expect(isSame(nextDayOf(d_2020_02_29), d_2020_03_01)).toBe(true);
  });
});

describe('prevDayOf', () => {
  it('should return previous day', () => {
    expect(isSame(prevDayOf(d_2019_01_02), d_2019_01_01)).toBe(true);

    // end of month
    expect(isSame(prevDayOf(d_2019_10_01), d_2019_09_30)).toBe(true);

    // end of year
    expect(isSame(prevDayOf(d_2020_01_01), d_2019_12_31)).toBe(true);

    // non leap year
    expect(isSame(prevDayOf(d_2019_03_01), d_2019_02_28)).toBe(true);

    // leap year
    expect(isSame(prevDayOf(d_2020_03_01), d_2020_02_29)).toBe(true);
  });
});

describe('clone', () => {
  it('should clone the date', () => {
    let date = fromArray([2019, 1, 1, 0, 0, 0, 0]);
    const clone_d_2019_01_01 = clone(date);

    expect(clone_d_2019_01_01).not.toBe(date);
    expect(clone_d_2019_01_01.getTime()).toEqual(date.getTime());
  });

  it('should clone: [Date, Date]', () => {
    let d_2019_01_01 = fromArray([2019, 1, 1, 0, 0, 0, 0]);
    let d_2019_01_02 = fromArray([2019, 1, 2, 0, 0, 0, 0]);
    const arrayOfDates = [d_2019_01_01, d_2019_01_02];
    const clonedArrayOfDates = clone(arrayOfDates);

    expect(clonedArrayOfDates.length).toBe(2);
    expect(arrayOfDates).not.toBe(clonedArrayOfDates);

    expect(clonedArrayOfDates[0].getTime()).toBe(arrayOfDates[0].getTime());
    expect(clonedArrayOfDates[1].getTime()).toBe(arrayOfDates[1].getTime());

    expect(clonedArrayOfDates[0]).not.toBe(arrayOfDates[0]);
    expect(clonedArrayOfDates[1]).not.toBe(arrayOfDates[1]);
  });

  it('should clone: [ [Date, Date], Date ]', () => {
    let d_2019_01_01 = fromArray([2019, 1, 1, 0, 0, 0, 0]);
    let d_2019_01_02 = fromArray([2019, 1, 2, 0, 0, 0, 0]);
    let d_2019_01_03 = fromArray([2019, 1, 3, 0, 0, 0, 0]);
    const arrayOfDates = [ [d_2019_01_01, d_2019_01_02], d_2019_01_03 ];
    const clonedArrayOfDates = clone(arrayOfDates);

    expect(clonedArrayOfDates.length).toBe(2);
    expect(Array.isArray(clonedArrayOfDates[0])).toBe(true);
    expect(clonedArrayOfDates[0]).not.toBe(arrayOfDates[0]);
    expect(clonedArrayOfDates[1] instanceof Date).toBe(true);

    expect(clonedArrayOfDates[0][0].getTime()).toBe(arrayOfDates[0][0].getTime());
    expect(clonedArrayOfDates[0][1].getTime()).toBe(arrayOfDates[0][1].getTime());
    expect(clonedArrayOfDates[1].getTime()).toBe(arrayOfDates[1].getTime());

    expect(clonedArrayOfDates[0][0]).not.toBe(arrayOfDates[0][0]);
    expect(clonedArrayOfDates[0][1]).not.toBe(arrayOfDates[0][1]);
    expect(clonedArrayOfDates[1]).not.toBe(arrayOfDates[1]);
  });
});
