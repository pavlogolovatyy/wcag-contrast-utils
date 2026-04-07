export type RgbColor = readonly [number, number, number];
export type ColorInput = string | RgbColor;
export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

export interface ContrastRatioOptions {
  precision?: number;
}

export interface WCAGComplianceResult {
  contrastRatio: number;
  summary: string;
  aa: {
    normalText: boolean;
    largeText: boolean;
  };
  aaa: {
    normalText: boolean;
    largeText: boolean;
  };
}

const HEX_COLOR_PATTERN = /^[0-9a-f]{3}([0-9a-f]{3})?$/i;
const RGB_CHANNEL_MIN = 0;
const RGB_CHANNEL_MAX = 255;
const AA_NORMAL_TEXT_RATIO = 4.5;
const AA_LARGE_TEXT_RATIO = 3;
const AAA_NORMAL_TEXT_RATIO = 7;
const AAA_LARGE_TEXT_RATIO = 4.5;

export const WCAG_CONTRAST_REQUIREMENTS = Object.freeze({
  AA: Object.freeze({
    normal: AA_NORMAL_TEXT_RATIO,
    large: AA_LARGE_TEXT_RATIO,
  }),
  AAA: Object.freeze({
    normal: AAA_NORMAL_TEXT_RATIO,
    large: AAA_LARGE_TEXT_RATIO,
  }),
});

function hexToRgb(hex: string): [number, number, number] {
  const normalizedHex = hex.trim().replace(/^#/, '');

  if (!HEX_COLOR_PATTERN.test(normalizedHex)) {
    throw new Error(
      'Invalid HEX color. Use a 3 or 6 digit hexadecimal string.'
    );
  }

  const expandedHex =
    normalizedHex.length === 3
      ? normalizedHex
          .split('')
          .map(channel => channel + channel)
          .join('')
      : normalizedHex;

  const numericValue = Number.parseInt(expandedHex, 16);

  return [
    (numericValue >> 16) & RGB_CHANNEL_MAX,
    (numericValue >> 8) & RGB_CHANNEL_MAX,
    numericValue & RGB_CHANNEL_MAX,
  ];
}

function normalizeRgbChannel(channel: number, index: number): number {
  if (
    !Number.isInteger(channel) ||
    channel < RGB_CHANNEL_MIN ||
    channel > RGB_CHANNEL_MAX
  ) {
    throw new Error(
      'Invalid RGB color. Each channel must be an integer between 0 and 255. ' +
        `Received ${channel} at index ${index}.`
    );
  }

  return channel;
}

function normalizeRgbColor(rgbColor: RgbColor): [number, number, number] {
  if (rgbColor.length !== 3) {
    throw new Error('Invalid RGB color. Expected exactly 3 channels.');
  }

  return [
    normalizeRgbChannel(rgbColor[0], 0),
    normalizeRgbChannel(rgbColor[1], 1),
    normalizeRgbChannel(rgbColor[2], 2),
  ];
}

function parseColor(color: ColorInput): [number, number, number] {
  return typeof color === 'string' ? hexToRgb(color) : normalizeRgbColor(color);
}

function luminanceChannel(channel: number): number {
  const normalizedChannel = channel / RGB_CHANNEL_MAX;

  return normalizedChannel <= 0.03928
    ? normalizedChannel / 12.92
    : Math.pow((normalizedChannel + 0.055) / 1.055, 2.4);
}

function luminance([red, green, blue]: [number, number, number]): number {
  return (
    luminanceChannel(red) * 0.2126 +
    luminanceChannel(green) * 0.7152 +
    luminanceChannel(blue) * 0.0722
  );
}

function validateContrastRatioValue(contrast: number): number {
  if (!Number.isFinite(contrast) || contrast < 1) {
    throw new Error(
      'Invalid contrast ratio. Expected a finite number greater than or equal to 1.'
    );
  }

  return contrast;
}

function applyPrecision(value: number, precision?: number): number {
  if (precision === undefined) {
    return value;
  }

  if (!Number.isInteger(precision) || precision < 0 || precision > 15) {
    throw new Error('Invalid precision. Expected an integer between 0 and 15.');
  }

  return Number(value.toFixed(precision));
}

function getContrastRatioValue(color1: ColorInput, color2: ColorInput): number {
  const luminance1 = luminance(parseColor(color1));
  const luminance2 = luminance(parseColor(color2));
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function createComplianceSummary(contrast: number): string {
  if (contrast >= AAA_NORMAL_TEXT_RATIO) {
    return 'WCAG 2.1 AA and AAA compliant for normal and large text';
  }

  if (contrast >= AA_NORMAL_TEXT_RATIO) {
    return 'WCAG 2.1 AA compliant for normal text and AAA compliant for large text';
  }

  if (contrast >= AA_LARGE_TEXT_RATIO) {
    return 'WCAG 2.1 AA compliant for large text';
  }

  return 'Not WCAG 2.1 contrast compliant';
}

function resolveContrastRatio(
  contrastOrColor1: number | ColorInput,
  color2?: ColorInput
): number {
  if (typeof contrastOrColor1 === 'number') {
    return validateContrastRatioValue(contrastOrColor1);
  }

  if (color2 === undefined) {
    throw new Error(
      'A second color is required when checking compliance from color inputs.'
    );
  }

  return getContrastRatioValue(contrastOrColor1, color2);
}

export function contrastRatio(
  color1: ColorInput,
  color2: ColorInput,
  options: ContrastRatioOptions = {}
): number {
  return applyPrecision(
    getContrastRatioValue(color1, color2),
    options.precision
  );
}

export function getWCAGCompliance(contrast: number): WCAGComplianceResult;
export function getWCAGCompliance(
  color1: ColorInput,
  color2: ColorInput
): WCAGComplianceResult;
export function getWCAGCompliance(
  contrastOrColor1: number | ColorInput,
  color2?: ColorInput
): WCAGComplianceResult {
  const ratio = resolveContrastRatio(contrastOrColor1, color2);

  return {
    contrastRatio: ratio,
    summary: createComplianceSummary(ratio),
    aa: {
      normalText: ratio >= AA_NORMAL_TEXT_RATIO,
      largeText: ratio >= AA_LARGE_TEXT_RATIO,
    },
    aaa: {
      normalText: ratio >= AAA_NORMAL_TEXT_RATIO,
      largeText: ratio >= AAA_LARGE_TEXT_RATIO,
    },
  };
}

export function meetsWCAG(
  contrast: number,
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): boolean {
  const compliance = getWCAGCompliance(contrast);

  if (level === 'AAA') {
    return textSize === 'large'
      ? compliance.aaa.largeText
      : compliance.aaa.normalText;
  }

  return textSize === 'large'
    ? compliance.aa.largeText
    : compliance.aa.normalText;
}

export function passesWCAG(contrast: number): string {
  return getWCAGCompliance(contrast).summary;
}
