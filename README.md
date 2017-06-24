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

TBD

* * *
### How does it work?
dupes works by running a list of differentiation methods - each one seperates the current pools of files into smaller pools. Pools of size 1 are then ommited. The current differentiation methods are:

* File size - Very fast, filters out a lot of files, but obviously still leaves different files together.
* MD5 of the whole file - Slower but definite.

Each method has a different trade-off of speed and accuracy. By starting with the cheapest methods, we make sure that more expensive ones will be executed on a smaller amount of files. By finishing with a whole-file-checksum, we guarantee that files deemed identical are indeed so.

* * *
### TODOs

A major rewrite since v0.0.6:

As a maintenance tool, it should break on invalid duplicate files.
This means that valid duplicate files should be configured for it.
A gitignore-like file could contain both valid paths and valid file sizes,
through patterns such as `#<10M`.
(Consider other methods to configure what's valid).

In order to make repeated run times quick,
a last-modified-timestamp should be read and logged for each tested file.
(Consider using `.dupes.json` instead of `dupes.json`).

Improve report (show size, show common directory, identify duplicate directories)
