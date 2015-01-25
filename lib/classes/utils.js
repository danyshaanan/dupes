'use strict';

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');

module.exports = {
  checkFileExists: checkFileExists,
  resolveDirectory: resolveDirectory,
  humanVolume: humanVolume,
  fatalError: fatalError,
  hrtimeToSeconds: hrtimeToSeconds,
  sum: sum
};


function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fatalError(filePath + ' does not exist!');
  } else if (!fs.statSync(filePath).isFile()) {
    fatalError(filePath + ' is not a file!');
  }
}

function resolveDirectory(dir) {
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    fatalError(fullPath + ' is not a directory!');
  }
  return fullPath;
}

function humanVolume(volume) {
  var sizes = ['B', 'K', 'M', 'G', 'T'];
  while (sizes.length > 1 && volume > 1024) {
    volume /= 1024;
    sizes.shift();
  }
  return volume.toFixed(3) + sizes[0];
}

function fatalError(message) {
  console.log(clc.red(message));
  process.exit();
}

function hrtimeToSeconds(hrTime) {
  return hrTime[0] + hrTime[1] / 1000000000;
}

function sum(a, b) {
  return a + b;
}
