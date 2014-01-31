"use strict";

var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var moment = require('moment');

module.exports = {
  resolveDirectory: resolveDirectory,
  humanVolume: humanVolume,
  fatalError: fatalError,
  sum: sum,
  cliTimeAgo: cliTimeAgo,
};


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
  };
  return volume.toFixed(3) + sizes[0];
}

function fatalError(message) {
  console.log(clc.red(message));
  process.exit();
}

function sum(a, b) {
  return a + b;
}


////////////////////////////////////////////////////////////////////////////////
//TODO: All of this is pasted straight from nsyrc/lib/commands/linksDataUtils.js
//Move to own package or just lib:
function cliTimeAgo(unixTimeStamp) {
  return new ProcessedString(unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never", timeAgoColorFunction(unixTimeStamp));
}
function ProcessedString(str, funcArray) {
  this.str = str;
  this.length = this.str.length;
  this.funcArray = (funcArray instanceof Array) ? funcArray : [funcArray];
}
ProcessedString.prototype.toString = function() {
  return this.funcArray.filter(Boolean).reduce(function(prev, curr) { return curr(prev); }, this.str);
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