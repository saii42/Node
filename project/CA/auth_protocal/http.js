const auth = require('../routes/auth')
const session = require('../routes/session_send')

exports.httpAuth = async (req, res) => {
  var body = JSON.parse(req.body);
  try {
    switch (body.method) {
      case 'auth': //coap 통신 프로토콜로 iot 기기 인증요청

        var httpAuth_result = await auth.auth(body)

        if (httpAuth_result.code == 200) {
          var api_address = httpAuth_result.session_address

          await session.session(api_address, res)
          break;
        }
    }
  } catch (e) {
    console.log(e)
  }
}

exports.http1Auth = async (req, res) => {
  //body 내용 : id, pw, 시리얼번호
  // var body = JSON.parse(req.body);
  console.log('http1auth : ' + req.ip)

  // 무결성 검증

  try {
    var httpAuth1_result = {}
    
    //빈칸검사
    if (req.body.walletId === null || req.body.walletId === undefined) {
      httpAuth1_result = {
        code: '400',
        message: '전달된 데이터가 없습니다.'
      }
      res.json(httpAuth1_result)
    }

    httpAuth1_result = await auth.step1Auth(req.body, req.ip)

    if (httpAuth1_result.code === 200) {
      console.log(req.body.walletId + ' : 회원 맞음')
    }
    else{
      console.log("http.js : ", httpAuth1_result)
    }
    res.json(httpAuth1_result)

  } catch (err) {
    console.log('http1auth : ' + err)
  }
}

exports.http3Auth = async (req, res) => {
  try {
    console.log('http3auth : ' + req.ip)

    var httpAuth3_result = await auth.step3Auth(req.body)

    res.json(httpAuth3_result)


  } catch (e) {
    console.log(e)
  }
}