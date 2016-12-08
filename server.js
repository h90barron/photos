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

function do_rename(album_name, new_album_name, core_url, callback) {
    var trim_url = core_url.split('/');
    trim_url.pop();
    trim_url.shift();
    var original_url = trim_url.join('/');
    //console.log(original_url +"     " + original_url.replace(album_name, new_album_name));
    
    fs.readdir(
    "albums",
    function (err, files) {
      if(err) {
        callback(err);
        return;
      }
      
      
      for (var i = 0; i < files.length; i++) {
        if (files[i] == album_name) {
          fs.rename(original_url, original_url.replace(album_name, new_album_name), function (err, data) {
            if (err) {
              callback(err);
              console.log(original_url + "    " + original_url.replace(album_name, new_album_name));
              console.log(err.code, err.msg);
            }
            console.log("File change Success!!");
            return;
          });
        } 
      }
    });
      
}

function handle_incoming_request(req, res) {
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  
  req.parsed_url = url.parse(req.url, true);
  var core_url = req.parsed_url.pathname;
  
  if (core_url == '/albums.json') {
    handle_list_albums(req, res);
    } else if (core_url.substr(core_url.length -12) == '/rename.json'
      && req.method.toLowerCase() == 'post') {
        handle_rename_album(req, res);
    } else if (core_url.substr(0, 7) == '/albums' 
              && core_url.substr(core_url.length - 5) == '.json') {
                handle_get_album(req, res);
    } else {
      send_failure(res, 404, invalid_resource());
    }
          
}


function handle_rename_album(req, res) {
  var core_url = req.parsed_url.pathname;
  var parts = core_url.split('/');
  if (parts.length != 4) {
    send_failure(res, 404, invalid_resource());
    return;
  }
  
  var album_name = parts[2];
  
  //get POST data from request
  var json_body = '';
  req.on(
    'readable',
    function () {
      var d = req.read();
      if (d) {
        if (typeof d == 'string') {
          json_body += d;
        } else if (typeof d == 'object' && d instanceof Buffer) {
          json_body += d.toString('utf8');
        }
      }
    });
    
    req.on(
      'end',
      function () {
        // check for body
        if (json_body) {
          try {
            //try-catch since JSON.parse will throw error
            var album_data = JSON.parse(json_body);
            if (!album_data.album_name) {
              send_failure(res, 403, missing_data('album_name'));
              return;
            }
          } catch (e) {
            // invalid json
            send_failure(res, 403, bad_json());
            return;
        }
        
        
        do_rename(
          album_name,
          album_data.album_name,
          core_url,
          function (err, results) {
            if (err && err.code == "ENOENT") {
              send_failure(res, 403, no_such_album());
            } else if (err) {
                send_failure(res, 500, file_error(err));
                return;
            }
            send_success(res, null);
          });
      } else { 
        send_failure(res, 403, bad_json());
        res.end
      }
    });
}

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

function missing_data(missing_val) {
  return make_error(missing_val,
                    "JSON is missing the value for " + missing_val);
}

function file_error(err) {
  return make_error(err,
                    "There was a problem with the specified file" + " :: " + err.msg);
}

function bad_json() {
  return make_error("json_error",
                    "There submitted json is invalid. Check format");
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




