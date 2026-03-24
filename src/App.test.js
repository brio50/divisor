import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// ------------------------------------------------------------
// [Req 0] App existence
// ------------------------------------------------------------

test('[Req 0] App renders without crashing', () => {
  render(<App />);
});

// ------------------------------------------------------------
// [Req 1] Metric <-> imperial conversion
// REQUIREMENTS.csv Req 1 (Tier B): convert metric to imperial
// ------------------------------------------------------------

test('[Req 1] 25.4 mm converts to 1 inch (mm → in)', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Millimeters'), { target: { value: '25.4' } });
  expect(screen.getByLabelText('Inches').value).toBe('1');
});

test('[Req 1] 1 inch converts to 25.4 mm (in → mm)', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '1' } });
  expect(screen.getByLabelText('Millimeters').value).toBe('25.4');
});

test('[Req 1] 1 foot converts to 12 inches (ft → in)', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Feet'), { target: { value: '1' } });
  expect(screen.getByLabelText('Inches').value).toBe('12');
});

test('[Req 1] 12 inches converts to 1 foot (in → ft)', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '12' } });
  expect(screen.getByLabelText('Feet').value).toBe('1');
});

// ------------------------------------------------------------
// [Req 2] Round decimal inches to nearest fraction
// REQUIREMENTS.csv Req 2 (Tier B): round decimal values to
// the nearest fraction of an inch
// ------------------------------------------------------------

test('[Req 2] 1.5 in rounds to "1-1/2 in" with 1/16 divisor', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '1.5' } });
  expect(screen.getAllByText(/1-1\/2 in/).length).toBeGreaterThan(0);
});

test('[Req 2] 0.25 in rounds to "0-1/4 in" with 1/4 divisor', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '0.25' } });
  expect(screen.getAllByText(/0-1\/4 in/).length).toBeGreaterThan(0);
});

test('[Req 2] 0.015 in rounds to "0-1/64 in" with 1/64 divisor', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '64' } });
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '0.015' } });
  expect(screen.getAllByText(/0-1\/64 in/).length).toBeGreaterThan(0);
});

// ------------------------------------------------------------
// [Req 3] Round decimal to nearest fraction in ft+in format
// REQUIREMENTS.csv Req 3 (Tier B): round decimal values to
// the nearest fraction of a foot+inch
// ------------------------------------------------------------

test('[Req 3] 16.25 in shows as "1 ft 4-1/4 in" with 1/8 divisor', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '8' } });
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '16.25' } });
  expect(screen.getByText(/1 ft 4-1\/4 in/)).toBeInTheDocument();
});

test('[Req 3] 13 in shows as "1 ft 1 in" with 1/16 divisor (no fraction when exact)', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '13' } });
  expect(screen.getByText(/1 ft 1 in/)).toBeInTheDocument();
});

// ------------------------------------------------------------
// [Req 4] Divisor options
// REQUIREMENTS.csv Req 4 (Tier C): offer even-numbered divisors
// 1/64, 1/32, 1/16, 1/8, 1/4
// ------------------------------------------------------------

test('[Req 4] Divisor selector offers exactly 1/64, 1/32, 1/16, 1/8, 1/4', () => {
  render(<App />);
  const select = screen.getByRole('combobox');
  const options = Array.from(select.options).map(o => o.text);
  expect(options).toEqual(['1/64', '1/32', '1/16', '1/8', '1/4']);
});

test('[Req 4] Default divisor is 1/16', () => {
  render(<App />);
  expect(screen.getByRole('combobox').value).toBe('16');
});

// ------------------------------------------------------------
// [Req 5] Auto divisor — NOT YET IMPLEMENTED
// REQUIREMENTS.csv Req 5 (Tier C): offer an auto divisor
// ------------------------------------------------------------

test.skip('[Req 5] Auto divisor option is not yet implemented', () => {});

// ------------------------------------------------------------
// [Req 10] Deployed as a website
// REQUIREMENTS.csv Req 10 (Tier B): deployed as a website
// Verified by the GitHub Actions deploy job succeeding — no
// unit test can assert a live deployment.
// ------------------------------------------------------------

test('[Req 10] Build prerequisite: app renders a root element', () => {
  render(<App />);
  expect(document.querySelector('main')).toBeInTheDocument();
});

// ------------------------------------------------------------
// [Req 11] Responsive layout
// REQUIREMENTS.csv Req 11 (Tier C): responsive on mobile and desktop
// Bootstrap's grid system (container/row/col) handles responsiveness
// by convention — no JS logic to unit test.
// ------------------------------------------------------------

test('[Req 11] Bootstrap responsive grid classes are present', () => {
  render(<App />);
  expect(document.querySelector('.container')).toBeInTheDocument();
  expect(document.querySelector('.row')).toBeInTheDocument();
  expect(document.querySelector('.col')).toBeInTheDocument();
});

// ------------------------------------------------------------
// [Req 12] Mobile numeric keyboard
// REQUIREMENTS.csv Req 12 (Tier D): mobile users can input
// values with numeric keyboard
// ------------------------------------------------------------

test('[Req 12] All input fields use inputMode="decimal" for mobile keyboard', () => {
  render(<App />);
  expect(screen.getByLabelText('Millimeters')).toHaveAttribute('inputMode', 'decimal');
  expect(screen.getByLabelText('Inches')).toHaveAttribute('inputMode', 'decimal');
  expect(screen.getByLabelText('Feet')).toHaveAttribute('inputMode', 'decimal');
});

// ------------------------------------------------------------
// [Req 13] Dynamic interactions
// REQUIREMENTS.csv Req 13 (Tier C): dynamic interactions —
// any input change immediately updates all other fields
// ------------------------------------------------------------

test('[Req 13] Typing mm immediately updates inches and feet fields', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Millimeters'), { target: { value: '25.4' } });
  expect(screen.getByLabelText('Inches').value).not.toBe('');
  expect(screen.getByLabelText('Feet').value).not.toBe('');
});

test('[Req 13] Typing inches immediately updates mm and feet fields', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Inches'), { target: { value: '6' } });
  expect(screen.getByLabelText('Millimeters').value).not.toBe('');
  expect(screen.getByLabelText('Feet').value).not.toBe('');
});

test('[Req 13] Typing feet immediately updates mm and inches fields', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Feet'), { target: { value: '1' } });
  expect(screen.getByLabelText('Millimeters').value).not.toBe('');
  expect(screen.getByLabelText('Inches').value).not.toBe('');
});

test('[Req 13] Changing divisor clears all measurement fields', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Millimeters'), { target: { value: '25.4' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '8' } });
  expect(screen.getByLabelText('Millimeters').value).toBe('');
  expect(screen.getByLabelText('Inches').value).toBe('');
  expect(screen.getByLabelText('Feet').value).toBe('');
});
