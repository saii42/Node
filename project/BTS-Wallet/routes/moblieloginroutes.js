const mysql = require('mysql')
const dbconfig = require('../config/db')
const connection = mysql.createConnection(dbconfig)

var crypto = require('crypto')
var request = require('request')
var sendMessage = require('./sendMessage')
const userAuth = require('./userAuth')

//file module
var multer = require('multer')

function registerUser(phone, deviceId, accessToken) {
  var today = new Date()
  var users = {
    userid: Math.random().toString(36).slice(2),
    pwd: Math.random().toString(36).slice(2),
    name: Math.random().toString(36).slice(2),
    email: Math.random().toString(36).slice(2),
    phone: phone,
    created: today,
    modified: today,
    deviceId: deviceId,
    accessToken: accessToken,
  }

  if (phone.length > 0) {
    connection.query('INSERT INTO users SET ?', users, function (
      error,
      results,
      fields,
    ) {
      if (error) {
        //DB error
        console.log('error ocurred', error)
        return 404
      } else {
        console.log('DB 추가 성공')
        return 200
      }
    })
  } else {
    console.log('빈 칸 입니다.')
    return 203
  }
}

exports.autoLogin = async (req, res) => {
  var deviceId = req.body.deviceId
  var accessToken = req.body.accessToken

  connection.query(
    'SELECT * FROM users WHERE deviceid = ?',
    deviceId,
    function (error, results, fields) {
      if (error) {
        console.log('error ocurred', error)
        res.send({
          code: 400,
          failed: 'error ocurred',
        })
      } else {
        if (results.length > 0) {
          if (results[0].accessToken == 'T') {
            res.send({
              code: 200,
              message: '자동 로그인 기기',
              phone: results[0].phone,
              userid: results[0].userid,
              pwd: results[0].pwd,
            })
          }
          if (results[0].accessToken == 'F') {
            res.send({
              code: 400,
              message: '자동로그인 F',
            })
          }
        } else {
          res.send({
            code: 400,
            message: '일치하는 기기가 없습니다.',
          })
        }
      }
    },
  )
}

exports.moblieLogin = async (req, res) => {
  var userPhone = req.body.phone
  var authCode = req.body.code
  var accessToken = req.body.accessToken
  var deviceId = req.body.deviceId

  var verifyCode = await userAuth.verifyCode(userPhone, authCode)

  if (verifyCode == 200) {
    connection.query(
      'SELECT * FROM users WHERE phone = ?',
      userPhone,
      function (error, results, fields) {
        if (error) {
          console.log('error ocurred', error)
          res.send({
            code: 400,
            failed: 'error ocurred',
          })
        } else {
          // console.log('The solution is: ', results);
          if (results.length > 0) {
            if (results[0].phone == userPhone) {
              console.log(userPhone + ' 로그인 성공')
              if (accessToken != results[0].accesstoken)
                console.log('자동로그인 액세스토큰 업데이트문 실행')
              res.send({
                code: 200,
                message: '로그인 성공',
                phone: results[0].phone,
                userid: results[0].userid,
                pwd: results[0].pwd,
                deviceId: results[0].deviceid,
                accessToken: results[0].accesstoken,
              })
            } else {
              console.log('Email and password does not match')
              res.send({
                code: 204,
                message: 'Email and password does not match',
              })
            }
          } else {
            console.log('가입이 안된 번호입니다. 회원가입으로 이동.')
            var registerCode = registerUser(userPhone, deviceId, accessToken)

            if (registerCode == 203) {
              res.send({
                code: 203,
                message: '빈 칸 입니다.',
              })
              return registerCode
            } else if (registerCode == 200) {
              res.send({
                code: 200,
                message: '가입 완료 후 로그인',
                phone: results[0].phone,
                userid: results[0].userid,
                pwd: results[0].pwd,
                deviceId: results[0].deviceid,
              })
            }
          }
        }
      },
    )
  } else {
    //400 , 401 에러 코드 발생시켜야함.
    res.send({
      code: 400,
      failed: '인증코드가 틀립니다. 다시 입력해 주세요.',
    })
  }
}
