var crypto = require("crypto");
var request = require("request");

//create signature2
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var Base64 = require("crypto-js/enc-base64");

exports.send = async (phone) => {
  var userPhoneNumber = phone;
  var userAuthCode = Math.floor(Math.random() * (9999 - 1000) + 1000); //정수형 4자리 랜덤값     //Math.random().toString(36).slice(2); < 글자포함
  var resultCode = 404;

  const date = Date.now().toString();
  const uri = "";
  const secretKey = "";
  const accessKey = "";
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);

  request(
    {
      method: method,
      json: true,
      uri: url,
      headers: {
        "Contenc-type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: {
        type: "SMS",
        countryCode: "82",
        from: "01000000000", // 자신의 번호 입력
        content: `인증번호 ${userAuthCode} 입니다.`,
        messages: [
          {
            to: `${userPhoneNumber}`,
          },
        ],
      },
    },
    function (err, res, html) {
      if (err) console.log(err);
      else {
        resultCode = 200;
        console.log(html);
      }
    }
  );
  return resultCode;
};
