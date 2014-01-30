"use strict";

var fs = require('fs');
var crypto = require('crypto');

module.exports = {
  separateFilesBySize: separateFilesBySize,
  // separateFilesByHeadMD5: separateFilesByHeadMD5,
  separateFilesByMD5: separateFilesByMD5
};


function separateFilesBySize(sets) {
  return separateFilesByKeyFunction(sets, keyFunctions.fileSize);
}

// function separateFilesByHeadMD5(sets) {
//   // This step is used only on sets of big files. Currently 1M. Should be optimized.
//   return separateFilesByKeyFunction(sets, keyFunctions.fileHeadMD5, function(set) { return set[0].size > 1024*1024; });
// }

function separateFilesByMD5(sets) {
  return separateFilesByKeyFunction(sets, keyFunctions.fileMD5);
}

////////////////////////////////////////////////////////////////////////////////

var keyFunctions = {
  fileSize: function(file) {
    return file.size;
  },
  // fileHeadMD5: function(file) {
  //   return crypto.createHash('md5').update(getFileHead(file)).digest('hex');
  // },
  fileMD5: function(file) {
    return crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex');
  }
}

////////////////////////////////////////////////////////////////////////////////

// function getFileHead(file) {
//   var headSize = Math.min(1024, file.size);
//   var fd = fs.openSync(file.path, 'r');
//   var buffer = new Buffer(headSize);
//   fs.readSync(fd, buffer, 0, headSize, 0);
//   fs.close(fd);
//   return buffer.toString('base64');
// }


function separateFilesByKeyFunction(sets, keyFunction, condition) {
  var result = [];

  sets.forEach(function(set) {
    // if (!condition || condition(set)) {
      var tempObj = {};
      set.forEach(function(file) {
        var key = keyFunction(file);
        if (!(key in tempObj)) tempObj[key] = [];
        tempObj[key].push(file);
      });
      var tempArr = Object.keys(tempObj).map(function(key) { return tempObj[key]; });
      result = result.concat(tempArr);
    // } else {
      // result.push(set);
    // }
  });

  return filterSingles(result);
}

function filterSingles(sets) {
  return sets.filter(function(set) { return set.length > 1; })
}

