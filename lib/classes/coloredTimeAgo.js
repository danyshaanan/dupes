"use strict";

var clc = require('cli-color');
var moment = require('moment');

module.exports = {
  coloredTimeAgo: coloredTimeAgo
};

var secondsInDay = 60*60*24;
var secondsInHour = 60*60;

function coloredTimeAgo(unixTimeStamp) {
  var colorFunction = utsColorFunction(unixTimeStamp);
  var timeAgo = utsToAgo(unixTimeStamp);
  return colorFunction(timeAgo);
}

function utsToAgo(unixTimeStamp) {
  return unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never";
}

function utsColorFunction(unixTimeStamp) {
  var secondsAgo = moment().diff(moment(unixTimeStamp || 0)) / 1000;
  if      (secondsAgo > secondsInDay)  return clc.red;
  else if (secondsAgo > secondsInHour) return clc.yellow;
  else return clc.white;
}
