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
var url = require('url');

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
              var obj = { name: files[index] };
              only_dirs.push(obj);
              console.log(only_dirs[index]);
            }
            iter(index + 1);
          });
      })(0);

    });
}



function load_album(album_name, page, page_size, callback) {
  fs.readdir(
    "albums/" + album_name,
    function(err, files) {
      if (err) {
        if (err.code == "ENOENT") {
          callback(no_such_album());
      } else {
        callback(make_error("file error", JSON.stringify(err)));
      }
      return;
    }
    
    var only_files = [];
    var path = "albums/" + album_name + "/";
    
    //called recursively 
    (function iter(index) {
      if (index == files.length) {
        // page should be 0 in the query string for first set of results
        var ps = only_files.splice(page * page_size, page_size);
        var obj = { short_name: album_name,
                    photos: ps };
        callback(null, obj);
        return;
      }
      
      fs.stat(
        path + files[index],
        function (err, stats) {
          if (err) {
            callback(make_error("file error", JSON.stringify(err)));
            return;
          }
          if (stats.isFile()) {
            var obj = { filename: files[index], desc: files[index] };
            only_files.push(obj);
          }
          iter(index + 1);
        });
    })(0);
      
    });
}

function handle_incoming_request(req, res) {
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  
  req.parsed_url = url.parse(req.url, true);
  var core_url = req.parsed_url.pathname;
  
  if (core_url == '/albums.json') {
    handle_list_albums(req, res);
    } else if (core_url.substr(0, 7) == '/albums' 
              && core_url.substr(core_url.length - 5) == '.json') {
                handle_get_album(req, res);
    } else {
      send_failure(res, 404, invalid_resource());
    }
          
}


// function handle_incoming_request(req, res) {
//   console.log("INCOMING REQUEST: " + req.method + " " + req.url);
//   if (req.url == '/albums.json') {
//     handle_list_albums(req, res);
//   } else if (req.url.substr(0, 7) == '/albums'
//             && req.url.substr(req.url.length - 5) == '.json') {
//               handle_get_album(req, res);
//   } else {
//     send_failure(res, 404, invalid_resource());
//   }
// }

function handle_list_albums(req, res) {
  load_album_list(function(err, albums) {
    if (err) {
      send_failure(res, 500, err);
      return;
    }
    
    send_success(res, { albums: albums});
  });
}

function handle_get_album(req, res) {
  
  var query = req.parsed_url.query;
  var page_num = query.page ? query.page : 0;
  var page_size = query.page_size ? query.page_size : 1000;
  
  if (isNaN(parseInt(page_num))) page_num = 0;
  if (isNaN(parseInt(page_size))) page_size = 1000;
  
  var core_url = req.parsed_url.pathname;
  var album_name = core_url.substr(7, core_url.length - 12);
  console.log(album_name);
  
  load_album(
    album_name,
    page_num,
    page_size,
    function (err, album_contents) {
      if (err && err.error == "no_such_album") {
        send_failure(res, 404, err);
      } else if (err) {
        send_failure(res, 500, err);
      } else {
        send_success(res, { album_data: album_contents});
      }
    });
}

function make_error(err, msg) {
  var e = new Error(msg);
  e.code = err;
  return e;
}

function send_success(res, data) {
  res.writeHead(200, {"Content-Type": "application/json"});
  var output = { error: null, data: data };
  res.end(JSON.stringify(output) + "\n");
}

function send_failure(res, code, err) {
  var err_code = (err.code) ? err.code : err.name;
  //console.log(code);
  res.writeHead(code, { "Content-Type" : "application/json"});
  res.end(JSON.stringify({ error: err_code, message: err.message }) + "\n");
}

function invalid_resource() {
  return make_error("invalid_resource",
                    "the requested resource does not exist");
}

function no_such_album() {
  return make_error("no_such_album",
                    "The specified album does not exist");
}

var s = http.createServer(handle_incoming_request);
s.listen(process.env.PORT, process.env.IP);




