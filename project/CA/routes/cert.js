const db = require("../db/mysql");
const conn = db.init();

exports.certid_create = async function (walletId) {
    return new Promise(async function (resolve, reject) {
        var check_result = true;
        while (check_result) {
            var certId = Math.random().toString(36).slice(2);
            // var certId = '1234';
            check_result = await _certid_duplicateCheck(certId)
            if (check_result === false) break;
        }
        var data = await _certid_insert(walletId, certId)
        if (data.code === 200) resolve(data)
        else reject(data)
    })
}

exports.certid_delete = async (certIdx) => {
    return new Promise(async function (resolve) {
        try {
            console.log('certid_delete 시작', certIdx)
            //디비에서 인덱스만 변경하여 certid는 유지하여 중복검사하기 

            var sql = 'update certid set status = ? where idx = ? '
            var status = '1' //0 유지 , 1은 삭제

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [status, certIdx],
                        function (err, results, fields) {
                            if (err) {
                                var data = {
                                    code: 400,
                                    message: 'db err'
                                }
                                console.log('certid_delete ', err)
                                resolve(data);
                            } else {
                                var data = {
                                    code: 200,
                                    message: 'delete success'
                                }
                                console.log(certIdx, " certidx status 변경 완료")
                                resolve(data);
                            }
                        }
                    )
                }
            })
        } catch (err) {
            console.log('certid_delete err : ', err)
            reject(err)
        }

    })

}

//certid 중복검사
async function _certid_duplicateCheck(certId) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('_certid_duplicateCheck 시작')
            var sql = 'select certid from certid where certid = ?';

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, certId,
                        function (err, results, fields) {
                            if (err) {
                            } else { // 중복 검사 빈칸일 시 중복 없음
                                if (Array.isArray(results) && results.length === 0) resolve(false)
                                else resolve(true)
                            }
                        }
                    )
                }
            })
        } catch (err) {
            reject(err)
            console.log('_certid_duplicateCheck err : ', err)
        }

    })

}

//certid 검색
exports.getCertId = async (thing_serial_number, user_idx) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(thing_serial_number, user_idx)
            var sql = 'select certid from certid where idx = (select certidx from thing where thing_serial_number = ? && user_idx = ?)';

            db.getConn(async (_err, connection) => {
                if (_err) console.log('certid check db err = ', _err)
                connection.query(sql, [thing_serial_number, user_idx],
                    async function (err, results, fields) {
                        if (err) {
                            var data = {
                                code: 400,
                                message: 'db err'
                            }
                            resolve(data)
                        } else {
                            if (Array.isArray(results) && results.length === 0) {
                                var data = {
                                    code: 401,
                                    message: '맞는 thing_serial_number 가 없습니다.'
                                }
                                resolve(data)
                            } else {
                                var data = {
                                    code: 200,
                                    certId: results[0].certid
                                }
                                resolve(data)
                            }
                        }
                    }
                )
            })
        } catch (err) {
            console.log(err)
            reject(err)

        }
    })
}
async function _certid_insert(walletId, certId) {
    return new Promise(async function (resolve, reject) {
        try {
            var status = '0'
            var sql = 'insert into certid(certid, status ,walletid) values (?, ? , ?) ';

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [certId, status, walletId],
                        async function (err, results, fields) {
                            if (err) {
                                console.log('_certid_insert db err', err);
                            } else {
                                var data = await _certidx(certId, walletId)
                            }
                            resolve(data)
                        }
                    )
                }
            })
        } catch (err) {
            console.log('catch 문 err : ', err)
            reject(err)
        }

    })
}


//certid 삭제를 위해 idx 검색(certid는 walletid 별로 구분하기 때문에 중복될 수 있기 때문에 찾는 작업)
async function _certidx(certId, walletId) {
    return new Promise(async function (resolve, reject) {
        try {
            var sql = 'SELECT idx FROM certid where certid= ? and walletid = ? ';

            db.getConn(async (_err, connection) => {

                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [certId, walletId],
                        async function (err, results, fields) {
                            if (err) {
                                var data = {
                                    code: 400,
                                    message: 'db err'
                                }
                                reject(data)
                                console.log('_certidx err : ', err)
                            } else {
                                var data = {
                                    code: 200,
                                    idx: results[0].idx
                                }
                                resolve(data)
                            }
                        }
                    )
                }
            })
        } catch (err) {
            console.log('_certidx catch err: ', err)
            reject(err)
        }

    })

}