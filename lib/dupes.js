"use strict";

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');
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
    utils.fatalError('File already exists!! Use --overwrite to overwrite or --no-write to avoid file writing.\n' + filePath);
  }

  results.set('filePath', filePath);
  results.set('fileName', options.fileName);
  results.set('path', options.targetPath);
  getFiles(options, processFiles);
}

/////////////////////////////////

function getFiles(options, callback) {
  var start = process.hrtime();
  if (options.printStats) console.log('\nScanning files in ' + options.targetPath);
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
    if (options.printStats) console.log('Scan finished in ' + scanDuration.toFixed(3) + ' seconds.');
    callback(files, options);
  });
}

function processFiles(files, options) {
  var sets = [files];

  methodsList.forEach(function(method) {
    if (options.printStats) console.log('Running method: ' + method.name);
    var step = { method: method.name, before: getSetsStatsObj(sets) };
    sets = method(sets);
    step.after = getSetsStatsObj(sets);
    step.duration = hrtimeToSeconds(process.hrtime(step.before.time));
    if (options.printStats) console.log('Method finished in ' + step.duration.toFixed(3) + ' seconds.');
    results.addStep(step);
  });
  results.set('sets', sets);
  results.setTime();
  if (options.printStats) console.log('-----------------------------------------');
  if      (options.printList)  console.log(results.list());
  else if (options.printStats) console.log('Duplicates file not printed');
  if (options.printStats) console.log(results.statistics());
  if (options.write) results.save(function() {
    if (options.printStats) console.log('\nTo see the results, type:\ndupes-read ' + results.get('filePath') + '\n');
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


