"use strict";

var rek = require('rekuire');
var utils = rek('utils');
var Results = rek('Results');

module.exports = {
  show: show
};

function show(options) {
  var filePath = options.target || utils.resolveDirectory(options.target) + '/' + 'dupes.json';
  utils.checkFileExists(filePath);
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
