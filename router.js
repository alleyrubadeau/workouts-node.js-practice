var routes = require('routes')()
var fs = require('fs')
var db =require('monk')('localhost/fitness')
var workouts = db.get('workouts')
var Qs = require('qs')


routes.addRoute('/workouts', function (req, res, url) {
  res.setHeader('Content-type', 'text/html')
  if(req.method === 'GET') {
    var template = ''
    workouts.find({}, function (err, docs) {
      if (err) throw err
      docs.forEach(function (doc) {
        template += '<h2><a href = "/workouts/' + doc._id + ' ">' + doc.name + '</a></h2>'
      })
      res.end(template)
    })
  }
  if(req.method === 'POST') {
    var data = ''
    req.on('data', function (chunk) {
      data += chunk
      console.log('thanks for the new workout!')
    })
    req.on('end', function () {
      var workout = Qs.parse(data)
      workouts.insert(workout, function (err, doc) {
        if(err) res.end('oops')
        res.writeHead('302', {'Location': '/workouts'})
        res.end()
      })
    })
  }
})

routes.addRoute('/workouts/new', function (req, res, url) {
  res.setHeader('Content-type', 'text/html')
  if(req.method === 'GET') {
    res.setHeader('Content-type', 'text/html')

    fs.readFile('templates/workouts/new.html', function (err, file) {
      if (err) throw error
      res.end(file.toString())
    })
  }
})





module.exports = routes
