exports.version = '0.1.0';
var fs = require('fs');
var rh = require('./response_helpers.js');



exports.load_album_list = function(callback) {
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

exports.get_all_albums = function(req, res) {
    exports.load_album_list(function(err, albums) {
    if (err) {
      rh.send_failure(res, 500, err);
      return;
    }
    
    rh.send_success(res, { albums: albums});
  });
}

exports.get_album = function(req, res) {
  var page_num = 0;
  var page_size = 10;
  var album_name = req.params.album_name;
  console.log(album_name);
  //console.log(req.parsed_url);
  // var query = req.parsed_url.query;
  
  // var page_num = query.page ? query.page : 0;
  // var page_size = query.page_size ? query.page_size : 1000;
  
  if (isNaN(parseInt(page_num))) page_num = 0;
  if (isNaN(parseInt(page_size))) page_size = 1000;
  
  //var core_url = req.parsed_url.pathname;
  //var album_name = core_url.substr(7, core_url.length - 12);
  console.log(album_name);
  
  exports.load_album(
    album_name,
    page_num,
    page_size,
    function (err, album_contents) {
      if (err && err.error == "no_such_album") {
        rh.send_failure(res, 404, err);
      } else if (err) {
        rh.send_failure(res, 500, err);
      } else {
        rh.send_success(res, { album_data: album_contents});
      }
    });
}


exports.load_album = function(album_name, page, page_size, callback) {
    fs.readdir(
    "albums/" + album_name,
    function(err, files) {
      if (err) {
        if (err.code == "ENOENT") {
          callback(rh.no_such_album());
      } else {
        callback(rh.make_error("file error", JSON.stringify(err)));
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
            callback(rh.make_error("file error", JSON.stringify(err)));
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


