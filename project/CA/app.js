const express = require("express");
const app = express();
var route = require("./routes/api");
var bodyParser = require('body-parser')
var fs = require('fs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
  console.log("app.js");
  console.log(req.ip)
  res.send('Root')
})


app.get('/99877', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });
  // res.end(fs.readFileSync(__dirname + '/a.html'));
})


app.use("/api", route);


module.exports = app;