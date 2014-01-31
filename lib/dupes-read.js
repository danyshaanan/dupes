"use strict";

var fs = require('fs');
var path = require('path');
var rek = require('rekuire');
var utils = rek('utils');
var Results = rek('Results');

module.exports = {
  show: show
};

function show(options) {
  var filePath = options.target || utils.resolveDirectory(options.target) + '/' + 'dupes.json';
  checkFileExists(filePath);
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
    utils.fatalError(filePath + ' does not exist!');
  } else if (!fs.statSync(filePath).isFile()) {
    utils.fatalError(filePath + ' is not a file!');
  }
}
