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
    if (!options.onlyList) output.push('-----------------------------------------');
    output.push(options.onlyStats ? 'Duplicates file not printed' : results.list());
    if (!options.onlyList) output.push(results.statistics());
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
