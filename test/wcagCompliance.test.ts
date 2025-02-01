import { passesWCAG } from '../src';

describe('WCAG Compliance Tests', () => {
  test('Contrast ratio 2 should be Not WCAG Compliant', () => {
    expect(passesWCAG(2)).toEqual('Not WCAG Compliant');
  });

  test('Contrast ratio 3 should be WCAG 2 AA Compliant Large Text', () => {
    expect(passesWCAG(3)).toEqual('WCAG 2 AA Compliant Large Text');
  });

  test('Contrast ratio 4.5 should be WCAG 2 AAA Compliant Large Text', () => {
    expect(passesWCAG(4.5)).toEqual('WCAG 2 AAA Compliant Large Text');
  });

  test('Contrast ratio 7 should be WCAG 2 AAA Compliant', () => {
    expect(passesWCAG(7)).toEqual('WCAG 2 AAA Compliant');
  });

  test('Contrast ratio 10 should be WCAG 2 AAA Compliant', () => {
    expect(passesWCAG(10)).toEqual('WCAG 2 AAA Compliant');
  });
});
