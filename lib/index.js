(function() {
  var app, csvjs, express, multipart;
  express = require('express');
  multipart = require('./multipart');
  csvjs = require('csvjs');
  app = express.createServer(express.logger(), express.favicon(), express.static(__dirname + '/../public'), multipart());
  app.post('/', function(req, resp) {
    var json, row_sep;
    row_sep = req.fields['row-sep'];
    if (req.fields['row-sep'] === '<cr><lf>') {
      row_sep = '\r\n';
    }
    if (req.fields['row-sep'] === '<cr>') {
      row_sep = '\r';
    }
    if (req.fields['row-sep'] === '<lf>') {
      row_sep = '\n';
    }
    json = [];
    csvjs.parse(req.files[0].content, {
      col_sep: req.fields['col-sep'],
      row_sep: row_sep
    }, function(err, row) {
      return json.push(row);
    });
    resp.writeHead(200, {
      'Content-Type': 'text/json',
      "Content-Disposition": "attachment; filename=" + req.files[0].filename + ".json"
    });
    return resp.end(JSON.stringify(json));
  });
  app.listen(8000);
}).call(this);
