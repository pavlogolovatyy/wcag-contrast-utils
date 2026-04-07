import { describe, expect, test } from 'vitest';

import { getWCAGCompliance, meetsWCAG, passesWCAG } from '../src';

describe('WCAG Compliance Tests', () => {
  test('Contrast ratio 2 should be Not WCAG Compliant', () => {
    expect(passesWCAG(2)).toEqual('Not WCAG 2.1 contrast compliant');
  });

  test('Contrast ratio 3 should be WCAG 2 AA Compliant Large Text', () => {
    expect(passesWCAG(3)).toEqual('WCAG 2.1 AA compliant for large text');
  });

  test('Contrast ratio 4.5 should be WCAG 2 AAA Compliant Large Text', () => {
    expect(passesWCAG(4.5)).toEqual(
      'WCAG 2.1 AA compliant for normal text and AAA compliant for large text'
    );
  });

  test('Contrast ratio 7 should be WCAG 2 AAA Compliant', () => {
    expect(passesWCAG(7)).toEqual(
      'WCAG 2.1 AA and AAA compliant for normal and large text'
    );
  });

  test('Contrast ratio 10 should be WCAG 2 AAA Compliant', () => {
    expect(passesWCAG(10)).toEqual(
      'WCAG 2.1 AA and AAA compliant for normal and large text'
    );
  });

  test('Returns structured compliance details from a contrast ratio', () => {
    expect(getWCAGCompliance(4.5)).toEqual({
      contrastRatio: 4.5,
      summary:
        'WCAG 2.1 AA compliant for normal text and AAA compliant for large text',
      aa: {
        normalText: true,
        largeText: true,
      },
      aaa: {
        normalText: false,
        largeText: true,
      },
    });
  });

  test('Returns structured compliance details directly from two colors', () => {
    expect(getWCAGCompliance('#000000', '#ffffff')).toEqual({
      contrastRatio: 21,
      summary: 'WCAG 2.1 AA and AAA compliant for normal and large text',
      aa: {
        normalText: true,
        largeText: true,
      },
      aaa: {
        normalText: true,
        largeText: true,
      },
    });
  });

  test('Checks specific WCAG targets', () => {
    expect(meetsWCAG(4.5, 'AA', 'normal')).toBe(true);
    expect(meetsWCAG(4.5, 'AAA', 'normal')).toBe(false);
    expect(meetsWCAG(4.5, 'AAA', 'large')).toBe(true);
  });

  test('Throws on invalid contrast ratio input', () => {
    expect(() => passesWCAG(0.8)).toThrow(
      'Invalid contrast ratio. Expected a finite number greater than or equal to 1.'
    );
  });
});
