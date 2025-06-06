import { money, parseStringNumberToFloat } from '../../src/utils/currencyFormats';

describe('money', () => {
  it('should format a number to BRL currency', () => {
    expect(money(1234.56)).toBe('R$ 1.234,56');
  });

  it('should return "R$ 0,00" if value is null', () => {
    expect(money(null)).toBe('R$ 0,00');
  });

  it('should return "R$ 0,00" if value is undefined', () => {
    expect(money(undefined)).toBe('R$ 0,00');
  });

  it('should return "R$ 0,00" if value is 0', () => {
    expect(money(0)).toBe('R$ 0,00');
  });
});

describe('parseStringNumberToFloat', () => {
  it('should convert a formatted BRL string to float', () => {
    expect(parseStringNumberToFloat('R$ 1.234,56')).toBeCloseTo(1234.56);
  });

  it('should handle string without currency symbol', () => {
    expect(parseStringNumberToFloat('1.234,56')).toBeCloseTo(1234.56);
  });

  it('should return 0 for invalid strings', () => {
    expect(parseStringNumberToFloat('')).toBe(0);
    expect(parseStringNumberToFloat('abc')).toBe(0);
  });

  it('should handle strings with spaces', () => {
    expect(parseStringNumberToFloat('  R$ 2.345,78  ')).toBeCloseTo(2345.78);
  });
});
