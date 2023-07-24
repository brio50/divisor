import './App.css';
import { useState } from "react";

// TODO: follow style/conventions from https://github.com/airbnb/javascript/tree/master/react

function App() {

  // TODO: allow user selected input
  const [divisor, setDivisor] = useState({});

  const onChangeSelect = (event) => {
    var divisor = event.target.value;
    setDivisor(divisor);
  };

  // unit conversions
  function mm2in(x) { return (x * 0.0393701) };
  function in2mm(x) { return (x / 0.0393701) };
  function ft2in(x) { return (x * 12.0) };
  function in2ft(x) { return (x / 12.0) };

  // greatest common divisor - inputs must be numeric
  function findGcd(a, b) {
    if (b === 0) {
      return Math.abs(a);
    }
    return findGcd(b, a % b); // recursive call
  };

  // rounding
  function precision(x) { return (Math.round(x * 1000) / 1000) };
  function round2divisor(x, divisor) { return (Math.ceil(x * divisor) / divisor) };
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

    // if rounding to nearest divisor yields a fraction of 1, 
    // step whole number and clear numerator/denominator
    if (Object.is(numerator, denominator)) {
      wholeInch = wholeInch + 1;
      denominator = 0;
      numerator = 0;
    }

    // reduce fraction based on greatest common denominator
    const gcd = findGcd(Number(numerator), Number(denominator))
    if (!isNaN(gcd)) {
      console.log(`gcd=${gcd} : ${numerator}/${denominator} reduced to ...`)
      numerator = numerator / gcd;
      denominator = denominator / gcd;
    }

    console.log(`value = ${value} valueFeet = ${valueFeet} valueInch = ${valueInch} : wholeFeet = ${wholeFeet} wholeInch = ${wholeInch} fraction = ${numerator}/${denominator}`)

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

  const fields = { input: [], output: '' }

  // react Hook for state management
  const [millimeters, setMM] = useState(fields);
  const [inches, setIN] = useState(fields);
  const [feet, setFT] = useState(fields);

  // validate divisor input
  function validateDivisor(divisor) {
    if (isNaN(divisor)) {
      alert(`Please enter a divisor!`)
      return 1; // exit code
    }
    else {
      return 0; // exit code
    }
  }

  // validate measurement input
  // TODO: only allow numeric inputs (error on A-B, a-b, multiple decimals)
  // TODO: mathematical expressions (only allow +, -, *, / symbols) keyed on = as input?
  function validateMeasurement(event) {
    const value = event.target.value;
    function parseValue(value) {
      // limit input to *(.|,)#### (4 decimal places)
      const regex = /([0-9]*[.|,]{0,1}[0-9]{0,4})/s;
      return value.match(regex)[0];
    }
    return (parseValue(value));
  }

  // TODO: consider useReducer instead of useState and spread operator (...)
  const onChangeMM = (event) => {

    if (validateDivisor(divisor)) { return; }
    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: value,
      output: precision(value)
    });

    setIN({
      ...inches,
      input: precision(mm2in(value)),
      output: nearest(mm2in(value), divisor, 'in')
    });

    setFT({
      ...feet,
      input: precision(in2ft(mm2in(value))),
      output: nearest(mm2in(value), divisor, 'ft-in')
    });
  };

  const onChangeIN = (event) => {

    if (validateDivisor(divisor)) { return; }
    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: precision(in2mm(value)),
      output: precision(in2mm(value))
    });

    setIN({
      ...inches,
      input: value,
      output: nearest(value, divisor, 'in')
    });

    setFT({
      ...feet,
      input: precision(in2ft(value)),
      output: nearest(value, divisor, 'ft-in')
    });
  };

  const onChangeFT = (event) => {

    if (validateDivisor(divisor)) { return; }
    const value = validateMeasurement(event)

    setMM({
      ...millimeters,
      input: precision(in2mm(ft2in(value))),
      output: precision(in2mm(ft2in(value)))
    });

    setIN({
      ...inches,
      input: precision(ft2in(value)),
      output: nearest(ft2in(value), divisor, 'in')
    });

    setFT({
      ...feet,
      input: value,
      output: nearest(ft2in(value), divisor, 'ft-in')
    });
  };

  return (

    <main className="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <div className="input-group">
              <select className="form-select align-middle mb-3" aria-label="divisor" value={divisor} onChange={onChangeSelect}>
                <option>Select a divisor:</option>
                <option value="64">1/64</option>
                <option value="32">1/32</option>
                <option value="16">1/16</option>
                <option value="8">1/8</option>
                <option value="4">1/4</option>
              </select>
            </div>

            <label for="input-mm" className="form-label">Millimeters</label>
            <div className="input-group">
              <input id="input-mm" value={millimeters.input} onChange={onChangeMM} type="number" className="form-control" step={0.01} />
              <div className="input-group-append col-4">
                <span className="input-group-text">{millimeters.output} mm </span>
              </div>
            </div>

            <label for="input-in" className="form-label">Inches</label>
            <div className="input-group">
              <input id="input-in" value={inches.input} onChange={onChangeIN} type="number" className="form-control" step={0.01} />
              <div className="input-group-append col-4">
                <span className="input-group-text">{inches.output || 'in'}</span>
              </div>
            </div>

            <label for="input-ft" className="form-label">Feet</label>
            <div className="input-group">
              <input id="input-ft" value={feet.input} onChange={onChangeFT} type="number" className="form-control" step={0.01} />
              <div className="input-group-append col-4">
                <span className="input-group-text">{feet.output || 'ft'} </span>
              </div>
            </div>
          </div>

        </div>

      </div >

    </main >
  );
}

export default App;