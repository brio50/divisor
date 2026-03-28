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
  const [lastEdited, setLastEdited] = useState(null);

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
  const onChangeDivisor = (d) => {
    setDivisor(d);
    if (lastEdited === 'mm' && millimeters.input) {
      const val = Number(millimeters.input);
      setMM({ ...millimeters, output: precision(val), error: precision(0) });
      setIN({ ...inches, input: precision(mm2in(val)), output: nearest(mm2in(val), d, 'in'), error: precision(error) });
      setFT({ ...feet, input: precision(in2ft(mm2in(val))), output: nearest(mm2in(val), d, 'ft-in'), error: precision(error) });
    } else if (lastEdited === 'in' && inches.input) {
      const val = Number(inches.input);
      setMM({ ...millimeters, input: precision(in2mm(val)), output: precision(in2mm(val)), error: precision(0) });
      setIN({ ...inches, output: nearest(val, d, 'in'), error: precision(error) });
      setFT({ ...feet, input: precision(in2ft(val)), output: nearest(val, d, 'ft-in'), error: precision(error) });
    } else if (lastEdited === 'ft' && feet.input) {
      const val = Number(feet.input);
      setMM({ ...millimeters, input: precision(in2mm(ft2in(val))), output: precision(in2mm(ft2in(val))), error: precision(0) });
      setIN({ ...inches, input: precision(ft2in(val)), output: nearest(ft2in(val), d, 'in'), error: precision(error) });
      setFT({ ...feet, output: nearest(ft2in(val), d, 'ft-in'), error: precision(error) });
    } else {
      setMM(fields); setIN(fields); setFT(fields);
    }
  };
  const onClear = () => { setMM(fields); setIN(fields); setFT(fields); setLastEdited(null); };
  const onChangeMM = (event) => {
    setLastEdited('mm');
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
    setLastEdited('in');
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
    setLastEdited('ft');
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
  const errValue = Number(inches.error);
  const errDisplay = errValue > 0 ? `+${errValue.toFixed(3)}` : '0.000';

  return (

    <main className="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <label className="form-label">Reset:</label>
            <button className="btn btn-outline-secondary w-100 mb-3" type="button" onClick={onClear}>Clear</button>

            <label className="form-label">Select a Divisor:</label>
            <div className="btn-group w-100 mb-3" role="group" aria-label="Select divisor">
              {[64, 32, 16, 8, 4].map(d => (
                <button
                  key={d}
                  type="button"
                  className={`btn btn-outline-secondary${divisor === d ? ' active' : ''}`}
                  onClick={() => onChangeDivisor(d)}
                >
                  1/{d}
                </button>
              ))}
            </div>

            <label className="form-label">Enter a value or mathematical expression:</label>

            <div className="mt-1 pt-2 pb-3 px-3 rounded bg-light-subtle border">

              <label htmlFor="input-mm" className="form-label">Millimeters</label>
              <div className="input-group measurement-row">
                <input id="input-mm" value={millimeters.input} onChange={onChangeMM} onKeyDown={onKeyDownMM} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 18" />
                <div className="measurement-eq position-relative">
                  <button type="button" onClick={() => evaluateMM(millimeters.input)} className={`btn btn-outline-secondary h-100${mmExpr ? '' : ' invisible'}`} aria-hidden={!mmExpr}>=</button>
                  {millimeters.calcError && (
                    <div className="tooltip bs-tooltip-top show calc-error-tooltip" role="tooltip">
                      <div className="tooltip-arrow" />
                      <div className="tooltip-inner bg-danger">{millimeters.calcError}</div>
                    </div>
                  )}
                </div>
                <span className="input-group-text measurement-output justify-content-end">
                  {millimeters.output} mm
                </span>
              </div>

              <label htmlFor="input-in" className="form-label">Inches</label>
              <div className="input-group measurement-row">
                <input id="input-in" value={inches.input} onChange={onChangeIN} onKeyDown={onKeyDownIN} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 3/4" />
                <div className="measurement-eq position-relative">
                  <button type="button" onClick={() => evaluateIN(inches.input)} className={`btn btn-outline-secondary h-100${inExpr ? '' : ' invisible'}`} aria-hidden={!inExpr}>=</button>
                  {inches.calcError && (
                    <div className="tooltip bs-tooltip-top show calc-error-tooltip" role="tooltip">
                      <div className="tooltip-arrow" />
                      <div className="tooltip-inner bg-danger">{inches.calcError}</div>
                    </div>
                  )}
                </div>
                <span className={`input-group-text measurement-output justify-content-end bg-light${inErr ? ' border-danger-subtle' : ''}`}>
                  {inches.output || 'in'}
                </span>
              </div>

              <label htmlFor="input-ft" className="form-label">Feet</label>
              <div className="input-group measurement-row">
                <input id="input-ft" value={feet.input} onChange={onChangeFT} onKeyDown={onKeyDownFT} type="text" className="form-control" inputMode="decimal" placeholder="e.g. 96/12" />
                <div className="measurement-eq position-relative">
                  <button type="button" onClick={() => evaluateFT(feet.input)} className={`btn btn-outline-secondary h-100${ftExpr ? '' : ' invisible'}`} aria-hidden={!ftExpr}>=</button>
                  {feet.calcError && (
                    <div className="tooltip bs-tooltip-top show calc-error-tooltip" role="tooltip">
                      <div className="tooltip-arrow" />
                      <div className="tooltip-inner bg-danger">{feet.calcError}</div>
                    </div>
                  )}
                </div>
                <span className={`input-group-text measurement-output justify-content-end bg-light${inErr ? ' border-danger-subtle' : ''}`}>
                  {feet.output || 'ft'}
                </span>
              </div>


            </div>

            <div className={`text-center text-md-end small mt-2 rounding-error ${inErr ? 'text-danger' : 'text-secondary'}`} title="Rounding error">
              rounding error: {errDisplay} in
            </div>

          </div>

        </div>

      </div >

    </main >
  );
}

export default App;
