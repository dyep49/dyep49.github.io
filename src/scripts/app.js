'use strict';

const $ = require('jquery');
const jadeData = require('./../../data/projects.json');
const template = require('jade!./../index.jade')(jadeData);
$('body').html(template);

import './../styles/main.scss';
import './header.js';
// import languageChart from './language-chart.js';

if (module.hot) {
  module.hot.accept();
}
