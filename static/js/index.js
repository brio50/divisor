/* React */
import React from 'react';
import { createRoot } from 'react-dom/client';
import MarkdownToHtml from './readme.js';

/* Bootstrap, Fontawesome, Jquery, Popper */
import "bootstrap/dist/css/bootstrap.css";
import '@fortawesome/fontawesome-free/js/all.js';
import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle.min';

/******************************************************************************************/

const domNode = document.getElementById('readme');
console.log(domNode);
const root = createRoot(domNode);
root.render(MarkdownToHtml());


