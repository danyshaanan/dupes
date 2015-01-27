'use strict'

var fs = require('fs')
var utils = require('./utils.js')
var coloredTimeAgo = require('./coloredTimeAgo.js')

function Results(filePath) {
  this.obj = {
    package: 'dupes',
    version: require('../../package.json').version
  }
  if (filePath) {
    this.load(filePath)
  }
}

Results.prototype.load = function(filePath) {
  try {
    this.obj = JSON.parse(fs.readFileSync(filePath))
  } catch(e) {
    utils.fatalError('Failed to read file:\n' + e)
  }
}

Results.prototype.set = function(key, val) {
  this.obj[key] = val
}

Results.prototype.get = function(key) {
  return this.obj[key]
}

Results.prototype.addStep = function(step) {
  this.obj.steps = this.obj.steps || []
  this.obj.steps.push(step)
}

Results.prototype.save = function(success) {
  try {
    fs.writeFileSync(this.obj.filePath, JSON.stringify(this.obj, null, 2))
    success()
  } catch(e) {
    utils.fatalError('Failed to write file:\n' + e)
  }
}

Results.prototype.setTime = function() {
  this.obj.date = new Date()
  this.obj.unixTimeStamp = this.obj.date.getTime()
}

Results.prototype.toString = function() {
  return JSON.stringify(this.obj, null, 2)
}

Results.prototype.age = function() {
  return 'This file was created on: ' + this.obj.date + '\n' + 'Which is ' + coloredTimeAgo.coloredTimeAgo(this.obj.unixTimeStamp)
}

Results.prototype.list = function() { //TODO: Advance this, enable all kinds of representations, like inc volume
  var setsByPathOnly = this.obj.sets.map(function(set) { return set.map(function(file) { return file.path })})
  var list = setsByPathOnly.map(function(set) { return set.join('\n') }).join('\n\n')
  return list
}

Results.prototype.statistics = function() {
  var totalDuplicatesVolume = this.obj.sets.map(function(set) { return (set.length - 1) * set[0].size }).reduce(utils.sum, 0)
  var totalDuplicatesCount = this.obj.sets.map(function(set) { return (set.length - 1) }).reduce(utils.sum, 0)
  var totalRunDuration = this.obj.scanDuration + this.obj.steps.map(function(step) { return step.duration }).reduce(utils.sum, 0)
  return [
    '-----------------------------------------',
    'Total files that have duplicates: ' + this.obj.sets.length,
    'Total duplicate files count: ' + totalDuplicatesCount,
    'Total duplicate volume: ' + utils.humanVolume(totalDuplicatesVolume) + ' (' + totalDuplicatesVolume + 'B)',
    'Total run duration: ' + totalRunDuration.toFixed(3) + ' seconds.',
    '-----------------------------------------'
    ].join('\n')
}

module.exports = Results
