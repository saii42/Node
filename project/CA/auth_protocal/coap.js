const coap = require('coap').createServer();
const auth = require('../routes/auth')
const session_send = require('../routes/session_send')

coap.on('request', async (req, res) => {
  try {
    var body = JSON.parse(req.payload);
    console.log('coap auth : '+ JSON.stringify(body))

    if(body === undefined || body === '' || body === null) res.end('KIOTCA')

    // coap으로 들어오는 통신요청을 method로 구분

    switch (body.method) {
      case 'auth': //coap 통신 프로토콜로 iot 기기 인증요청
        try {
          var coapAuth_result = await auth.auth(body)

          if (coapAuth_result.code == 200) {
            var api_address = coapAuth_result.session_address


            await session_send.session(api_address, res)
            break;
          } else if (coapAuth_result.code == 400) {
            res.end('400 err')

          } else if (coapAuth_result.code == 401) {
            res.end('401 err')
          }

        } catch (err) {
          console.log('coap auth err ' + err)
        }
        break;

      case 'step1':
        try {
          console.log(body.walletId + '의 step1 인증')

          // 무결성 검증
          var coapAuth1_result = await auth.step1Auth(body)
          var message = 'icncast/' + coapAuth1_result.code + '/' + coapAuth1_result.message
          if (coapAuth1_result.code === 200) {
            console.log(body.walletId + ' : 회원 맞음')
          }
          res.end(message)
        } catch (err) {
          console.log('coapAuth1 : ' + err)
        }
        break

      case 'step3':
        try {
          console.log(body.walletId + '의 step3 인증')

          var mqttAuth3_result = await auth.step3Auth(body)
          var message = 'icncast/' + mqttAuth3_result.code + '/' + mqttAuth3_result.message

          console.log(body.walletId + ' 인증결과 : ' + message)

          res.end(message)

        } catch (err) {
          console.log('coap 수신부 : ' + err)
        }

        break
      default:
        res.end('ICNCAST')
    }
  } catch (err) {
    console.log(err)
    res.end('ICNCAST : ' + err)
  }

})

module.exports = coap;