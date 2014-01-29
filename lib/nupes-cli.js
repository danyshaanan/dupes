"use strict";

var clc = require('cli-color');
var fs = require('fs');
var path = require('path');
var walk = require('walk');
var rek = require('rekuire');
var methods = rek('methods');

module.exports = {
  analize: analize
};

var methodsArray = [
  methods.size
, methods.md5
];

function analize(dir) {
  var fullPath = path.resolve(dir || process.cwd());

  if (!pathIsDirectory(fullPath)) {
    console.log(clc.red(fullPath + ' is not a directory!'));
    process.exit();
  }

  console.log('analizing directory:', fullPath, ':\n');

  var files   = [];
  var options = { followLinks: false, filters: ['node_modules', '.git'] };
  var walker  = walk.walk(fullPath, options);

  walker.on('file', function(root, stat, next) {
    stat.path = root + '/' + stat.name;
    files.push(stat)
    next();
  });

  walker.on('end', function() {
    var sets = [files];
    console.log('counted', files.length, '...');

    methodsArray.forEach(function(breakByMethod) {
      sets = breakByMethod(sets);
      sets = removeSingles(sets);
    });

    var setsByPathOnly = sets.map(function(set) { return set.map(function(file) { return file.path; })});
    var list = setsByPathOnly.map(function(set) { return set.join('\n'); }).join('\n\n');
    console.log('These are suspected dupes:')
    console.log(list);
  });

}

/////////////////////////////////

function removeSingles(sets) {
  return sets.filter(function(set) { return set.length > 1; });
}

function pathIsDirectory(str) {
  return fs.existsSync(str) && fs.statSync(str).isDirectory();
}