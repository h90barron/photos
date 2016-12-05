//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//


// var http = require('http');
// var path = require('path');

// var async = require('async');
// var socketio = require('socket.io');
// var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//



// var router = express();
// var server = http.createServer(router);
// var io = socketio.listen(server);

// router.use(express.static(path.resolve(__dirname, 'client')));
// var messages = [];
// var sockets = [];

// io.on('connection', function (socket) {
//     messages.forEach(function (data) {
//       socket.emit('message', data);
//     });

//     sockets.push(socket);

//     socket.on('disconnect', function () {
//       sockets.splice(sockets.indexOf(socket), 1);
//       updateRoster();
//     });

//     socket.on('message', function (msg) {
//       var text = String(msg || '');

//       if (!text)
//         return;

//       socket.get('name', function (err, name) {
//         var data = {
//           name: name,
//           text: text
//         };

//         broadcast('message', data);
//         messages.push(data);
//       });
//     });

//     socket.on('identify', function (name) {
//       socket.set('name', String(name || 'Anonymous'), function (err) {
//         updateRoster();
//       });
//     });
//   });

// function updateRoster() {
//   async.map(
//     sockets,
//     function (socket, callback) {
//       socket.get('name', callback);
//     },
//     function (err, names) {
//       broadcast('roster', names);
//     }
//   );
// }

// function broadcast(event, data) {
//   sockets.forEach(function (socket) {
//     socket.emit(event, data);
//   });
// }

// server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
//   var addr = server.address();
//   console.log("Chat server listening at", addr.address + ":" + addr.port);
// });


// var http = require('http');
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World\n');
// }).listen(process.env.PORT, process.env.IP);


var http = require('http');
var fs = require('fs');

function load_album_list(callback) {
  fs.readdir(
    "albums",
    function (err, files) {
      if(err) {
        callback(err);
        return;
      }
      
      
      var only_dirs = [];
      (function iter(index) {
        if(index == files.length) {
          callback(null, only_dirs);
          console.log("callback time");
          return;
        }
        
        fs.stat(
          "albums/" + files[index],
          function(err, stats) {
            if (err) {
              callback(err);
              return;
            }
            if(stats.isDirectory()) {
              only_dirs.push(files[index]);
              console.log(only_dirs[index]);
            }
            iter(index + 1);
          });
      })(0);

    });
}


function handle_incoming_request(req, res) {
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  load_album_list(function (err, albums) {
    if (err) {
      res.writeHead(503, {"Content-Type": "application/json"});
      res.end(JSON.Stringify(err) + "\n");
      return;
    }
    
    var out = { error: null,
                data: { albums: albums},};
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(out) + "\n");
    console.log("End response");
  });
}

var s = http.createServer(handle_incoming_request);
s.listen(process.env.PORT, process.env.IP);





// function compute_intersection(arr1, arr2, callback) {
//   var bigger = arr1.length > arr2.length ? arr1 : arr2;
//   var smaller = bigger == arr1 ? arr2 : arr1;
//   var biglen = bigger.length;
//   var smlen = smaller.length;
  
//   var start = 0;
//   var size = 10;
//   var results = [];
//   function sub_compute_interseciton () {
//     for (var i = start; i < (start + size) && biglen; i++) {
//       for (var j = 0; j < smlen; j++) {
//         if(bigger[i] == smaller[j]){
//           results[results.length] = bigger[i];
//           //console.log(bigger[i]);
//           break;
//         }
//       }
//     }
//     if(i >= biglen) {
//       callback(null, results);
//     } else {
//         start += size;
//         process.nextTick(sub_compute_interseciton);
//       }
//     }
//     sub_compute_interseciton();
// }


// var a = [];
// var b = [];

// for (var i = 1; i < 30; i++) {
//   a.push(i);
// }

// for (var i = 1; i < 30; i++) {
//   if (i % 3 == 0) {
//     b.push(i);
//   }
// }

// compute_intersection(a, b, function (err, results) {
//   if(err) {
//     console.log(err);
//   } else {
//     for(var i = 0; i < results.length; i++) {
//       console.log(results[i]);
//     }
//   }
// })
  
