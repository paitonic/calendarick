import { getCalendar, getDaysInMonth } from './calendar';

describe('getDaysInMonth', () => {
  test('should return 31 for January 2019', () => {
    expect(getDaysInMonth(2019, 1)).toBe(31);
  })
});

describe('getCalendar', () => {
  test('should return calendar', () => {
    const december = getCalendar(2019, 12);
    const [firstDay, lastDay] = [december[0], december[december.length-1]];

    expect(firstDay.weekDay).toBe('Sun');
    expect(firstDay.dayOfMonth).toBe(1);

    expect(lastDay.weekDay).toBe('Tue');
    expect(lastDay.dayOfMonth).toBe(31);
  });
});
