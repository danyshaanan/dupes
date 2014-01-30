"use strict";

module.exports = {
  log: log
};

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log(args.join(' '));
}