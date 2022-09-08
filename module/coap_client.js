const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var body1 = {
  method: "step1",
  thing_serial_number: "1q2w3e4r",
  walletId: "Test",
  walletPwd: "Test"
}

var body3 = {
  method: 'step3',
  thing_serial_number: '1q2w3e4r',
  walletId: "Test",
  walletPwd: "Test",
  hkey: 'nInRyjcBufdNR+aeYEntUWWa3+qY7KOJ32PxdBKsAsY'
}
const coap = require("coap"),
      req = coap.request('host:port')
      // req = coap.request('coap://127.0.0.1:5683')
      

req.write(JSON.stringify(body1))

req.on("response", function (res) {
  res.pipe(process.stdout)
  console.log(res)
})
req.end()


app.listen(9992, () => {
  console.log('9992 server listen')
})