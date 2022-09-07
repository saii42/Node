const serverConf = require('./conf/server.json');
const app = require("./app");
const db = require("./db/mysql");
const conn = db.init();
const redis = require('./conf/redis')

const mqtt = require('./auth_protocal/mqtt')
const coap = require('./auth_protocal/coap');
const http = require('http').createServer(app);

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// db.connect()
redis.connect()


http.listen(serverConf.http, '0.0.0.0', () => {
  console.log('http server listening on port ' + serverConf.http)
})

// the default CoAP port is 5683
coap.listen(serverConf.coap, '0.0.0.0', () => {  
  console.log('coap server listening on port ' + serverConf.coap)
})

