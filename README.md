# dupes - WIP
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
`dupes <directory>` will search that directory for duplicate files and write a dupes.json results file.

`dupes-read <directory>` will open that directory's dupes.json file and output its results.

Ommiting the `<directory>` will run the commands on the current directory.

* * *
### How does it work?
dupes works by running a list of differentiation methods - each one seperates the current pools of files into smaller pools. Pools of size 1 are then ommited. The current differentiation methods are:

* File size - Very fast, filters out a lot of files, but obviously still leaves different files together.
* MD5 of the whole file - Slower but definite.

Each method has a different trade-off of speed and accuracy. By starting with the cheapest methods, we make sure that more expensive ones will be executed on a smaller amount of files. By finishing with a whole-file-checksum, we guarantee that files deemed identical are indeed so.

* * *
### TODOs

* Refactor dupes-cli and dupes-read-cli.js. Lots of TODOs in the code!
* Change array style to comma-before.
* Fix crash on file write or read failure.
* Pretify output.
* Limit dependencies versions.
* Check if separateFilesByHeadMD5 (commented out) will work better with bigger file size limitations.
* Check if it is possible to prevent walk from walking between different volumes.
* Try searching for a hash function faster than md5.
* Add option to limit files checked to certain sizes.
* Add option to include or exclude files/folders by name/regex, and set default excludes.
* Find duplicate folders.
* Turn this list into github issues.
* Write `dupes-gui`, a web gui to write and read dupes results in the browser with express.
* ...
