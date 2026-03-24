import './App.css';
import { useState } from 'react';

// TODO: follow style/conventions from https://github.com/airbnb/javascript/tree/master/react

const EXPR_REGEX = /[+\-*/()]/;

function App() {

  //-------------------------------------------------------------------------------------------------------------------//
  // back-end - javascript
  //-------------------------------------------------------------------------------------------------------------------//

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // unit conversions
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  function mm2in(x) { return (x * 0.0393701) };
  function in2mm(x) { return (x / 0.0393701) };
  function ft2in(x) { return (x * 12.0) };
  function in2ft(x) { return (x / 12.0) };

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // greatest common divisor - inputs must be numeric
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  function findGcd(a, b) {
    if (b === 0) {
      return Math.abs(a);
    }
    return findGcd(b, a % b); // recursive call
  };

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // rounding
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  var error = Number(0); // global

  function precision(x) { return (Math.round(x * 1000) / 1000) };
  function round2divisor(x, divisor) { return (Math.ceil(x * divisor) / divisor) };
  function formatError(e) {
    if (!e || e === 0) return '';
    const p = precision(e);
    return p === 0 ? '' : `+${p}`;
  };
  function nearest(value, divisor, option) {
    // Convert value in inches to `# ft #-#/# in` or `#-#/# in`
    // based on specified divisor and option 'ft-in' or 'in' provided.
    // Fractions will be reduced automatically.
    //

    //                                   e.g. value = 16.250 in
    const valueFeet = in2ft(value);                 // 1.354 ft
    const wholeFeet = Math.floor(valueFeet);        // 1 ft

    const valueInch = value - ft2in(wholeFeet);     // 4.250 in
    var wholeInch = Math.floor(valueInch);          // 4 in

    // decimals := digits after the decimal point 
    var decimals = valueInch - wholeInch;           // 0.250 in
    decimals = round2divisor(decimals, divisor);    // (0.250 * 1/8 ) * 8 = 0.25

    // fraction := numerator / denominator )
    var numerator = decimals / (1 / divisor);       // 0.25 * 8 = 2
    var denominator = divisor;                      // = 8

    // reduce fraction based on greatest common denominator
    const gcd = findGcd(Number(numerator), Number(denominator))
    if (!isNaN(gcd)) {
      console.log(`gcd=${gcd} : ${numerator}/${denominator} reduced to ...`)
      numerator = numerator / gcd;
      denominator = denominator / gcd;
    }

    // if rounding to nearest divisor yields a fraction of 1,
    // step whole number and clear numerator/denominator
    if (numerator === denominator) {
      wholeInch = wholeInch + 1;
      denominator = 0;
      numerator = 0;
    }

    // round up, subtract value
    error = (ft2in(wholeFeet) + wholeInch + (denominator !== 0 ? numerator / denominator : 0)) - value;

    console.log(`value = ${value} valueFeet = ${valueFeet} valueInch = ${valueInch} : wholeFeet = ${wholeFeet} wholeInch = ${wholeInch} fraction = ${numerator}/${denominator}, error = ${error}`)

    // format output strings
    switch (option) {

      case 'ft-in':
        if (numerator === 0) {
          return `${wholeFeet} ft ${wholeInch} in`;
        }
        else {
          return `${wholeFeet} ft ${wholeInch}-${numerator}/${denominator} in`;
        }

      case 'in':
        if (numerator === 0) {
          return `${ft2in(wholeFeet) + wholeInch} in`;
        }
        else {
          return `${ft2in(wholeFeet) + wholeInch}-${numerator}/${denominator} in`;
        }

      default:
        console.log(`Option may only be 'ft-in' or 'in', user chose '${option}'`)
    }

  }

  //-------------------------------------------------------------------------------------------------------------------//
  // front-end - javascript
  //-------------------------------------------------------------------------------------------------------------------//

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // initialize
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  // react Hook for state management - one per html tag
  const [divisor, setDivisor] = useState(16); // default value
  const fields = { input: [], output: '', error: [], calcError: '' } // global
  const [millimeters, setMM] = useState(fields);
  const [inches, setIN] = useState(fields);
  const [feet, setFT] = useState(fields);

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // validate
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  function evaluateExpression(str) {
    if (!str || !/^[\d\s.+\-*/()]+$/.test(str)) return { error: 'Invalid expression' };
    try {
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + str + ')')();
      if (!isFinite(result) || isNaN(result)) return { error: 'Cannot divide by zero' };
      if (result < 0) return { error: 'Result must be positive' };
      return { value: result };
    } catch (e) {
      return { error: 'Invalid expression' };
    }
  }

  function validateMeasurement(event) {
    var value = event.target.value;
    function parseValue(value) {

      // do not allow null OR space
      if ( !value || value.match(/\s/) ) {
        return "";
      }

      // do not allow leading decimal, comma, or non-numeric
      if ( value.match(/^(\.|,|[^0-9])/) ) {
        value = "0.";
      }

      // limit input to *(.|,)#### (4 decimal places)
      // does not allow letters, or any symbols other than . or ,
      const regex = /\d+(\.|,){0,1}\d{0,4}/s;

      if ( value.match(regex)[0] ) {
        return value.match(regex)[0].replace(/,/, ".");
      }

    }
    return (parseValue(value));
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // update 
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  // TODO: consider useReducer instead of useState and spread operator (...)
  const onChangeSelect = (event) => {
    const value = event.target.value;
    setDivisor(value);
    // we don't know which input field should be used at divisor selector change
    // so clear all measurement input fields when divisor is updated
    setMM(fields);
    setIN(fields);
    setFT(fields);
  };
  const onChangeMM = (event) => {
    const rawValue = event.target.value;

    if (EXPR_REGEX.test(rawValue)) {
      setMM({ ...millimeters, input: rawValue, output: '', calcError: '' });
      return;
    }

    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: value,
      output: precision(value),
      error: precision(0)
    });

    setIN({
      ...inches,
      input: precision(mm2in(value)),
      output: nearest(mm2in(value), divisor, 'in'),
      error: precision(error)
    });

    setFT({
      ...feet,
      input: precision(in2ft(mm2in(value))),
      output: nearest(mm2in(value), divisor, 'ft-in'),
      error: precision(error)
    });
  };
  const makeEvaluator = (setField, fieldState, onChange) => (value) => {
    const outcome = evaluateExpression(value);
    if ('error' in outcome) {
      setField({ ...fieldState, input: value, output: '', calcError: outcome.error });
    } else {
      onChange({ target: { value: String(outcome.value) } });
    }
  };
  const makeKeyDown = (evaluator) => (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    evaluator(event.target.value);
  };
  const evaluateMM = makeEvaluator(setMM, millimeters, onChangeMM);
  const onKeyDownMM = makeKeyDown(evaluateMM);
  const onChangeIN = (event) => {
    const rawValue = event.target.value;

    if (EXPR_REGEX.test(rawValue)) {
      setIN({ ...inches, input: rawValue, output: '', calcError: '' });
      return;
    }

    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: precision(in2mm(value)),
      output: precision(in2mm(value)),
      error: precision(error)
    });

    setIN({
      ...inches,
      input: value,
      output: nearest(value, divisor, 'in'),
      error: precision(error)
    });

    setFT({
      ...feet,
      input: precision(in2ft(value)),
      output: nearest(value, divisor, 'ft-in'),
      error: precision(error)
    });
  };
  const evaluateIN = makeEvaluator(setIN, inches, onChangeIN);
  const onKeyDownIN = makeKeyDown(evaluateIN);
  const onChangeFT = (event) => {
    const rawValue = event.target.value;

    if (EXPR_REGEX.test(rawValue)) {
      setFT({ ...feet, input: rawValue, output: '', calcError: '' });
      return;
    }

    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: precision(in2mm(ft2in(value))),
      output: precision(in2mm(ft2in(value))),
      error: precision(error)
    });

    setIN({
      ...inches,
      input: precision(ft2in(value)),
      output: nearest(ft2in(value), divisor, 'in'),
      error: precision(error)
    });

    setFT({
      ...feet,
      input: value,
      output: nearest(ft2in(value), divisor, 'ft-in'),
      error: precision(error)
    });
  };
  const evaluateFT = makeEvaluator(setFT, feet, onChangeFT);
  const onKeyDownFT = makeKeyDown(evaluateFT);

  //-------------------------------------------------------------------------------------------------------------------//
  // front-end - html
  //-------------------------------------------------------------------------------------------------------------------//

  const mmExpr = EXPR_REGEX.test(millimeters.input);
  const inExpr = EXPR_REGEX.test(inches.input);
  const ftExpr = EXPR_REGEX.test(feet.input);
  const inErr = formatError(inches.error);
  const ftErr = formatError(feet.error);

  return (

    <main className="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <label htmlFor="input-divisor" className="form-label">Select a Divisor:</label>
            <div className="input-group">
              <select id="input-divisor" className="form-select align-middle mb-3" aria-label="divisor" value={divisor || '16'} onChange={onChangeSelect} >
                <option value="64">1/64</option>
                <option value="32">1/32</option>
                <option value="16">1/16</option>
                <option value="8">1/8</option>
                <option value="4">1/4</option>
              </select>
            </div>

            <label className="form-label mt-2">Enter a value or mathematical expression:</label>

            <div className="mt-1 pt-2 pb-3 px-3 rounded bg-light-subtle border">

              <label htmlFor="input-mm" className="form-label">Millimeters</label>
              <div className="input-group" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(min-content, 1fr)' }}>
                <input id="input-mm" value={millimeters.input} onChange={onChangeMM} onKeyDown={onKeyDownMM} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 18" style={{ width: '100%' }} />
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-outline-secondary h-100" type="button" onClick={() => evaluateMM(millimeters.input)} style={{ visibility: mmExpr ? 'visible' : 'hidden' }}>=</button>
                  {millimeters.calcError && (
                    <div className="tooltip bs-tooltip-top show" role="tooltip" style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                      <div className="tooltip-arrow" style={{ left: '50%', transform: 'translateX(-50%)' }} />
                      <div className="tooltip-inner bg-danger">{millimeters.calcError}</div>
                    </div>
                  )}
                </div>
                <span className="input-group-text" style={{ justifyContent: 'flex-end' }}>
                  {millimeters.output} mm
                </span>
              </div>

              <label htmlFor="input-in" className="form-label">Inches</label>
              <div className="input-group" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(min-content, 1fr)' }}>
                <input id="input-in" value={inches.input} onChange={onChangeIN} onKeyDown={onKeyDownIN} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 3/4" style={{ width: '100%' }} />
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-outline-secondary h-100" type="button" onClick={() => evaluateIN(inches.input)} style={{ visibility: inExpr ? 'visible' : 'hidden' }}>=</button>
                  {inches.calcError && (
                    <div className="tooltip bs-tooltip-top show" role="tooltip" style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                      <div className="tooltip-arrow" style={{ left: '50%', transform: 'translateX(-50%)' }} />
                      <div className="tooltip-inner bg-danger">{inches.calcError}</div>
                    </div>
                  )}
                </div>
                <span className="input-group-text" style={{ justifyContent: 'flex-end' }}>
                  {inches.output || 'in'}
                  <span className="badge bg-secondary ms-2" title="Rounding error" style={{ visibility: inErr ? 'visible' : 'hidden', minWidth: '3.5rem' }}>{inErr}</span>
                </span>
              </div>

              <label htmlFor="input-ft" className="form-label">Feet</label>
              <div className="input-group" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(min-content, 1fr)' }}>
                <input id="input-ft" value={feet.input} onChange={onChangeFT} onKeyDown={onKeyDownFT} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 96/12" style={{ width: '100%' }} />
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-outline-secondary h-100" type="button" onClick={() => evaluateFT(feet.input)} style={{ visibility: ftExpr ? 'visible' : 'hidden' }}>=</button>
                  {feet.calcError && (
                    <div className="tooltip bs-tooltip-top show" role="tooltip" style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                      <div className="tooltip-arrow" style={{ left: '50%', transform: 'translateX(-50%)' }} />
                      <div className="tooltip-inner bg-danger">{feet.calcError}</div>
                    </div>
                  )}
                </div>
                <span className="input-group-text" style={{ justifyContent: 'flex-end' }}>
                  {feet.output || 'ft'}
                  <span className="badge bg-secondary ms-2" title="Rounding error" style={{ visibility: ftErr ? 'visible' : 'hidden', minWidth: '3.5rem' }}>{ftErr}</span>
                </span>
              </div>

            </div>


          </div>

        </div>

      </div >

    </main >
  );
}

export default App;
