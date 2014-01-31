"use strict";

var fs = require('fs');
var path = require('path');
var rek = require('rekuire');

module.exports = {
  show: show
};

function show(target, options) {
  var targetPath = resolveDirectory(target);
  var filePath = targetPath + '/dupes.json';
  //TODO: Check if exists
  var resultObject = JSON.parse(fs.readFileSync(filePath));
  if (options.showJson) {
    console.log(resultOutput(resultObject));
  } else {
    console.log(JSON.stringify(resultObject, null, 3));
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

function resultOutput(resultObject) { //TODO: duplicate code, combine
  var sets = resultObject.sets; //TODO: Change 'resut' to 'sets'.
  if (sets.length == 0) return '\nThere are no suspected dupes.\n';
  var totalDuplicatesVolume = sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(sum, 0);
  var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  var totalRunDuration = resultObject.scanDuration + resultObject.steps.map(function(step) { return step.duration; }).reduce(sum, 0);
  return '\nThese are the suspected dupes:\n\n' + list + '\n\nTotal duplicate volume: ' + totalDuplicatesVolume + ' bytes' + '\nTotal run duration: ' + totalRunDuration.toFixed(3) + ' seconds.';
}

function sum(a, b) {
  return a + b;
}


