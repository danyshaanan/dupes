# dupes - WIP

[![Build Status](https://travis-ci.org/danyshaanan/dupes.png)](https://travis-ci.org/danyshaanan/dupes)
[![NPM Version](https://img.shields.io/npm/v/dupes.svg?style=flat)](https://npmjs.org/package/dupes)
[![License](http://img.shields.io/npm/l/dupes.svg?style=flat)](LICENSE)

## A command line tool for finding duplicate files
dupes helps you find duplicate files.

This is a work in progress.

* * *
### Installation
```bash
$ npm install -g dupes
```
* * *
### Usage
`dupes [directory]` will search that directory for duplicate files and write a dupes.json results file.

Ommiting the `[directory]` will run the commands on the current directory.

`dupes-read [filePath]` will open that directory's .json file and output its results.

Ommiting the `[filePath]` will open 'dupes.json' in the current directory.

See `dupes -h` and `dupes-read -h` for more options.
* * *
### How does it work?
dupes works by running a list of differentiation methods - each one seperates the current pools of files into smaller pools. Pools of size 1 are then ommited. The current differentiation methods are:

* File size - Very fast, filters out a lot of files, but obviously still leaves different files together.
* MD5 of the whole file - Slower but definite.

Each method has a different trade-off of speed and accuracy. By starting with the cheapest methods, we make sure that more expensive ones will be executed on a smaller amount of files. By finishing with a whole-file-checksum, we guarantee that files deemed identical are indeed so.

* * *
### TODOs

* Allow rewriting of dupes.json files if they are signed
* Implement an option to run only on files from old result
* Implement better ways to read results (largest files, largest groups)
* Add option to limit files checked to certain sizes.
* Add option to include or exclude files/folders by name/regex, and set default excludes.
* Turn this list into github issues.
* Find duplicate folders.
* Check if separateFilesByHeadMD5 (commented out) will work better with bigger file size limitations.
* Try searching for a hash function faster than md5.
* Write `dupes-gui`, a web gui to write and read dupes results in the browser with express.
* Change array style to comma-before.
* ...
