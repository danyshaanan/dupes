"use strict";

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var rek = require('rekuire');
var Results = rek('Results');

module.exports = {
  show: show
};

function show(options) {
  var filePath = options.target || resolveDirectory(options.target) + '/' + 'dupes.json';
  checkFileExists(filePath);

  var results = new Results(filePath);
  // var resultObject = JSON.parse(fs.readFileSync(filePath)); //TODO: prevent error on file read fail
  if (options.showJson) {
    console.log(results.toString());
  } else {
    console.log('\nReading from file: ' + filePath);
    console.log(results.age());
    console.log(results.humanReadalbe());
  }
}

/////////////////////////////////

function resolveDirectory(dir) { //TODO: duplicate code, combine
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    console.log(fullPath + ' is not a directory!'); //TODO: This should use the logger
    process.exit();
  }
  return fullPath;
}

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(clc.red(filePath + ' does not exist!')); //TODO: This should use the logger
    process.exit(); //TODO: avoid this
  } else if (!fs.statSync(filePath).isFile()) {
    console.log(clc.red(filePath + ' is not a file!')); //TODO: This should use the logger
    process.exit(); //TODO: avoid This
  }
}

function sum(a, b) {
  return a + b;
}
