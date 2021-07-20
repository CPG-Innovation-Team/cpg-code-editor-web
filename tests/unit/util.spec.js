import { formattedDateTime } from '../../src/util';

describe('util.js', () => {
  it('Formatt date time with single-digit month, day, hour, minute and second', () => {
    expect(formattedDateTime(new Date('2021-09-09 01:02:03'))).toBe('210909-010203');
  });

  it('Formatt date time with double-digit month, day, hour, minute and second', () => {
    expect(formattedDateTime(new Date('2021-10-20 11:22:33'))).toBe('211020-112233');
  });
});
