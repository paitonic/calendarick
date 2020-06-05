export const encodeProps = (props) => {
  return encodeURIComponent(JSON.stringify(props));
};

export const decodeProps = (str) => {
  const deserializeArrayOfDates = (array) => {
    return array.map((dateOrArray) => {
      return Array.isArray(dateOrArray) ? deserializeArrayOfDates(dateOrArray) : new Date(dateOrArray);
    });
  };

  // TODO: Improve?
  const reviver = (key, value) => {
    if (key === 'value' && value.length > 0) {
      return deserializeArrayOfDates(value);
    } else if (key === 'firstDayOfWeek') {
      return new Date(value);
    } else {
      return value;
    }
  };

  const decoded = decodeURIComponent(str);
  return JSON.parse(decoded, reviver);
};
