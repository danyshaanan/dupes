"use strict";

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');
var clc = require('cli-color');
var utils = rek('utils');
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
  options.targetPath = utils.resolveDirectory(options.target);
  var filePath = /\//.test(options.fileName) ? options.fileName : options.targetPath + '/' + options.fileName;
  if (options.write && !options.overwrite && fs.existsSync(filePath)) {
    console.log(clc.red('File already exists!! Use --overwrite to overwrite or --no-write to avoid file writing.\n' + filePath));
    process.exit();
  }

  results.set('filePath', filePath);
  results.set('fileName', options.fileName);
  results.set('path', options.targetPath);
  getFiles(options, processFiles);
}

/////////////////////////////////

function getFiles(options, callback) {
  var start = process.hrtime();
  if (!options.onlyList) console.log('\nScanning files in ' + options.targetPath);
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
    if (!options.onlyList) console.log('Scan finished in ' + scanDuration.toFixed(3) + ' seconds.');
    callback(files, options);
  });
}

function processFiles(files, options) {
  var sets = [files];

  methodsList.forEach(function(method) {
    if (!options.onlyList) console.log('Running method: ' + method.name);
    var step = { method: method.name, before: getSetsStatsObj(sets) };
    sets = method(sets);
    step.after = getSetsStatsObj(sets);
    step.duration = hrtimeToSeconds(process.hrtime(step.before.time));
    if (!options.onlyList) console.log('Method finished in ' + step.duration.toFixed(3) + ' seconds.');
    results.addStep(step);
  });
  results.set('sets', sets);
  results.setTime();
  if (!options.onlyList) console.log(results.humanReadalbePrefix());
  if (!options.onlyStats) console.log(results.humanReadalbeList());
  if (!options.onlyList) console.log(results.humanReadalbeSufix());
  if (options.write) results.save(function(err) {
    if (err) console.log('FAIL');//TODO: change to error
    else if (!options.onlyList) console.log('\nTo see the results, type:\ndupes-read ' + results.get('filePath'));
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


