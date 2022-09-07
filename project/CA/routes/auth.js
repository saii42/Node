const bcRequest = require("./bcRequest");
const division = require("./division");
const db = require("../db/mysql");
const conn = db.init();
const thing = require('./thing')
const cert = require('./cert')
const user = require('./user')
const combine = require('./combine')
const redis = require('../conf/redis')
const crypto = require('./crypto')
const log = require('./log')

exports.auth = async (payload) => {
    try {
        var hkey = payload.hkey;
        var walletId = payload.partnerWalletId;
        var walletPwd = payload.partnerWalletPwd;
        var thing_serial_number = payload.thing_serial_number;
        var data = {}
        var certId = await cert.getCertid(thing_serial_number);

        var serial_result = await auth_get_sessionAddress(thing_serial_number)

        console.log('auth : ', serial_result)
        if (serial_result.code == 200) {
            var bc_result = await bcAuth(hkey, certId, partnerWalletId, partnerWalletPwd)
            // if (bc_result == 200) {
            data = {
                code: 200,
                session_address: serial_result.session_address
            }
            // } else
            //     data = {
            //         code: 400,
            //         message: "bc err"
            //     }
        } else {
            data = {
                code: serial_result.code,
                message: serial_result
            }
        }
        return data
    } catch (e) {
        console.log(e);
        return e
    }
}

exports.step1Auth = async (body, ip) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('step1auth func : ' + JSON.stringify(body))

            var walletId = body.walletId;
            var walletPwd = body.walletPwd;
            var thing_serial_number = body.thing_serial_number;

            var userCheckResult = await user.userCheck(walletId, walletPwd);

            var certId = await cert.getCertId(thing_serial_number, userCheckResult.idx);

            var data = {}

            var timeOut = 10000

            if (userCheckResult.code === 200 && certId.code === 200) {
                console.log(await log.insertLog(ip, thing_serial_number, userCheckResult.idx));

                var randomKey = Math.random().toString(36).slice(2)
                data = {
                    code: 200,
                    message: randomKey
                }
                await redis.set(certId.certId, randomKey)
                resolve(data)

            } else if (userCheckResult.code !== 200) {
                data = userCheckResult
                resolve(data)
            } else if (certId.code !== 200) {
                data = certId
                resolve(data)
            }

        } catch (err) {
            console.log('step1auth ' + err)
            reject(err)
        }
    })
}

exports.step3Auth = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hkey = body.hkey;
            var walletId = body.walletId;
            var walletPwd = body.walletPwd;
            var thing_serial_number = body.thing_serial_number;

            var userCheckResult = await user.userCheck(walletId, walletPwd);
            var certId = await cert.getCertId(thing_serial_number, userCheckResult.idx);

            if (userCheckResult.code === 200 && certId.code === 200) {

                var randomKey = await redis.get(certId.certId)
                console.log('randomkey : ' + randomKey)
                if (randomKey === null || randomKey === undefined) {
                    var data = {
                        code: 405,
                        message: 'step1을 하지 않은 접근입니다.'
                    }
                    resolve(data)
                }


                var bc_result = await _bcAuth(hkey, certId.certId, randomKey, walletId, walletPwd, thing_serial_number)
                if (bc_result === 200) {
                    console.log(walletId + ' 인증 완료')
                    var data = {
                        code: 200,
                        message: 'success'
                    }
                    redis.delete(certId.certId) //인증성공시 난수값 삭제   << 테스트 후 주석
                } else if (bc_result === 404) {
                    var data = {
                        code: 400,
                        message: '키 불일치'
                    }

                } else {
                    var data = {
                        code: 400,
                        message: "bc err"
                    }
                }
            } else if (userCheckResult.code === 401) {
                var data = userCheckResult
            } else if (certId.code === 401) {
                var data = certId
            }
            resolve(data)
        } catch (err) {
            console.log('step3auth ' + err)
        }
    })
}


exports.session_get = async (req, res) => {
    console.log('전송 받은 세션키', req.body)
    res.end()
}

