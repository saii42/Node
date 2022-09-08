var mqtt = require('mqtt');
var crypto = require('./crypto')

const options = {
  host: '',
  port: 1883

};

const client = mqtt.connect(options);


client.on('connect',async function () {
  client.subscribe('');   // 구독명
  var hkey = 'UDOk8UH7pEGJv4RgmUfT5MdKRTazs/5qgAjN/x7rNb0='

  var message1 = 'step1/1q2w3e4r/Test/Test'
  var message3 = 'step3/1q2w3e4r/Test/Test/' + hkey

  client.publish('구독명', message3);  // 메세지 전송
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
});