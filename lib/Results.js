"use strict";

var fs = require('fs');
var clc = require('cli-color');
var rek = require('rekuire');
var utils = rek('utils');

function Results(filePath) {
  this.obj = {};
  if (filePath) this.load(filePath);
}

Results.prototype.load = function(filePath) {
  this.obj = JSON.parse(fs.readFileSync(filePath)); //TODO: prevent error on file read fail
};

Results.prototype.set = function(key, val) {
  this.obj[key] = val;
};

Results.prototype.get = function(key) {
  return this.obj[key];
};

Results.prototype.addStep = function(step) {
  this.obj.steps = this.obj.steps || [];
  this.obj.steps.push(step);
}

Results.prototype.save = function(callback) {
  // try {
    fs.writeFileSync(this.obj.filePath, JSON.stringify(this.obj, null, 2)); //TODO: prevent error on file write fail
    callback(null);
  // } catch(e) {
    // callback(e);
  // }
}

Results.prototype.setTime = function() {
  this.obj.date = new Date();
  this.obj.unixTimeStamp = this.obj.date.getTime();
}

Results.prototype.toString = function() {
  return JSON.stringify(this.obj, null, 2);
}

Results.prototype.age = function() {
  return 'This file was created on: ' + this.obj.date + '\n' + 'Which is ' + utils.cliTimeAgo(this.obj.unixTimeStamp);
}

Results.prototype.humanReadalbePrefix = function() {
  var setsByPathOnly = this.obj.sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  return [
    '-----------------------------------------',
    list.length ? 'These are the suspected dupes:\n\n' : 'There are no suspected dupes.'
    ].join('\n');
}
Results.prototype.humanReadalbeList = function() {
  var setsByPathOnly = this.obj.sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  return list.length ? list : '';
}
Results.prototype.humanReadalbeSufix = function() {
  var totalDuplicatesVolume = this.obj.sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(utils.sum, 0);
  var totalRunDuration = this.obj.scanDuration + this.obj.steps.map(function(step) { return step.duration; }).reduce(utils.sum, 0);
  return [
    '\nTotal duplicate volume: ' + utils.humanVolume(totalDuplicatesVolume) + ' (' + totalDuplicatesVolume + 'B)',
    'Total run duration: ' + totalRunDuration.toFixed(3) + ' seconds.',
    '-----------------------------------------'
    ].join('\n');
}

module.exports = Results;



