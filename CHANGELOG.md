# Changelog

All notable changes to Divisor will be documented in this file.

> **NOTE**: The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
> and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
> Major and Minor updates will get entries, patches may not get mentions.

## [1.0.1] - 2023/07/29

### Changed

- Trivial margin/padding updates to make more compact on mobile.

### Fixed

- Mobile keyboard actually allows decimal.

## [1.0.0] - 2023/07/29

### Changed

- Enabled divisor selection, default value is `1/16`. When divisor is changed, input fields are cleared.

### Added

- Input validation: limited to 4 decimal places, numbers, and decimal symbol. comma is replaced with decimal.
- Mobile keyboard for input form.
- Trivial bootstrap asthetic improvements.

### Fixed

- Fraction reduction algorithm: Using greatest common divisor to simplify fractions.
- Input "1." no longer parsed as "0", had to switch from `<input type="numeric">` to `<input type="text">`

## [0.2.0] - 2023/07/23

### Changed

- Bootstrap input-group-append classes made equal width

### Added

- 3 digit precision applied to unit conversions (input side of application)
- For a a fixed divisor, `8`, the tool dynamically **rounds up** each input field to the nearest $`\frac{1}{8}`$ of an inch.
  - Fractions are reduced if denominator divides evenly into denominator, i.e. no remainder.
  - If rounding to nearest divisor yields a fraction of $`\frac{1}{1}`$, the whole number is incremented by 1 and fraction removed from display.

## [0.1.0] - 2023/07/20

### Changed

- Thanks to https://github.com/facebook/create-react-app/, I was able to focus solely on the react application. This changed the tech stack to pure `Javascript` (`ES6`), with `Bootstrap` + `Fontawesome` on the front-end
  - `npm start` calls [`react-scripts start`](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/start.js), which leverages the npm package `webpack-dev-server`. I had a hunch in [e194a79](https://github.com/brio50/divisor/commit/e194a79bc3c39df04ff5f0c92f50a1a0260dfa35) that my initial back-end choice was in conflict with the webpack framework.
- Back to github for hosting, thanks to the package `gh-pages`: https://brio50.github.io/divisor/

### Added

- Selectable input for divisor values (not wired connected yet)
- Dynamic input fields and working unit conversions between `mm`,`in`, and `ft`; Task #1 of [issue #3](https://github.com/brio50/divisor/issues/3) completed.

## [0.0.0] - 2023/07/16

### Added

- Tech stack working locally to serve static "Hello, World!" and dynamic React component.
  - Front-End: `Jinja2` + `Bootstrap` + `Fontawesome`
  - Back-End: `Python3`, `Flask`/`Gunicorn`, `React`, `Webpack`, `Babel`
- See [Issue #2](https://github.com/brio50/divisor/issues/2) for deployment notes for ~~https://divisor.onrender.com/~~
