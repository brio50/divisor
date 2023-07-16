/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* Bootstrap and Fontawesome */
import "bootstrap/dist/css/bootstrap.css";
import '@fortawesome/fontawesome-free/js/all.js';

/* Function Specific */
/*import logo_image from '../img/react.svg';*/

/******************************************************************************************/

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

function tick() {
  const element = (
    <div>
        <h1>React</h1>
        <p>{new Date().toLocaleTimeString()}</p>
    </div>
  );
  root.render(element);
  }

setInterval(tick, 1000);

/******************************************************************************************/
