express = require 'express'
multipart = require './multipart'
csvjs = require 'csvjs'
app = express.createServer(
  express.logger()
  express.favicon()
  express.static(__dirname + '/../public')
  multipart()
)

app.post '/', (req, resp) -> 
  # refactor...
  row_sep = req.fields['row-sep']
  row_sep = '\r\n' if req.fields['row-sep'] == '<cr><lf>'
  row_sep = '\r' if req.fields['row-sep'] == '<cr>'
  row_sep = '\n' if req.fields['row-sep'] == '<lf>'
  
  json = []
  csvjs.parse req.files[0].content, 
    col_sep: req.fields['col-sep']
    row_sep: row_sep
    (err, row) -> json.push row
    
  resp.writeHead 200, 
    'Content-Type': 'text/json' 
    "Content-Disposition": "attachment; filename=#{req.files[0].filename}.json"

  resp.end JSON.stringify(json)

app.listen 8000
