import { getDaysInMonth } from './calendar';

describe('getDaysInMonth', () => {
  test('should return 31 for January 2019', () => {
    expect(getDaysInMonth(2019, 1)).toBe(31);
  })
});
