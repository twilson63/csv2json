(function() {
  var app, csvjs, express, multipart;
  express = require('express');
  multipart = require('./multipart');
  csvjs = require('csvjs');
  app = express.createServer(express.logger(), express.favicon(), express.static(__dirname + '/../public'), multipart());
  app.post('/', function(req, resp) {
    var json;
    json = [];
    csvjs.parse(req.files[0].content, {
      col_sep: req.fields['col-sep'].trim(),
      row_sep: '\n'
    }, function(err, row) {
      return json.push(row);
    });
    resp.writeHead(200, {
      'Content-Type': 'text/json',
      "Content-Disposition": "attachment; filename=" + req.files[0].filename + ".json"
    });
    return resp.end(JSON.stringify(json));
  });
  app.listen(process.env.PORT || 8000);
}).call(this);
