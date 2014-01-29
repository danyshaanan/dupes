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
, methods.separateFilesByMD5
];

function findDupes(dir) {
  var fullPath = resolveDirectory(dir);
  getFiles(fullPath, processFiles);
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

function getFiles(directory, callback) {
  console.log('Scanning files in', directory, ':\n');
  var files   = [];
  var options = { followLinks: false, filters: ['node_modules', '.git'] };
  var walker  = walk.walk(directory, options);

  walker.on('file', function(root, stat, next) {
    stat.path = root + '/' + stat.name;
    files.push(stat)
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
  printOutput(sets);
}

function poolsStats(sets) {
  var poolsCount = sets.length;
  var filesCount = sets.map(function(set) { return set.length; }).reduce(function(prev,curr) { return prev + curr; }, 0);
  return ['currently', filesCount, 'files in', poolsCount, 'pools.'].join(' ');
}

function printOutput(sets) {
  var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  console.log('\nThese are suspected dupes:\n')
  console.log(list);
}


