'use strict'

const { deepEqual } = require('assert')

// -------------------------------------------------------------------------- //

const fs = require('fs')
const ignore = require('ignore')

const paths = `
.git/HEAD
.DS_Store
node_modules
media/file.avi
code
`.split('\n').filter(Boolean)

fs.readFileSync = _ => `
.git
.DS_Store
node_modules
media/
<1M
`

const ignorePatterns = fs.readFileSync('.dupesignore', 'UTF-8').split('\n').filter(Boolean)
const ig = ignore().add(ignorePatterns)

deepEqual(paths.filter(ig.createFilter()), ['code'])

// -------------------------------------------------------------------------- //

const sample = [0, 1, 1000, 1e7]
const sizeLimitRegex = /^([<>])(\d+)([bkmgtBKMGT])?$/

const exclude = str => {
  const [, char, num, mul = 'B'] = str.match(sizeLimitRegex)
  const size = num * 1000 ** ('bkmgtBKMGT'.indexOf(mul) % 5)
  return n => char === '<' ? n >= size : n <= size
}

deepEqual(sample.filter(exclude('>2b')), [0, 1])
deepEqual(sample.filter(exclude('<2k')), [1e7])
deepEqual(sample.filter(exclude('<1k')), [1000, 1e7])
deepEqual(sample.filter(exclude('>1k')), [0, 1, 1000])
deepEqual(sample.filter(exclude('<1M')), [10000000])

// -------------------------------------------------------------------------- //

deepEqual([...ignorePatterns].filter(p => sizeLimitRegex.test(p)).map(exclude).reduce((s, ex) => s.filter(ex), sample), [10000000])

// -------------------------------------------------------------------------- //
