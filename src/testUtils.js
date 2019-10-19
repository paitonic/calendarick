// TODO: temporarily located in src/. too lazy to setup jest for examples/reactjs
export const encodeProps = (props) => {
  return encodeURIComponent(JSON.stringify(props));
};

export const decodeProps = (str) => {
  const deserializeArrayOfDates = (array) => {
    return array.map((dateOrArray) => {
      return Array.isArray(dateOrArray) ? deserializeArrayOfDates(dateOrArray) : new Date(dateOrArray);
    });
  };

  const reviver = (key, value) => {
    // assumption. at the moment works only with field `value`
    if (key === 'value' && value.length > 0) {
      return deserializeArrayOfDates(value);
    } else {
      return value;
    }
  };

  const decoded = decodeURIComponent(str);
  return JSON.parse(decoded, reviver);
};
