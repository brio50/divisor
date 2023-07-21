import './App.css';
import { useState } from "react";

function App() {
  const [millimeters, setMM] = useState({});
  const [inches, setIN] = useState({});
  const [feet, setFT] = useState({});

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

    <main className="flex-shrink-1" role="main">

      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div className="container">

        <div className="row">

          <div className="col">

            <div className="input-group">
              <select className="form-select align-middle mb-3" aria-label="divisor" disabled>
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
              <input id="input-mm" value={millimeters} onChange={onChangeMM} type="number" className="form-control" />
              <div className="input-group-append">
                <span className="input-group-text">&lt;VALUE&gt; mm </span>
              </div>
            </div>

            <label for="input-mm" className="form-label">Inches</label>
            <div className="input-group">
              <input id="input-mm" value={inches} onChange={onChangeIN} type="number" className="form-control" />
              <div className="input-group-append">
                <span className="input-group-text">&lt;VALUE-FRACTION&gt; in </span>
              </div>
            </div>

            <label for="input-mm" className="form-label">Feet + Inches</label>
            <div className="input-group">
              <input id="input-mm" value={feet} onChange={onChangeFT} type="number" className="form-control" />
              <div className="input-group-append">
                <span className="input-group-text">&lt;VALUE&gt; ft - &lt;VALUE-FRACTION&gt; in </span>
              </div>
            </div>
          </div>

        </div>

      </div >

    </main >
  );
}

export default App;