import { describe, expect, it } from 'vitest';

import { contrastRatio } from '../src';

describe('Hex Color Test with 3 digits', () => {
  it('Contrast ratio black and white', () => {
    expect(contrastRatio('#000', '#FFF')).toBeCloseTo(21);
  });

  it('Contrast ratio white and black', () => {
    expect(contrastRatio('#FFF', '#000')).toBeCloseTo(21);
  });

  it('Contrast ratio white and white', () => {
    expect(contrastRatio('#FFF', '#FFF')).toBeCloseTo(1);
  });

  it('Contrast ratio black and black', () => {
    expect(contrastRatio('#000', '#000')).toBeCloseTo(1);
  });
});

describe('Hex Color Test with 6 digits', () => {
  it('Contrast ratio black and white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21);
  });

  it('Contrast ratio white and black', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21);
  });

  it('Contrast ratio red and green', () => {
    expect(contrastRatio('#ff0000', '#00ff00')).toBeCloseTo(2.9139, 4);
  });

  it('Contrast ratio white and white', () => {
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1);
  });

  it('Contrast ratio black and black', () => {
    expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1);
  });
});

describe('RGB Color Test', () => {
  it('Contrast ratio black and white', () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21);
  });

  it('Contrast ratio white and black', () => {
    expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeCloseTo(21);
  });

  it('Contrast ratio red and green', () => {
    expect(contrastRatio([255, 0, 0], [0, 255, 0])).toBeCloseTo(2.9139, 4);
  });

  it('Contrast ratio white and white', () => {
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBeCloseTo(1);
  });

  it('Contrast ratio black and black', () => {
    expect(contrastRatio([0, 0, 0], [0, 0, 0])).toBeCloseTo(1);
  });
});

describe('Contrast ratio options and validation', () => {
  it('Applies precision when requested', () => {
    expect(contrastRatio('#777777', '#ffffff', { precision: 2 })).toBe(4.48);
  });

  it('Throws on invalid HEX color input', () => {
    expect(() => contrastRatio('#12', '#ffffff')).toThrow(
      'Invalid HEX color. Use a 3 or 6 digit hexadecimal string.'
    );
  });

  it('Throws on invalid RGB channel input', () => {
    expect(() => contrastRatio([300, 0, 0], [255, 255, 255])).toThrow(
      'Invalid RGB color. Each channel must be an integer between 0 and 255. Received 300 at index 0.'
    );
  });

  it('Throws on invalid precision input', () => {
    expect(() =>
      contrastRatio('#777777', '#ffffff', { precision: -1 })
    ).toThrow('Invalid precision. Expected an integer between 0 and 15.');
  });
});
