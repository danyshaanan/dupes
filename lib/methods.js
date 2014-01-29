"use strict";

var fs = require('fs');
var crypto = require('crypto');

module.exports = {
  separateFilesBySize: separateFilesBySize,
  separateFilesByFirstBockMD5: separateFilesByFirstBockMD5,
  separateFilesByMD5: separateFilesByMD5
};


function separateFilesBySize(sets) {
  return separateFilesByKeyFunction(sets, keyFunctions.fileSize);
}

function separateFilesByFirstBockMD5(sets) {
  return separateFilesByKeyFunction(sets, keyFunctions.fileFirstBlockMD5);
}

function separateFilesByMD5(sets) {
  return separateFilesByKeyFunction(sets, keyFunctions.fileMD5);
}

////////////////////////////////////////////////////////////////////////////////

var keyFunctions = {
  fileSize: function(file) {
    return file.size;
  },
  fileFirstBlockMD5: function(file) {
    return crypto.createHash('md5').update(getFirstBlock(file)).digest('hex');
  },
  fileMD5: function(file) {
    return crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex');
  }
}

////////////////////////////////////////////////////////////////////////////////

function getFirstBlock(file) {
  return getBlock(file.path, Math.min(file.blksize, file.size), 0);
}

function getBlock(filename, blockSize, blockNumber) {
  var fd = fs.openSync(filename, 'r');
  var buffer = new Buffer(blockSize);
  fs.readSync(fd, buffer, 0, blockSize, blockNumber * blockSize);
  fs.close(fd);
  return buffer.toString('base64');
}


function separateFilesByKeyFunction(sets, keyFunction) {
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

