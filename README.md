# WCAG Contrast Utils

## Description

WCAG Contrast Utils is a TypeScript library for calculating the contrast ratio between two colors and checking whether it meets WCAG 2.1 accessibility standards.

This library is useful for developers and designers who want to ensure that their websites or applications comply with accessibility standards, improving readability and usability for all users, including those with visual impairments.

## Installation

You can install the library via npm or yarn:

```sh
npm install wcag-contrast-utils
```

or

```sh
yarn add wcag-contrast-utils
```

## Usage

### Importing

```typescript
import { contrastRatio, passesWCAG } from "wcag-contrast-utils";
```

### Calculating Contrast Ratio

The `contrastRatio` function calculates the contrast ratio between two colors, which can be provided as hexadecimal strings or RGB arrays.

```typescript
const ratio1 = contrastRatio("#000000", "#ffffff"); // 21
const ratio2 = contrastRatio([0, 0, 0], [255, 255, 255]); // 21
const ratio3 = contrastRatio("#777777", "#ffffff"); // 4.47
```

### Checking WCAG Compliance

The `passesWCAG` function takes a contrast ratio value and returns the highest WCAG compliance level met.

```typescript
console.log(passesWCAG(2));   // "Not WCAG Compliant"
console.log(passesWCAG(3));   // "WCAG 2 AA Compliant Large Text"
console.log(passesWCAG(4.5)); // "WCAG 2 AAA Compliant Large Text"
console.log(passesWCAG(7));   // "WCAG 2 AAA Compliant"
```

## WCAG 2.1 - Contrast Requirements

According to WCAG 2.1 guidelines, the required contrast ratios are:

- **AA (Normal text)**: 4.5:1
- **AA (Large text)**: 3:1
- **AAA (Normal text)**: 7:1
- **AAA (Large text)**: 4.5:1

## Contributing

If you want to contribute to the project, feel free to open an issue or submit a pull request!

## License

This project is released under the MIT license.