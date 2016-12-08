var http = require('http');

function handle_incoming_request(req, res) {
    console.log("---------------------------------------");
    console.log(req);
    console.log("---------------------------------------");
    console.log(res);
    console.log("---------------------------------------");
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify( { error: null }) + "\n");
}

var s = http.createServer(handle_incoming_request);
s.listen(process.env.PORT, process.env.IP);




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
    
    reg.on(
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