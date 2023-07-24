import './App.css';
import { useState } from "react";

// TODO: follow style/conventions from https://github.com/airbnb/javascript/tree/master/react

function App() {

  // TODO: allow user selected input
  const divisor = 8;

  // unit conversions
  function mm2in(x) { return (x * 0.0393701) };
  function in2mm(x) { return (x / 0.0393701) };
  function ft2in(x) { return (x * 12.0) };
  function in2ft(x) { return (x / 12.0) };

  // rounding
  function precision(x) { return (Math.round(x * 1000) / 1000) };
  function round2divisor(x, divisor) { return (Math.ceil(x * divisor) / divisor) };
  function nearest(value, divisor, option) {
    // Convert value in inches to `# ft #-#/# in` or `#-#/# in`
    // based on specified divisor and option 'ft-in' or 'in' provided.
    // Fractions will be reduced automatically.
    //
    // TODO: value is 0 if user enters "1.", fix this bug

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

    if (numerator === denominator) {
      // if fraction is 1
      wholeInch = wholeInch + 1;
      denominator = 0;
      numerator = 0;
    }
    else if (denominator % numerator === 0) {
      // if a number is evenly divisible, remainder will be 0 and we will reduce the fraction
      console.log(`${numerator}/${denominator} reduced to ...`)
      denominator = denominator / numerator;
      numerator = 1;
      console.log(`${numerator}/${denominator} `)
    }

    console.log(`value = ${value} valueFeet = ${valueFeet} valueInch = ${valueInch} : wholeFeet = ${wholeFeet} wholeInch = ${wholeInch} fraction = ${numerator} / ${denominator}`)

    switch (option) {
      // format output strings

      case 'ft-in':

        if (numerator === 0) {
          return `${wholeFeet} ft ${wholeInch} in `;
        }
        else {
          return `${wholeFeet} ft ${wholeInch}-${numerator}/${denominator} in `;
        }

      case 'in':
        if (numerator === 0) {
          return `${ft2in(wholeFeet) + wholeInch} in `;
        }
        else {
          return `${ft2in(wholeFeet) + wholeInch}-${numerator}/${denominator} in`;
        }

      default:
        console.log(`Option may only be 'ft-in' or 'in', user chose '${option}'`)
    }

  }

  // TODO: only allow numeric inputs or mathematical expressions
  const fields = { input: [], output: '' }

  // react Hook for state management
  const [millimeters, setMM] = useState(fields);
  const [inches, setIN] = useState(fields);
  const [feet, setFT] = useState(fields);

  // TODO: consider useReducer instead of useState and spread operator (...)
  const onChangeMM = (event) => {
    const target = event.target.value;

    setMM({
      ...millimeters,
      input: target,
      output: precision(target)
    });

    setIN({
      ...inches,
      input: precision(mm2in(target)),
      output: nearest(mm2in(target), divisor, 'in')
    });

    setFT({
      ...feet,
      input: precision(in2ft(mm2in(target))),
      output: nearest(mm2in(target), divisor, 'ft-in')
    });
  };

  const onChangeIN = (event) => {
    const target = event.target.value;

    setMM({
      ...millimeters,
      input: precision(in2mm(target)),
      output: precision(in2mm(target))
    });

    setIN({
      ...inches,
      input: target,
      output: nearest(target, divisor, 'in')
    });

    setFT({
      ...feet,
      input: precision(in2ft(target)),
      output: nearest(target, divisor, 'ft-in')
    });
  };

  const onChangeFT = (event) => {
    const target = event.target.value;

    setMM({
      ...millimeters,
      input: precision(in2mm(ft2in(target))),
      output: precision(in2mm(ft2in(target)))
    });

    setIN({
      ...inches,
      input: precision(ft2in(target)),
      output: nearest(ft2in(target), divisor, 'in')
    });

    setFT({
      ...feet,
      input: target,
      output: nearest(ft2in(target), divisor, 'ft-in')
    });
  };

  return (

    <main className="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <div className="input-group">
              <select className="form-select align-middle mb-3" aria-label="divisor" disabled data-toggle="tooltip" data-placement="top" title="Disabled, set to 1/8 for time being.">
                <option>Select a divisor:</option>
                <option value="1">1/64</option>
                <option value="2">1/32</option>
                <option value="3">1/16</option>
                <option value="4">1/8</option>
                <option value="5">1/4</option>
              </select>
            </div>

            <label for="input-mm" className="form-label">Millimeters</label>
            <div className="input-group">
              <input id="input-mm" value={millimeters.input} onChange={onChangeMM} type="number" className="form-control" />
              <div className="input-group-append col-4">
                <span className="input-group-text">{millimeters.output} mm </span>
              </div>
            </div>

            <label for="input-in" className="form-label">Inches</label>
            <div className="input-group">
              <input id="input-in" value={inches.input} onChange={onChangeIN} type="number" className="form-control" />
              <div className="input-group-append col-4">
                <span className="input-group-text">{inches.output || 'in'}</span>
              </div>
            </div>

            <label for="input-ft" className="form-label">Feet</label>
            <div className="input-group">
              <input id="input-ft" value={feet.input} onChange={onChangeFT} type="number" className="form-control" />
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