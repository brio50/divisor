import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/* Bootstrap, Fontawesome, Jquery, Popper */
import "bootstrap/dist/css/bootstrap.css";
import '@fortawesome/fontawesome-free/js/all.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

var rootNode = document.getElementById('root');
const root = createRoot(rootNode);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
