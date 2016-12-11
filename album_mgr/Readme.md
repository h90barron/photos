 # album-manager
 
This module is for managing photo albums based on a directory. We assume
that, given a path, there is an albums sub-folder, and each of its individual
sub-folders are themselves the albums. Files in those sub-folders arer photos

## Album Manager

The album manager exposes a single function 'albums', which returns  an
array of the 'Album' objects for each album it contains.

## Album object

The album object has the following two properties and one method:
* 'name' -- The name of the album
* 'path' -- The path to the album
*  'photos()' -- Calling this method will return all the album's photos
