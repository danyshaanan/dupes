"use strict";

var clc = require('cli-color');
var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');

module.exports = {
  findDupes: findDupes
};

var methodsList = [
  methods.separateFilesBySize
// , methods.separateFilesByHeadMD5
, methods.separateFilesByMD5
];

function findDupes(dir, options) {
  var fullPath = resolveDirectory(dir);
  getFiles(fullPath, options, processFiles);
}

/////////////////////////////////

function resolveDirectory(dir) {
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    console.log(clc.red(fullPath + ' is not a directory!'));
    process.exit();
  }
  return fullPath;
}

function getFiles(directory, options, callback) {
  console.log('Scanning files in', directory, ':\n');
  var files   = [];
  var walkOptions = { followLinks: false, filters: ['node_modules', '.git'] };
  var walker  = walk.walk(directory, walkOptions);

  walker.on('file', function(root, stat, next) {
    if (stat.size || options.includeEmpty) {
      stat.path = root + '/' + stat.name;
      files.push(stat);
    }
    next();
  });

  walker.on('end', function() {
    callback(files);
  });
}

function processFiles(files) {
  var sets = methodsList.reduce(function(sets, method) {
    console.log(poolsStats(sets), 'Differentiating files by method:', method.name + '...');
    return method(sets).filter(function(set) { return set.length > 1; });
  }, [files]);
  console.log(poolsStats(sets));
  console.log(resultOutput(sets));
}

function poolsStats(sets) {
  // var totalSize = sets.map(function(set) { return set.map(function(item) { return item.size; }).reduce(sum); }).reduce(sum);
  var poolsCount = sets.length;
  var filesCount = sets.map(function(set) { return set.length; }).reduce(sum);
  return ['currently', filesCount, 'files in', poolsCount, 'pools.'].join(' ');
  // return ['currently', filesCount, 'files in', poolsCount, 'pools. Total blocks:', totalSize/4096].join(' ');
}

function resultOutput(sets) {
  if (sets.length == 0) return '\nThere are no suspected dupes.\n';
  var totalDuplicatesVolume = sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(sum);
  var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  return '\nThese are the suspected dupes:\n\n' + list + '\n\n...With a total duplicate volume of ' + totalDuplicatesVolume + ' bytes';
}

function sum(a, b) {
  return a + b;
}


