'use strict';

const $ = require('jquery');
import './../styles/main.scss';
import './header.js';
import languageChart from './language-chart.js';

const skills = require('./../../data/skills.json');

if (module.hot) {
  module.hot.accept();
  const projects = require('./../../data/projects.json');
  const jadeData = Object.assign({}, skills, projects);
  const template = require('jade!./../index.jade')(jadeData);
  $('body').html(template);
}

// TODO: Fix this. Please.
setTimeout(() => {
  languageChart(skills.skills);
}, 1000);
