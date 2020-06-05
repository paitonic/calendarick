export function createDate(date) { return [date]; }

export function createDateRange(date1, date2) { return [ [date1, date2]] }

export function createMultipleDates(...args) { return [...args]; }

export function format(date) {
  const year = date.getFullYear();
  const month = `${(date.getMonth()+1)}`.padStart(2, '0');
  const day = `${(date.getDate())}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(date) {
    // handle single date, multiple dates and range
    if (!date || date && date.length === 0) {
      return '';
    } else if (date instanceof Date) {
      return format(date);
    } else if (date.every((day => day instanceof Date))) {
      // multiple selected days
      return date.map(format).join(', ');
    } else if (date.length === 1) {
      // range
      const range = date[0];
      return range.map(format).join(' - ');
    } else {
      throw new Error('formatDate: could not handle: ' + date);
    }
}

export function toDate(input) {
  const regexp = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
  const match = input.match(regexp);
  if (!match) {
    return null;
  }

  const [_, year, month, day] = match;
  return createDate(new Date(parseInt(year, 10), parseInt(month)-1, parseInt(day), 0, 0, 0, 0));
}

export function toDateRange(input) {
  const regexp = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) - (\d{4})-(\d{2})-(\d{2})$/);
  const match = input.match(regexp);
  if (!match) {
    return null;
  }

  const [_, fromYear, fromMonth, fromDay, toYear, toMonth, toDay] = match;

  return createDateRange(
    new Date(parseInt(fromYear, 10), parseInt(fromMonth)-1, parseInt(fromDay), 0, 0, 0, 0),
    new Date(parseInt(toYear, 10), parseInt(toMonth)-1, parseInt(toDay), 0, 0, 0, 0)
  );
}
