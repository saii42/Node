const mqtt = require('mqtt');
const serverConf = require('../conf/server.json');
const auth = require('../routes/auth')
const session_send = require('../routes/session_send')
const db = require("../db/mysql");
const conn = db.init();

const option = {
    host: serverConf.host,
    port: serverConf.mqtt.port
}
const client = mqtt.connect(option);



//브로커 연결부
client.on('connect', function () {
    var sql = 'select idx from thing'
    db.getConn(async (_err, connection) => {
        if (_err) console.log('mqtt broker connect topic err = ', _err)
        else {
            connection.query(sql, function (err, results, feilds) {
                if (err)
                    console.log(err)
                else { // 사물 전체의 idx를 topic으로 구독
                    for (var i = 0; i < results.length; i++) {
                        client.subscribe(serverConf.mqtt.subscribe + '-' + results[i].idx);
                    }
                    console.log('MQTT Broker listening')
                }
            })
        }
        connection.release()
    })
});

//MQTT 메세지 수신부
client.on('message', async function (topic, message) {
    var _message = message.toString().split('/');
    // console.log(topic.toString());
    var type = _message[0]

    switch (type) {
        case 'auth':
            var body = {
                thing_serial_number: _message[1],
                partnerWalletId: _message[2],
                partnerWalletPwd: _message[3],
                certId: _message[4],
                hkey: await _combineHkey(_message, 5)
            }
            var mqttAuth_result = await auth.auth(body)

            if (mqttAuth_result.code == 200) {
                var session_key = await session_send.mqttSession(mqttAuth_result.session_address);
                session_key = 'icncast/200/' + session_key

                await _publish(topic, session_key) //송신 Topic을 이용하여 세션키 리턴

                // client.publish(topic, session_key); //송신 Topic을 이용하여 세션키 리턴
            }
            break
        case 'step1':
            try {
                var body = {
                    thing_serial_number: _message[1],
                    walletId: _message[2],
                    walletPwd: _message[3]
                }

                console.log(body.walletId + '의 step1 인증')

                // 무결성 검증
                var mqttAuth1_result = await auth.step1Auth(body)
                var message = 'icncast/' + mqttAuth1_result.code + '/' + mqttAuth1_result.message
                if (mqttAuth1_result.code === 200) {
                    console.log(body.walletId + ' : 회원 맞음')
                }

                await _publish(topic, message)
            } catch (err) {
                console.log('mqtt step1 : ' + err)
            }
            break
        case 'step3':
            try {
                var body = {
                    thing_serial_number: _message[1],
                    walletId: _message[2],
                    walletPwd: _message[3],
                    hkey: await _combineHkey(_message, 4)
                }
                console.log(body.walletId + '의 step3 인증')

                var mqttAuth3_result = await auth.step3Auth(body)
                var message = 'icncast/' + mqttAuth3_result.code + '/' + mqttAuth3_result.message

                await _publish(topic, message)

            } catch (err) {
                console.log('mqtt step3 err : ' + err)
            }

            break
    }
});

async function _combineHkey(_message, num) {
    var _hkey = _message[num]

    for (var i = num + 1; i <= _message.length - 1; i++) {
        _hkey += '/' + _message[i]
    }
    return _hkey
}

async function _publish(topic, message) {
    client.publish(topic, message)
}

module.exports = client