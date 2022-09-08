const cache = require('memory-cache')
var bodyParser = require('body-parser')
const sendMessage = require('./sendMessage')

const redis = require('redis')
const client = redis.createClient(6379, '127.0.0.1')
// const client = redis.createClient(6379, '13.124.36.142')


client.on('error', function (err) {
  console.log('Error : ' + err)
})

exports.authPhone = async (req, res) => {
  var userPhone = req.body.phone
  console.log(userPhone)

  sendMessage.send(userPhone)
  res.send({
    code: 200,
    success: '전송완료',
  })
}

exports.verifyCode = async (phone, code) => {
  const phoneNumber = phone
  var authCode = code

  var authValue = await getValue(phoneNumber)

  return new Promise(function (resolve, reject) {
    try {
      if (authValue == authCode) resolve(200)
      else if (!authValue) resolve(400)
      else if (authValue !== authCode) resolve(401)
      else resolve(400)
    } catch (err) {
      reject(err)
    }
    client.del(phoneNumber)
  })

  // if (authValue == authCode) {
  // }

  // if (!authValue) {
  //   return 400;
  // }

  // if (authValue !== authCode) {
  //   return 401;
  // }

  // client.del(phoneNumber);

  // console.log("userAuth 44 : return 200");

  // return 200;
}

exports.putValue = async (phone, value) => {
  client.set(phone, value, redis.print)
  console.log('userAuth :  61 ', phone, value + ' 추가 완료')
}

exports.delValue = async (phone) => {
  client.del(phone)
  console.log('userAuth :  66 ', phone + ' 삭제 완료')
}

function getValue(phone) {
  console.log('userAuth :  70 getValue(' + phone + ')')
  return new Promise(function (resolve, reject) {
    try {
      client.get(phone, function (err, value) {
        resolve(value)
      })
    } catch (err) {
      reject(err)
    }
  })
}

exports.testget = async (req, res) => {
  const phoneNumber = req.body.phone
  var authCode = req.body.code

  console.log('testget 시작')

  var authValue = await getValue(phoneNumber)
  console.log('testget 끝')

  return new Promise(function (resolve, reject) {
    try {
      if (authValue == authCode) resolve(200)
      else if (!authValue) resolve(400)
      else if (authValue !== authCode) resolve(401)
    } catch (err) {
      reject(err)
    }
    console.log('promise 끝')
    client.del(phoneNumber)
    console.log(client.get(phoneNumber), '삭제확인')
  })
}

function setp2(authValue) {
  const phoneNumber = req.body.phone
  var authCode = req.body.code

  console.log('testget 시작')

  var authValue = getValue(phoneNumber)

  if (!authValue) {
    console.log('!authValue if문')
    return 400
  }

  if (authValue !== authCode) {
    console.log('authValue !== authCode if문')
    return 401
  }

  console.log('authValue 비교 후')

  delValue(phoneNumber)
}

exports.testput = async (req, res) => {
  client.set(req.body.phone, req.body.code, redis.print)
  console.log(req.body.phone, req.body.code)
  res.end()
  
}
