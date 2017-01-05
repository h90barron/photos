exports.version = '0.1.0';

exports.make_error =function(err, msg) {
  var e = new Error(msg);
  e.code = err;
  return e;
}

exports.send_success = function(res, data) {
  res.writeHead(200, {"Content-Type": "application/json"});
  var output = { error: null, data: data };
  res.end(JSON.stringify(output) + "\n");
}

exports.send_failure = function(res, code, err) {
  var err_code = (err.code) ? err.code : err.name;
  //console.log(code);
  res.writeHead(code, { "Content-Type" : "application/json"});
  res.end(JSON.stringify({ error: err_code, message: err.message }) + "\n");
}

exports.missing_data = function(missing_val) {
  return exports.make_error(missing_val,
                    "JSON is missing the value for " + missing_val);
}

exports.file_error = function(err) {
  return exports.make_error(err,
                    "There was a problem with the specified file" + " :: " + err.msg);
}

exports.url_inspect = function(sub_params, url, matcher) {
  var start = sub_params[0];
  var length = sub_params[1];
  if (url.substr(start, length) == matcher) {
    return true;
  } else {
    return false;
  }
}

exports.bad_json = function() {
  return exports.make_error("json_error",
                    "There submitted json is invalid. Check format");
}

exports.invalid_resource = function() {
  return exports.make_error("invalid_resource",
                    "the requested resource does not exist");
}

exports.no_such_album = function() {
  return exports.make_error("no_such_album",
                    "The specified album does not exist");
}