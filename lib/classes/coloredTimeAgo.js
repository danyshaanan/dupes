"use strict";

var clc = require('cli-color');
var moment = require('moment');

module.exports = {
  coloredTimeAgo: cliTimeAgo
};


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

