"use strict";

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var rek = require('rekuire');
var logger = rek('logger');
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
    logger.log(results.toString());
  } else {
    logger.verbose('\nReading from file: ' + filePath);
    logger.verbose(results.age());
    logger.verbose(results.humanReadalbePrefix());
    logger.log(results.humanReadalbeList());
    logger.verbose(results.humanReadalbeSufix());
  }
}

/////////////////////////////////

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    logger.error(filePath + ' does not exist!');
    return false;
  } else if (!fs.statSync(filePath).isFile()) {
    logger.error(filePath + ' is not a file!');
    return false;
  }
  return true;
}
