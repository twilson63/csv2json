module.exports = ->
  (req, resp, next) ->    
    if req.method is 'POST'
      full_body = ''
      req.on 'data', (chunk) ->
        full_body += chunk.toString()
      req.on 'end', ->
        row_sep = full_body.match(/^(.*)\r\n/)[0]
        full_body = full_body.replace(/\r\n(.+)\r\n$/, '')
        req.files = []
        req.fields = {}
      
        for data in full_body.split(row_sep)
          result = data.match(/filename=\"(.*)\"\r\n/)
          if result?.length > 0
            filename = result[1]
            content = data.split("\r\n\r\n")[1]
            contentType = data.match(/Content-Type:\s(.*)\r\n/)[0]
            req.files.push { filename, content, contentType }
          else
            result = data.match(/name=\"(.*)\"\r\n/)
            if result?.length > 0
              name = result[1]
              value = data.split("\r\n\r\n")[1].replace(/\r\n/,'')
              req.fields[name] = value
        next()
    else
      next()
