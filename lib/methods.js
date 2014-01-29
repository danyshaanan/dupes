"use strict";

var fs = require('fs');
var crypto = require('crypto');

module.exports = {
  separateFilesBySize: separateFilesBySize,
  separateFilesByMD5: separateFilesByMD5
};


function separateFilesBySize(sets) {
  return breakByKeyFunction(sets, function(file) {
    return file.size;
  });
}

function separateFilesByMD5(sets) {
  return breakByKeyFunction(sets, function(file) {
    return crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex'); //This is slow and wasteful!! TODO: optimize and use at a very late stage.
  });
}


////////////////////////////////////////////////////////////////////////////////

function breakByKeyFunction(sets, keyFunction) {
  var result = [];

  sets.forEach(function(set) {
    var tempObj = {};
    set.forEach(function(file) {
      var key = keyFunction(file);
      if (!(key in tempObj)) tempObj[key] = [];
      tempObj[key].push(file);
    });
    var tempArr = Object.keys(tempObj).map(function(key) { return tempObj[key]; });
    result = result.concat(tempArr);
  });

  return result;
}