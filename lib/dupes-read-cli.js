"use strict";

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var rek = require('rekuire');
var logger = rek('logger');
var Results = rek('Results');

module.exports = {
  show: show
};

function show(options) {
  var filePath = options.target || resolveDirectory(options.target) + '/' + 'dupes.json';
  checkFileExists(filePath);

  var results = new Results(filePath);
  if (options.showJson) {
    logger.log(results.toString());
  } else {
    logger.log('\nReading from file: ' + filePath);
    logger.log(results.age());
    logger.log(results.humanReadalbe());
  }
}

/////////////////////////////////

function resolveDirectory(dir) { //TODO: duplicate code, combine
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    logger.error(fullPath + ' is not a directory!');
    process.exit();
  }
  return fullPath;
}

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    logger.error(filePath + ' does not exist!');
    process.exit(); //TODO: avoid this
  } else if (!fs.statSync(filePath).isFile()) {
    logger.error(filePath + ' is not a file!');
    process.exit(); //TODO: avoid This
  }
}

function sum(a, b) {
  return a + b;
}
