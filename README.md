# WCAG Contrast Utils

Lightweight TypeScript utilities for computing color contrast ratios and evaluating WCAG 2.1 text contrast requirements.

## Why this package

- Strict color input validation for safer production use
- Accurate contrast calculation without forced rounding
- Clear WCAG compliance summaries for normal and large text
- Small API surface that works well in apps, design tooling, and CI checks
- Modern toolchain with `tsdown`, `Vitest`, ESLint flat config, and package validation

## Installation

```sh
npm install wcag-contrast-utils
```

## Quick start

```ts
import {
  contrastRatio,
  getWCAGCompliance,
  meetsWCAG,
} from 'wcag-contrast-utils';

const ratio = contrastRatio('#1f2937', '#ffffff');
const roundedRatio = contrastRatio('#1f2937', '#ffffff', { precision: 2 });
const compliance = getWCAGCompliance('#1f2937', '#ffffff');

console.log(ratio);
console.log(roundedRatio);
console.log(compliance.summary);
console.log(meetsWCAG(ratio, 'AA', 'normal'));
```

## API

### `contrastRatio(color1, color2, options?)`

Returns the WCAG contrast ratio between two colors.

- Accepts `#RGB`, `#RRGGBB`, `RGB`, or `RRGGBB`
- Accepts RGB tuples such as `[255, 255, 255]`
- Returns the exact ratio by default
- Supports optional display rounding via `{ precision: number }`

```ts
contrastRatio('#000000', '#ffffff'); // 21
contrastRatio('#777777', '#ffffff'); // 4.478089453577214
contrastRatio('#777777', '#ffffff', { precision: 2 }); // 4.48
```

### `getWCAGCompliance(contrast)` or `getWCAGCompliance(color1, color2)`

Returns a structured result with detailed AA and AAA coverage.

```ts
const compliance = getWCAGCompliance(4.5);

console.log(compliance.summary);
// WCAG 2.1 AA compliant for normal text and AAA compliant for large text

console.log(compliance.aa.normalText); // true
console.log(compliance.aaa.normalText); // false
```

### `meetsWCAG(contrast, level?, textSize?)`

Checks a specific WCAG target.

```ts
meetsWCAG(4.5, 'AA', 'normal'); // true
meetsWCAG(4.5, 'AAA', 'normal'); // false
meetsWCAG(4.5, 'AAA', 'large'); // true
```

### `passesWCAG(contrast)`

Returns a human-readable compliance summary.

```ts
passesWCAG(3); // "WCAG 2.1 AA compliant for large text"
```

## WCAG 2.1 text contrast thresholds

- `AA normal text`: `4.5:1`
- `AA large text`: `3:1`
- `AAA normal text`: `7:1`
- `AAA large text`: `4.5:1`

## Validation behavior

The package throws descriptive errors when:

- A HEX color is not 3 or 6 digits
- An RGB tuple does not contain exactly 3 channels
- An RGB channel is outside the `0-255` range
- A contrast ratio or precision value is invalid

## Development

Use Node.js `22` or newer for local development.

```sh
npm run validate
```

This runs linting, type-checking, tests, package validation, the production build, and the bundle size check.

Useful commands:

```sh
npm run dev
npm run test:watch
npm run pack:check
```

## Releases

- Configure npm Trusted Publishing for this repository and point it to `release.yml`
- Bump `package.json` to the target version
- Push a matching tag such as `v1.0.2` or `v1.1.0-beta.0`
- The release workflow validates the package, publishes to npm, and creates a GitHub Release automatically
- Stable tags publish to `latest`; prerelease tags publish to `next`

## License

MIT
