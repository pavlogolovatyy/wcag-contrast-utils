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
    expect(contrastRatio('#ff0000', '#00ff00')).toBeCloseTo(2.91);
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
    expect(contrastRatio([255, 0, 0], [0, 255, 0])).toBeCloseTo(2.91);
  });

  it('Contrast ratio white and white', () => {
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBeCloseTo(1);
  });

  it('Contrast ratio black and black', () => {
    expect(contrastRatio([0, 0, 0], [0, 0, 0])).toBeCloseTo(1);
  });
});