//세션키 전달할 api 주소 불러오는 함수
async function auth_get_sessionAddress(thing_serial_number) {
    return new Promise(async function (resolve, reject) {
        console.log('auth_get_sessionAddress 시리얼넘버 : ', thing_serial_number)
        var sql = 'select session_address from thing where thing_serial_number = ?'
        var data = {}
        db.getConn(async (_err, connection) => {
            if (_err) console.log('thingCheck db err = ', _err)
            else {
                connection.query(sql, thing_serial_number,
                    function (err, results, fields) {
                        if (err) {
                            data = {
                                code: 400,
                                message: err
                            }
                            reject(data)
                        } else {
                            if (Array.isArray(results) && results.length === 0) {
                                data = {
                                    code: 201,
                                    message: 'session_address 빈칸임'
                                }
                                resolve(data);
                            }
                            data = {
                                code: 200,
                                session_address: results[0].session_address
                            }
                            console.log('auth_get_sessionAddress : ', results[0].session_address)
                            resolve(data)
                        }
                    })
            }
            connection.release()
        })

    })
}



//블록체인 검증 함수
async function bcAuth(hkey, certId, partnerWalletId, partnerWalletPwd) {
    var id0 = "0"
    var id1 = "1"

    var hashdata = await division.division(hkey)
    var hkey0 = hashdata.slice(0, 1).toString()
    var hkey1 = hashdata.slice(1).toString()

    var result0 = await bcRequest.certifyGet(certId, hkey0, id0, partnerWalletId, partnerWalletPwd);
    var result1 = await bcRequest.certifyGet(certId, hkey1, id1, partnerWalletId, partnerWalletPwd);

    if (result0.code == 200 && result1.code == 200) {
        return 200
    } else if (result0.code == 400) {
        return 400
    } else
        return 401
}

//블록체인 1, 2 번 서버에서 해시키를 받아와 합친 후 비교
//블록체인 조회가 안되니 추후 서버 실행시 교체하기
async function _bcAuth(hkey, certId, randomKey, partnerWalletId, partnerWalletPwd, thing_serial_number) {
    return new Promise(async (resolve, reject) => {
        try {

            var id0 = "0"
            var id1 = "1"

            // var result0 = await bcRequest.certifyGet1(certId, id0, partnerWalletId, partnerWalletPwd);
            // var result1 = await bcRequest.certifyGet1(certId, id1, partnerWalletId, partnerWalletPwd);



            var result0 = {
                code: 200
            }
            var result1 = {
                code: 200
            }

            if (result0.code === 200 && result1.code === 200) {

                // var combineHkey = await division.combine(result0.hkey, result1.hkey)
                var combineHkey = await _combineHkey(thing_serial_number, partnerWalletId)

                console.log('블록체인 키 : ' + combineHkey.thing_hkey)

                var hashKey = await crypto.hash(combineHkey.thing_hkey, randomKey)
                // var hashKey = await crypto.hash(combineHkey, randomKey)


                console.log('해시화된 키 : ' + hashKey)
                console.log('전달받은 키 : ' + hkey)

                console.log('키비교 결과 :  ', hashKey === hkey)

                if (hashKey === hkey) {
                    resolve(200)
                } else resolve(404) // 키 불일치
            } else if (result0.code === 400) {
                reject(400)
            } else {
                reject(400)
            }
        } catch (err) {
            console.log('hash err : ' + err)
        }
    })

}

async function _combineHkey(serial_number, walletId) {
    return new Promise(async (resolve) => {
        try {
            var sql = 'select thing_hkey from thing where thing_serial_number = ? and user_idx = (SELECT idx FROM user where user_email = ?)';
            var data = {}

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [serial_number, walletId], async function (err, results, fields) {
                        if (err) {
                            data = {
                                code: 400,
                                message: 'db err'
                            }
                            console.log('thingCheck DB err ', err)
                        } else {
                            //빈칸 체크
                            if (Array.isArray(results) && results.length === 0) {
                                data = {
                                    code: 401,
                                    thing_hkey: 'hkey가 없습니다.'
                                }
                            } else {
                                data = {
                                    code: 200,
                                    thing_hkey: results[0].thing_hkey,
                                }
                            }
                        }
                        resolve(data)
                    })
                }
            })
        } catch (e) {
            console.log('_thingCheck catch err : ', e)
        }
    })
}