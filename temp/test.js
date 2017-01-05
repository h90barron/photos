// var amgr = require('./album_mgr');

// amgr.albums('./', function (err, albums) {
//     if (err) {
//         console.log("Unexpected error: " + JSON.stringify(err));
//         return;
//     }
    
//     (function iter(index) {
//         if (index == albums.length) {
//             console.log("Done");
//             return;
//         }
        
//         albums[index].photos(function (err, photos) {
//             if (err) {
//                 console.log("Error loading album: " + JSON.stringify(err));
//                 return;
//             }
            
//             console.log(albums[index].name);
//             console.log(photos);
//             console.log("");
//             iter(index + 1);
//         });
//     })(0);
// });

var fs = require('fs');
var async = require('async');

// function load_file_contents(path, callback) {
//     async.waterfall([
//         function (callback) {
//             fs.open(path, 'r', callback);
//         },
//         function (f, callback) {
//             fs.fstat(f, function(err, stats) {
//                 if (err) 
//                     callback(err);
//                 else
//                     callback(null, f, stats);
//             });
//         },
//         function (f, stats, callback) {
//             if (stats.isFile()) {
//                 var b = new Buffer(10000);
//                 fs.read(f, b, 0, 10000, null, function (err, br, buf) {
//                     if (err)
//                         callback(err);
//                     else
//                         callback(null, f, b.toString('utf8', 0, br));
//                 });
//             } else {
//                 callback({ error: "not_file",
//                           message: "Can't load directory" });
//                 }
//         }, 
//         function (f, contents, callback) {
//             fs.close(f, function(err) {
//                 if (err)
//                     callback(err);
//                 else
//                     callback(null, contents);
//             });
//         }
//         ],
        
//         function (err, file_contents) {
//             callback(err, file_contents);
//         });
// }


// var path = 'albums/info.txt';

// load_file_contents(path, function(err, content) {
//     if (err)
//         console.log(err.code + "::::::" + err.message);
//     else
//         console.log(content);
// });



// async.series({
//     numbers: function (callback) {
//         setTimeout(function () {
//             callback(null, [1,2,3]);
//         }, 2000);
//     },
//     strings: function (callback) {
//         setTimeout(function () {
//             callback(null, ["a", "b", "c"]);
//         }, 2000);
//     }
// },
//     function (err, results) {
//         console.log(results);
//     })




// async.series([
//     function (callback) {
//         console.log("First operation");
//         callback(null, "First result");
//     },
//     function (callback) {
//         setTimeout(function() {
//             console.log("Delay");
//             callback(null, "Delayed Result");
//         }, 2000);
//         //callback(null, "Delayed result");
//     },
//     function (callback) {
//         console.log("Second operation");
//         callback(null, "Second result");
//     }],
//     function (err, result) {
//         console.log(result);
// });

// async.parallel([
//     function (callback) {
//         callback(null, "Test one");
//     },
//     function (callback) {
//         setTimeout(function () {
//             callback(null, "Test delay");
//         }, 2000);
//     },
//     function (callback) {
//         callback (null, "Test two");
//     }],
//     function (err, results) {
//         console.log(results);
//     });


// async.auto({
//     numbers: function (callback) {
//         setTimeout(function () {
//             callback(null, [1, 2, 3]);
//         }, 1500);
//     },
//     letters: function (callback) {
//         setTimeout(function () {
//             callback(null, ["a", "b", "c"]);
//         }, 1000);
//     },
//     assemble: ['numbers', 'letters', function (callback, so_far) {
//         callback(null, {
//             full: so_far.numbers + so_far.letters
//         });
//     }]
// }, function (err, results) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(results);
//     }
// });

var fs = require('fs');
var contents;

var rs = fs.createReadStream("albums/info.txt");

rs.on('readable', function () {
    var str;
    var d = rs.read();
    if (d) {
        if (typeof d == 'string') {
            str = d;
        } else if (typeof d == 'object' && d instanceof Buffer) {
            str = d.toString('utf8');
        }
        if (str) {
                if (!contents) 
                    contents = d;
                else
                 contents += str;
        }
    }
});

rs.on('end', function () {
    console.log("read in the file contents: ");
    console.log(contents.toString('utf8'));
});

