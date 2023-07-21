import './App.css';
import { useState } from "react";

function App() {
  const [millimeters, setMM] = useState(null);
  const [inches, setIN] = useState(null);
  const [feet, setFT] = useState(null);

  const onChangeMM = (event) => {
    setMM(event.target.value);
    setIN(mm2in(event.target.value));
    setFT(in2ft(mm2in(event.target.value)));
  };
  const onChangeIN = (event) => {
    setMM(in2mm(event.target.value));
    setIN(event.target.value);
    setFT(in2ft(event.target.value));
  };
  const onChangeFT = (event) => {
    setMM(in2mm(ft2in(event.target.value)));
    setIN(ft2in(event.target.value));
    setFT(event.target.value);
  };

  function mm2in(millimeters) { return (millimeters * 0.0393701) }
  function in2mm(inches) { return (inches / 0.0393701) }
  function in2ft(inches) { return (inches / 12.0) }
  function ft2in(feet) { return (feet * 12.0) }

  return (

    <main class="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <div class="input-group">
              <select className="form-select align-middle mb-3" aria-label="divisor">
                <option>Select a divisor:</option>
                <option value="1">1/64</option>
                <option value="2">1/32</option>
                <option value="3">1/16</option>
                <option value="4">1/8</option>
                <option value="5">1/4</option>
              </select>
            </div>

            <label for="input-mm" class="form-label">Millimeters</label>
            <div class="input-group">
              <input id="input-mm" value={millimeters} onChange={onChangeMM} type="number" class="form-control" />
              <div class="input-group-append">
                <span class="input-group-text"> mm </span>
              </div>
            </div>

            <label for="input-mm" class="form-label">Inches</label>
            <div class="input-group">
              <input id="input-mm" value={inches} onChange={onChangeIN} type="number" class="form-control" />
              <div class="input-group-append">
                <span class="input-group-text"> in </span>
              </div>
            </div>

            <label for="input-mm" class="form-label">Feet + Inches</label>
            <div class="input-group">
              <input id="input-mm" value={feet} onChange={onChangeFT} type="number" class="form-control" />
              <div class="input-group-append">
                <span class="input-group-text"> ft+in </span>
              </div>
            </div>
          </div>

        </div>

      </div >

    </main >
  );
}

export default App;