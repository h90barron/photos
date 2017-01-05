var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

function handle_incoming_request(req, res) {
    console.log(url.parse(req.url, true));
    console.log("********************************************************************************************************************************");
    // if (req.method.toLowerCase() == 'get'
    //     && req.url.substring(0, 9) == '/content/') {
    //         serve_static_file(req.url.substring(9), res);
    //     } else {
    //         res.writeHead(404, { "Content-Type" : "application/json" });
            
    //         var out = { error: "not_found",
    //                     message: "'" + req.url + "' + not found" };
    //         res.end(JSON.stringify(out) + "\n");
    //     }
}


// function serve_static_file(file, res) {
//     var rs = fs.createReadStream(file);
//     var ct = file_content_type(file);
//     res.writeHead(200, { "Content-Type" : ct });
    
//     rs.on(
//         'readable',
//         function () {
//             var d = rs.read();
//             if (d) {
//                 if (typeof d == 'string') {
//                     res.write(d);
//                 } else if (typeof d == 'object' && d instanceof Buffer) {
//                     res.write(d.toString('utf8'));
//                 }
//             }
//         });
        
//     rs.on(
//         'end',
//         function () {
//             res.end();
//         });
        
//     rs.on(
//         'error',
//         function (e) {
//             res.writeHead(404, { "Content-Type" : "application/json" });
//             var out = { error: "not_found",
//                         message: "file not found" };
//             res.end(JSON.stringify(out) + "\n");
//             return;
//         });
// }

function serve_static_file(file, res) {
    fs.exists(file, function (exists) {
        if (!exists) {
            res.writeHead(404, { "Content-Type" : "application/json"});
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }

    var rs = fs.createReadStream(file);
    rs.on(
        'error',
        function (e) {
            console.log("An error has occcurred: " + JSON.stringify(e));
            res.end("");
        });
        
        var ct = file_content_type(file);
        res.writeHead(200, { "Content-Type" : ct });
        rs.pipe(res);
    });
}




function file_content_type(file) {
    var ext = path.extname(file);
    switch (ext.toLocaleLowerCase()) {
        case ".html" : return "text/html";
        case ".js" : return "text/javascript";
        case ".jpg" : case ".jpeg": return "image/jpeg";
        default: return "text/plain";
    }
}


var s = http.createServer(handle_incoming_request);
s.listen(process.env.PORT, process.env.IP);

