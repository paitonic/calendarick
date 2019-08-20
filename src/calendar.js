export function getDaysInMonth(year, month) {
    // 0 in day returns total days in a previous month
    // month are zero-based.
    return new Date(year, month, 0).getDate();
}

export function getCalendar(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const result = [];

    for (let i = 1; i <= daysInMonth; i += 1) {
        const date = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(new Date(year, month-1, i));
        result.push({weekDay: date, dayOfMonth: i, year: year, month: month});
    }

    return result;
}

/**
[
    {weekDay: 'Sunday', dayOfMonth: 1, year: 2019, month: 12},
    {weekDay: 'Sunday', dayOfMonth: 2, year: 2019, month: 12},
    ...
]
**/
