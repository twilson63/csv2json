(function() {
  module.exports = function() {
    return function(req, resp, next) {
      var full_body;
      if (req.method === 'POST') {
        full_body = '';
        req.on('data', function(chunk) {
          return full_body += chunk.toString();
        });
        return req.on('end', function() {
          var content, contentType, data, filename, name, result, row_sep, value, _i, _len, _ref;
          row_sep = full_body.match(/^(.*)\r\n/)[0];
          full_body = full_body.replace(/\r\n(.+)\r\n$/, '');
          req.files = [];
          req.fields = {};
          _ref = full_body.split(row_sep);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            data = _ref[_i];
            result = data.match(/filename=\"(.*)\"\r\n/);
            if ((result != null ? result.length : void 0) > 0) {
              filename = result[1];
              content = data.split("\r\n\r\n")[1];
              contentType = data.match(/Content-Type:\s(.*)\r\n/)[0];
              req.files.push({
                filename: filename,
                content: content,
                contentType: contentType
              });
            } else {
              result = data.match(/name=\"(.*)\"\r\n/);
              if ((result != null ? result.length : void 0) > 0) {
                name = result[1];
                value = data.split("\r\n\r\n")[1].replace(/\r\n/, '');
                req.fields[name] = value;
              }
            }
          }
          return next();
        });
      } else {
        return next();
      }
    };
  };
}).call(this);
