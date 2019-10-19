import { decodeProps, encodeProps } from './testUtils';

const isSame = (date1, date2) => date1.getTime() === date2.getTime();

describe('encodeProps / decodeProps', () => {
  it('should take an object and convert it to encoded string', () => {
    const props = {
      selectionMode: 'single',
      value: [],
      calendar: {
        locale: 'en-US',
        weekday: 'narrow',
        isRTL: false,
        withOutsideDays: true,
      },
    };

    const encoded = encodeProps(props);
    expect(typeof encoded === 'string').toBe(true);

    const decoded = decodeProps(encoded);
    expect(decoded).toEqual(props);
  });

  it('should leave omit functions', () => {
    const props = {
      onClick: () => console.log('click')
    };

    const encoded = encodeProps(props);
    expect(typeof encoded === 'string').toBe(true);

    const decoded = decodeProps(encoded);
    expect(decoded).toEqual({});
  });

  it('should encode / decode dates - [ Date ]', () => {
    const d_2020_01_01 = new Date(2020, 0, 1);

    const props = {
      value: [ d_2020_01_01 ],
    };

    const encoded = encodeProps(props);
    expect(typeof encoded === 'string').toBe(true);

    const decoded = decodeProps(encoded);
    expect(isSame(decoded.value[0], d_2020_01_01)).toBe(true);
  });

  it('should encode / decode dates - [ Date, Date ]', () => {
    const d_2020_01_01 = new Date(2020, 0, 1);
    const d_2020_01_02 = new Date(2020, 0, 2);

    const props = {
      value: [ d_2020_01_01, d_2020_01_02],
    };

    const decoded = decodeProps(encodeProps(props));
    expect(isSame(decoded.value[0], d_2020_01_01)).toBe(true);
    expect(isSame(decoded.value[1], d_2020_01_02)).toBe(true);
  });

  it('should encode / decode dates - [ [Date, Date] ]', () => {
    const d_2020_01_01 = new Date(2020, 0, 1);
    const d_2020_01_02 = new Date(2020, 0, 2);

    const props = {
      value: [ [d_2020_01_01, d_2020_01_02] ],
    };

    const decoded = decodeProps(encodeProps(props));
    expect(isSame(decoded.value[0][0], d_2020_01_01)).toBe(true);
    expect(isSame(decoded.value[0][1], d_2020_01_02)).toBe(true);
  });
});
