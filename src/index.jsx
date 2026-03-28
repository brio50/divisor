import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Bootstrap, Fontawesome, Jquery, Popper */
import "bootstrap/dist/css/bootstrap.css";
import '@fortawesome/fontawesome-free/js/all.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './index.css';
import App from './App';

var rootNode = document.getElementById('root');
const root = createRoot(rootNode);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
