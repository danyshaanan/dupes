"use strict";

var clc = require('cli-color');

module.exports = {
  setVerbosity: setVerbosity,
  log: log,
  verbose: verbose,
  error: error
};

var Verbosity = {
  QUIET: "QUIET",
  NORMAL: "NORMAL",
  VERBOSE: "VERBOSE"
}

var verbosity = Verbosity.NORMAL;

function setVerbosity(level) {
  if      (level == 0) verbosity = Verbosity.QUIET;
  else if (level == 1) verbosity = Verbosity.NORMAL;
  else if (level == 2) verbosity = Verbosity.VERBOSE;
}

function log(str) {
  if (verbosity != Verbosity.QUIET) console.log(str);
}

function verbose(str) {
  if (verbosity == Verbosity.VERBOSE) console.log(str);
}

function error(str) {
  console.log(clc.red(str));
}