const axios = require('axios');
const db = require("../db/mysql");
const conn = db.init();

//http,coap 전용 세션 전송 함수
exports.session = async (session_address, res) => {
    try {
        var session_key = await _create_sessionKey();
        send_server(session_address, session_key)
        send_iot(session_key, res)
    } catch (e) {
        console.log(e)
    }
}
//MQTT 는 res가 없기 때문에 mqtt.js 에서 세션키 전송.
exports.mqttSession = async (session_address) => {
    try {
        var session_key = await _create_sessionKey();
        send_server(session_address, session_key)
        return session_key
    } catch (e) {
        console.log(e)
    }
}

//세션키 생성
async function _create_sessionKey() {
    var session_key = Math.random().toString(36).slice(2);
    return session_key
}

exports.create_sessionKey= async () => {
    var session_key = Math.random().toString(36).slice(2);
    return session_key
}

//서버로 세션키 송신
async function send_server(api_address, session_key) {
    const res = await axios.post(`${api_address}`, {
        sessionKey: session_key
    })
    if (res.status == 200) {
        console.log('세션키 전송 성공',api_address)
    } else console.log('세션키 전송 실패', api_address) //전송실패 이유 출력도 추가하기.
    return res.status == 200 ? 200 : 400; // res.status의 결과에 따라 200 or 400 를 반환함
}
//iot(coap, http) 기기로 세션키 송신
async function send_iot(session_key, res) {
    //coap 서버로 들어온 통신 응답. (iot에게 세션키 전달)
    res.end('icncast/' + 200 + '/' + session_key + '\n') 
    
}