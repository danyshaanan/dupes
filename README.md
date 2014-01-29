# nupes - WIP
## A command line tool for finding duplicate files
nupes helps you find duplicate files.

This is a work in progress.

* * *
### Installation
```bash
$ npm install -g nupes
```
* * *
### Usage
`nupes <directory>` will search that directory for duplicate files and output the result. `nupes` will do the same for the current directory.

* * *
### How does it work?
nupes works by running a list of differentiation methods - each one seperates the current pools of files into smaller pools. Pools of size 1 are then ommited. The current differentiation methods are:
* File size - Very fast, filters out a lot of files, but obviously still leaves different files together.
* MD5 of the whole file - Slower but definite.

Each method has a different trade-off of speed and accuracy. By starting with the cheapest methods, we make sure that more expensive ones will be executed on a smaller amount of files. By finishing with a whole-file-checksum, we guarantee that files deemed identical are indeed so.

* * *
### TODOs
Output:
* Add option to group/sort results by containing folders, or by size, or by amount of duplicates.
* Add duration stats.
* Add sum of all duplicate files sizes.
* Add verbose and quite options and set output levels.
* Enable saving output as json and then querying it in various ways.
* Pretify output.

Other:
* Check if separateFilesByHeadMD5 (commented out) will work better with bigger file size limitations.
* Add option to limit files checked to certain sizes.
* Add option to include or exclude files/folders by name/regex, and set default excludes.
* Find duplicate folders.
* Turn this list into github issues.
* ...
