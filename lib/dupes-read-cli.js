"use strict";

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var clc = require('cli-color');
var rek = require('rekuire');

module.exports = {
  show: show
};

function show(target, options) {
  var targetPath = resolveDirectory(target);
  var filePath = targetPath + '/dupes.json';
  checkFileExists(filePath);
  var resultObject = JSON.parse(fs.readFileSync(filePath)); //TODO: prevent error on file read fail
  if (options.showJson) {
    console.log(resultAge(resultObject));
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

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(clc.red(filePath + ' does not exist!')); //TODO: This should use the logger
    process.exit(); //TODO: avoid this
  } else if (!fs.statSync(filePath).isFile()) {
    console.log(clc.red(filePath + ' is not a file!')); //TODO: This should use the logger
    process.exit(); //TODO: avoid This
  }
}

function resultAge(resultObject) {
  return 'This file was created on: ' + resultObject.date + '\n' + 'Which is ' + cliTimeAgo(resultObject.unixTimeStamp);
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







////////////////////////////////////////////////////////////////////////////////
//TODO: All of this is pasted straight from nsyrc/lib/commands/linksDataUtils.js
//Move to own package:

function ProcessedString(str, funcArray) {
  this.str = str;
  this.length = this.str.length;
  this.funcArray = (funcArray instanceof Array) ? funcArray : [funcArray];
}
ProcessedString.prototype.toString = function() {
  return this.funcArray.filter(Boolean).reduce(function(prev, curr) { return curr(prev); }, this.str);
}
function cliTimeAgo(unixTimeStamp) {
  return new ProcessedString(unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never", timeAgoColorFunction(unixTimeStamp));
}
function timeAgoColorFunction(unixTimeStamp) {
  var updateStatus = getUpdateStatus(unixTimeStamp);
  if (updateStatus == LinkUpdateStatus.OLD) return clc.red;
  if (updateStatus == LinkUpdateStatus.SEMI) return clc.yellow;
  if (updateStatus == LinkUpdateStatus.NEW) return clc.white;
}
function getUpdateStatus(unixTimeStamp) {
  var secondsAgo = moment().diff(moment(unixTimeStamp || 0)) / 1000;
  if (secondsAgo > 60*60*24*7) { //TODO: this time period (week) should be configurable. //From outside the package!
    return LinkUpdateStatus.OLD;
  } else if (secondsAgo > 60*60*24) { //TODO: this time period (day) should be configurable. //From outside the package!
    return LinkUpdateStatus.SEMI;
  }
  return LinkUpdateStatus.NEW;
}
var LinkUpdateStatus = {
  NEW: 'new',
  SEMI: 'semi',
  OLD: 'old'
}

////////////////////////////////////////////////////////////////////////////////