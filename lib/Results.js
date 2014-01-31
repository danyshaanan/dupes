"use strict";

var fs = require('fs');
var clc = require('cli-color');
var moment = require('moment');

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
  return 'This file was created on: ' + this.obj.date + '\n' + 'Which is ' + cliTimeAgo(this.obj.unixTimeStamp);
}

Results.prototype.humanReadalbe = function() {
  var setsByPathOnly = this.obj.sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  var totalDuplicatesVolume = this.obj.sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(sum, 0);
  var totalRunDuration = this.obj.scanDuration + this.obj.steps.map(function(step) { return step.duration; }).reduce(sum, 0);
  return [
    '-----------------------------------------',
    list.length ? 'These are the suspected dupes:\n\n' + list : 'There are no suspected dupes.',
    '\nTotal duplicate volume: ' + humanVolume(totalDuplicatesVolume) + ' (' + totalDuplicatesVolume + 'B)',
    'Total run duration: ' + totalRunDuration.toFixed(3) + ' seconds.',
    '-----------------------------------------'
    ].join('\n');
}

//////////////////////////////////////////

function humanVolume(volume) { //TODO: move to utils
  var sizes = ['B', 'K', 'M', 'G', 'T'];
  while (sizes.length > 1 && volume > 1024) {
    volume /= 1024;
    sizes.shift();
  };
  return volume.toFixed(3) + sizes[0];
}

function sum(a, b) {
  return a + b;
}

module.exports = Results;


////////////////////////////////////////////////////////////////////////////////
//TODO: All of this is pasted straight from nsyrc/lib/commands/linksDataUtils.js
//Move to own package or just lib:

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