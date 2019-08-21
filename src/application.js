import { getCalendar } from './calendar';

const WEEKDAYS = new Map([
    [0, {en: {short: 'Sun', long: 'Sunday'}}],
    [1, {en: {short: 'Mon', long: 'Monday'}}],
    [2, {en: {short: 'Tue', long: 'Tuesday'}}],
    [3, {en: {short: 'Wed', long: 'Wednesday'}}],
    [4, {en: {short: 'Thu', long: 'Thursday'}}],
    [5, {en: {short: 'Fri', long: 'Friday'}}],
    [6, {en: {short: 'Sat', long: 'Saturday'}}],
]);


const calendar = getCalendar(2019, 11);
console.log(calendar);

