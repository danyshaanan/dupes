"use strict";

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');
var logger = rek('logger');
var Results = rek('Results');

module.exports = {
  findDupes: findDupes
};

var methodsList = [
  methods.separateFilesBySize
// , methods.separateFilesByHeadMD5
, methods.separateFilesByMD5
];

var results;

function findDupes(options) {
  results = new Results();
  options.targetPath = resolveDirectory(options.target);
  var filePath = /\//.test(options.fileName) ? options.fileName : options.targetPath + '/' + options.fileName;
  if (options.write && !options.overwrite && fs.existsSync(filePath)) {
    logger.error('File already exists!! Use --overwrite to overwrite or --no-write to avoid file writing.\n' + filePath);
    process.exit();
  }

  results.set('filePath', filePath);
  results.set('fileName', options.fileName);
  results.set('path', options.targetPath);
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
    var scanDuration = hrtimeToSeconds(process.hrtime(start));
    results.set('scanDuration', scanDuration);
    logger.log('Scan finished in ' + scanDuration.toFixed(3) + ' seconds.');
    callback(files, options);
  });
}

function processFiles(files, options) {
  var sets = [files];

  methodsList.forEach(function(method) {
    logger.log('Running method: ' + method.name);
    var step = { method: method.name, before: getSetsStatsObj(sets) };
    sets = method(sets);
    step.after = getSetsStatsObj(sets);
    step.duration = hrtimeToSeconds(process.hrtime(step.before.time));
    logger.log('Method finished in ' + step.duration.toFixed(3) + ' seconds.');
    logger.verbose(JSON.stringify(step,null,3) + '\n');
    results.addStep(step);
  });
  results.set('sets', sets);
  results.setTime();
  logger.log(results.humanReadalbe());
  if (options.write) results.save(function(err) {
    if (err) logger.log('FAIL');
    else logger.log('\nTo see the results, type:\ndupes-read ' + results.get('filePath'));
  });
}

function getSetsStatsObj(sets) {
  return { files: sets.map(function(set) { return set.length; }).reduce(sum, 0), pools: sets.length, time: process.hrtime() };
}

function hrtimeToSeconds(hrTime) {
  return hrTime[0] + hrTime[1] / 1000000000;
}

function sum(a, b) {
  return a + b;
}


