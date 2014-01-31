"use strict";

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');
var logger = rek('logger');

var fileName = 'dupes.json';

module.exports = {
  findDupes: findDupes,
  logger: logger
};

var methodsList = [
  methods.separateFilesBySize
// , methods.separateFilesByHeadMD5
, methods.separateFilesByMD5
];

var resultObject = {}; //TODO: global var, avoid.

function findDupes(options) {
  logger.setVerbosity(options.verbosity); //TODO: This should be called from the parent!
  options.targetPath = resolveDirectory(options.targetPath);

  var filePath = options.targetPath + '/' + fileName; //TODO: duplicate code
  if (options.write && !options.overwrite && fs.existsSync(filePath)) {
    logger.error('File already exists!! Use --overwrite to overwrite.\n' + filePath);
    process.exit();
  }

  resultObject.path = options.targetPath;
  getFiles(options, processFiles);
}

/////////////////////////////////

function resolveDirectory(dir) { //TODO: duplicate code, combine
  var fullPath = path.resolve(dir || process.cwd());
  if (!(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    logger.error(fullPath + ' is not a directory!');
    process.exit();
  }
  return fullPath;
}

function getFiles(options, callback) {
  var start = process.hrtime();
  logger.log('\nScanning files in ' + options.targetPath);
  var files   = [];
  var walkOptions = { followLinks: false, filters: ['node_modules', '.git'] };
  var walker  = walk.walk(options.targetPath, walkOptions);

  walker.on('file', function(root, stat, next) {
    if (stat.size || options.includeEmpty) {
      stat.path = root + '/' + stat.name;
      files.push(stat);
    }
    next();
  });

  walker.on('end', function() {
    resultObject.scanDuration = hrtimeToSeconds(process.hrtime(start));
    logger.log('Scan finished in ' + resultObject.scanDuration.toFixed(3) + ' seconds.');
    callback(files, options);
  });
}

function processFiles(files, options) {
  var sets = [files];

  resultObject.steps = [];

  methodsList.forEach(function(method) {
    logger.log('Running method: ' + method.name);
    var step = { method: method.name, before: getSetsStatsObj(sets) };
    sets = method(sets);
    step.after = getSetsStatsObj(sets);
    step.duration = hrtimeToSeconds(process.hrtime(step.before.time));
    logger.log('Method finished in ' + step.duration.toFixed(3) + ' seconds.');
    logger.verbose(JSON.stringify(step,null,3) + '\n');
    resultObject.steps.push(step);
  });
  resultObject.sets = sets;
  resultObject.date = new Date();
  resultObject.unixTimeStamp = resultObject.date.getTime();
  logger.log(resultOutput(resultObject));
  if (options.write) writeJson(resultObject, options);
}

function writeJson(resultObject, options) {
  var filePath = options.targetPath + '/' + fileName; //TODO: duplicate code
  fs.writeFileSync(filePath, JSON.stringify(resultObject, null, 2)); //TODO: prevent error on file write fail
}

function getSetsStatsObj(sets) {
  return { files: sets.map(function(set) { return set.length; }).reduce(sum, 0), pools: sets.length, time: process.hrtime() };
}

function hrtimeToSeconds(hrTime) {
  return hrTime[0] + hrTime[1] / 1000000000;
}

function resultOutput(resultObject) { //TODO: duplicate code, combine
  var sets = resultObject.sets;
  if (sets.length == 0) return '\nThere are no suspected dupes.\n';
  var totalDuplicatesVolume = sets.map(function(set) { return (set.length - 1) * set[0].size; }).reduce(sum, 0);
  var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
  var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
  var totalRunDuration = resultObject.scanDuration + resultObject.steps.map(function(step) { return step.duration; }).reduce(sum, 0);
  return '\nThese are the suspected dupes:\n\n' + list + '\n\nTotal duplicate volume: ' + totalDuplicatesVolume + ' bytes' + '\nTotal run duration: ' + totalRunDuration.toFixed(3) + ' seconds.';
}

function sum(a, b) {
  return a + b;
}


