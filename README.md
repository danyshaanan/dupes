# nupes
## A command line tool for finding duplicate files - WIP!
nupes helps you find duplicate files in a folder.

This is a work in progress. [Feel free to help out](https://github.com/danyshaanan/nupes)!!

* * *
### Installation
```bash
$ npm install -g nupes
```
* * *
### Usage

`nupes DIRECTORY` will search that directory for duplicate files and output the result.

* * *
### Notes
* Currently using two differentiation methods: file size, and whole file md5.
* ...

* * *
### TODOs
* Add more differentiation methods: by headers, partial checksums.
* Optimise order of differentiation methods.
* Add option to limit files checked to certail sizes.
* Add option to sort results by containing folders, or by size, or by amount of duplicates.
* Add option to filter (in or out) folders or files by name or extension (currently filtering out node_modules and .git).
* Find whole duplicate folders.
* Pretify output.
* ...