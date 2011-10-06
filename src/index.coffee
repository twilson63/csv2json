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
  json = []
  csvjs.parse req.files[0].content, (err, row) -> 
    json.push row
    
  resp.writeHead 200, 
    'Content-Type': 'text/json' 
    "Content-Disposition": "attachment; filename=#{req.files[0].filename}.json"

  resp.end JSON.stringify(json)

app.listen 8000
