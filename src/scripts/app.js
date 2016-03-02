'use strict';

const $ = require('jquery');
const skills = require('./../../data/skills.json');
const projects = require('./../../data/projects.json');
const jadeData = Object.assign({}, skills, projects);
const template = require('jade!./../index.jade')(jadeData);
$('body').html(template);

import './../styles/main.scss';
import './header.js';
import languageChart from './language-chart.js';

// TODO: Fix this. Please.
setTimeout(() => {
  languageChart(skills.skills);
}, 1000);

if (module.hot) {
  module.hot.accept();
}
