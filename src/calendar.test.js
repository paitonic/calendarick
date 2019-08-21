import { getCalendar, getDaysInMonth, take } from './calendar';

describe('getDaysInMonth', () => {
  test('should return 31 for January 2019', () => {
    expect(getDaysInMonth(2019, 1)).toBe(31);
  });

  test('should work with leap years', () => {
    expect(getDaysInMonth(2020, 2)).toBe(29);
  });
});

describe('getCalendar', () => {
  test.only('should return calendar', () => {
    const december = getCalendar(2019, 12);
    const [firstDay, lastDay] = [december[0], december[december.length-1]];

    expect(firstDay.weekDay).toBe('Sun');
    expect(firstDay.dayOfMonth).toBe(1);

    expect(lastDay.weekDay).toBe('Tue');
    expect(lastDay.dayOfMonth).toBe(31);
  });

  test('should not return outside days when withOutsideDays is false (default)', () => {
    const july = getCalendar(2019, 7);
    const [firstDay, lastDay] = [july[0], july[july.length-1]];

    expect(firstDay.month).toBe(7);
    expect(firstDay.dayOfMonth).toBe(1);
    expect(firstDay.weekDay).toBe('Mon');

    expect(lastDay.month).toBe(7);
    expect(lastDay.dayOfMonth).toBe(31);
    expect(lastDay.weekDay).toBe('Wed');
  });

  test('should return outside days of current month when withOutsideDays=true', () => {
    const july = getCalendar(2019, 7, {withOutsideDays: true});
    const [firstDay, lastDay] = [july[0], july[july.length-1]];

    expect(firstDay.month).toBe(6);
    expect(firstDay.dayOfMonth).toBe(30);
    expect(firstDay.weekDay).toBe('Sun');

    expect(lastDay.month).toBe(8);
    expect(lastDay.dayOfMonth).toBe(3);
    expect(lastDay.weekDay).toBe('Sat');
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
    expect(values.length).toBe(3);
    expect(values[0]).toBe(1);
    expect(values[1]).toBe(2);
    expect(values[2]).toBe(3);
  });
});
