"use strict";

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var rek = require('rekuire');
var utils = rek('utils');
var Results = rek('Results');

module.exports = {
  show: show
};

function show(options) {
  var filePath = options.target || utils.resolveDirectory(options.target) + '/' + 'dupes.json';
  if (!checkFileExists(filePath)) process.exit();
  var results = new Results(filePath);
  if (options.showJson) {
    console.log(results.toString());
  } else {
    var output = [];
    if (!options.onlyList) output.push('\nReading from file: ' + filePath);
    if (!options.onlyList) output.push(results.age());
    if (!options.onlyList) output.push(results.humanReadalbePrefix());
    if (!options.onlyStats) output.push(results.humanReadalbeList());
    if (!options.onlyList) output.push(results.humanReadalbeSufix());
    console.log(output.join('\n'));
  }
}

/////////////////////////////////

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(clc.red(filePath + ' does not exist!'));
    return false;
  } else if (!fs.statSync(filePath).isFile()) {
    console.log(clc.red(filePath + ' is not a file!'));
    return false;
  }
  return true;
}
