"use strict";

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');
var logger = rek('logger');

module.exports = {
  findDupes: findDupes,
  logger: logger
};

var methodsList = [
  methods.separateFilesBySize
// , methods.separateFilesByHeadMD5
, methods.separateFilesByMD5
];

var resultObject = {};

function findDupes(dir, options) {
  var fullPath = resolveDirectory(dir);
  resultObject.path = fullPath;
  getFiles(fullPath, options, processFiles);
}

/////////////////////////////////

function resolveDirectory(dir) {
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    logger.error(fullPath + ' is not a directory!');
    process.exit();
  }
  return fullPath;
}

function getFiles(directory, options, callback) {
  logger.log('Scanning files in ' + directory + ':\n');
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
  var sets = [files];

  resultObject.steps = [];

  methodsList.forEach(function(method) {
    logger.verbose('Running method: ' + method.name)
    var step = { method: method.name, before: getSetsStatsObj(sets) };
    sets = method(sets);
    step.after = getSetsStatsObj(sets);
    logger.verbose(JSON.stringify(step,null,3) + '\n');
    resultObject.steps.push(step);
  });
  resultObject.result = sets;
  logger.log(resultOutput(sets));
  // logger.verbose(JSON.stringify(resultObject,null,2));
}

function getSetsStatsObj(sets) {
  return { files: sets.map(function(set) { return set.length; }).reduce(sum, 0), pools: sets.length };
}

function resultOutput(sets) {
  if (sets.length == 0) return '\nThere are no suspected dupes.\n';
  var totalDuplicatesVolume = sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(sum, 0);
  var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  return 'These are the suspected dupes:\n\n' + list + '\n\n...With a total duplicate volume of ' + totalDuplicatesVolume + ' bytes';
}

function sum(a, b) {
  return a + b;
}


