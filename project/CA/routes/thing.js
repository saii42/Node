const cert = require('./cert')
const db = require("../db/mysql");
const conn = db.init();
const user = require('./user')

exports.thing_create = async (req, res) => {
    try {
        console.log('1. thing_create')
        var walletId = req.body.walletId
        var walletPwd = req.body.walletPwd;
        var hkey = req.body.hkey;
        var thing_serial_number = req.body.thing_serial_number;

        console.log('2. usercheck 시작')
        var userCheck_result = await user.userCheck(walletId, walletPwd)

        console.log('usercheck : ', userCheck_result.code)
        if (userCheck_result.code === 200) {
            console.log('3. _thingCheck 시작')
            var thing_serialNumber_check_result = await _thingCheck(walletId, thing_serial_number)

            console.log('thing_serialNumber_check_result : ', thing_serialNumber_check_result.code)

            if (thing_serialNumber_check_result.code === 401) {

                console.log('4. certid_create 시작')
                var certidCreate_result = await cert.certid_create(walletId);
                console.log('certidCreate_result : ', certidCreate_result)

                console.log('5. thing_insert 시작')
                var thingInsertResult = await thing_insert(userCheck_result.idx, certidCreate_result.idx, thing_serial_number, hkey)

                // 블록체인 블록 생성 코드 이어 붙이기
                res.json({
                    code: 200,
                    message: '사물 등록이 완료되었습니다.',
                    thing_idx: thingInsertResult.thing_idx
                })
            } else if (thing_serialNumber_check_result.code !== 401) {
                res.json({
                    code: 401,
                    message: "이미 시리얼 번호가 있습니다. 잘못 등록하신 경우 삭제하시고 다시 등록해주세요."
                })
            }

        } else if (userCheck_result.code !== 200) {
            res.json({
                userCheck_result
            })
        }
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}
exports.thingSessionAddress = async (req, res) => {
    try {
        var walletId = req.body.walletId
        var walletPwd = req.body.walletPwd
        var serial_number = req.body.thing_serial_number
        var sessionAddress = req.body.session_address

        var checkResults = await _thingCheck(walletId, serial_number)

        if (checkResults.code == 200) {
            var sql = 'UPDATE thing SET session_address = ? WHERE idx = ?'

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [sessionAddress, checkResults.thing_idx], async (err, results, field) => {
                        if (err)
                            console.log('session address insert err : ', err)
                        else {
                            res.json({
                                code: 200,
                                message: 'success'
                            })
                        }
                    })
                }
                connection.release()
            })
        } else {
            res.json({
                code: 400,
                message: '회원이 아니거나 해당하는 사물이 없습니다.'
            })
        }
    } catch (err) {
        console.log('session err : ', err)
    }

}

//사물 삭제
exports.thing_delete = async (req, res) => {
    try {
        var walletId = req.body.walletId
        var serial_number = req.body.thing_serial_number

        var userCheck_result = await user.userCheck(walletId)
        if (userCheck_result.code == 200) {
            var thing_result = await _thingCheck(walletId, serial_number)
            console.log('thing_result : ', thing_result)
            if (thing_result.code == 401) {
                res.json({
                    code: 401,
                    message: "해당하는 사물이 없습니다."
                })
            } else {
                var sql = 'delete from thing where idx = ?'

                db.getConn(async (_err, connection) => {
                    if (_err) console.log('thingCheck db err = ', _err)
                    else {
                        connection.query(sql, thing_result.thing_idx,
                            async function (err, results, fields) {
                                if (err) {
                                    console.log('thing_delete 사물이 없음. : ' + err)
                                    res.json({
                                        code: 401
                                    })
                                } else {
                                    await cert.certid_delete(thing_result.certidx)
                                    console.log("thingidx : ", thing_result.thing_idx, "delete complete")
                                    res.json({
                                        code: 200,
                                        message: 'delete complete'
                                    })
                                }
                            }
                        )
                    }
                })
            }
        } else {
            res.json({
                code: 400,
                message: "유저가 아닙니다."
            })
        } //유저 체크
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}
exports.thing_modify = async function (req, res) {
    //어떤 항목을 수정할지 정해야할듯하다. 그래서 추후에 설정.
}



async function thing_insert(user_idx, certidx, thing_serial_number, thing_hkey) {
    return new Promise(async (resolve) => {

        console.log('thing_insert : ', user_idx, certidx, thing_serial_number, thing_hkey)

        var sql = 'insert into thing(user_idx, certidx, thing_serial_number, thing_hkey) values (?, ?, ?, ?) ';
        var data = {}

        db.getConn(async (_err, connection) => {
            if (_err) console.log('thingCheck db err = ', _err)
            connection.query(sql, [user_idx, certidx, thing_serial_number, thing_hkey],
                async function (err, results, fields) {
                    if (err) {
                        console.log('thing_insert db err', err);
                        data = {
                            code: 400,
                            thing_idx: 'asd'
                        }
                    } else {
                        console.log('thing_insert 성공');
                        data = {
                            code: 200,
                            thing_idx: results.insertId
                        }
                    }
                    resolve(data)
                }
            )
        })


        // var sql = 'insert into thing(user_idx, certidx, thing_serial_number) values (?, ?, ?) ';
        // var data = {}

        // db.getConn(async (_err, connection) => {
        //     if (_err) console.log('thingCheck db err = ', _err)
        //     connection.query(sql, [user_idx, certidx, thing_serial_number],
        //         async function (err, results, fields) {
        //             if (err) {
        //                 console.log('thing_insert db err', err);
        //                 data = {
        //                     code: 400,
        //                     thing_idx: 'asd'
        //                 }
        //             } else {
        //                 console.log('thing_insert 성공');
        //                 data = {
        //                     code: 200,
        //                     thing_idx: results.insertId
        //                 }
        //             }
        //             resolve(data)
        //         }
        //     )
        // })
    })

}

//사물생성시 사물 No를 저장하지 못했을 경우 검색하는 API
exports.thingIdx_Select = async (req, res) => {
    try {
        var walletId = req.body.walletId
        var serial_number = req.body.thing_serial_number

        var checkResults = await _thingCheck(walletId, serial_number) //certId가 같이 나오기 때문에 data에 넣어서 리턴
        var data = {}
        if (checkResults.code == 200) {
            data = {
                code: 200,
                thing_idx: checkResults.thing_idx
            }
        } else data = checkResults

        res.json(data)

    } catch (err) {
        console.log("thingIdx_Select err - ", req.ip, req.body.walletId, err)
    }
}

exports.thingCheck = async function (walletId, serial_number) {
    return new Promise(resolve => {
        try {
            var sql = 'select idx, certidx from thing where thing_serial_number = ? and user_idx = (SELECT idx FROM user where user_email = ?)';
            var data = {}
            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [serial_number, walletId], function (err, results, fields) {
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
                                    code: 201,
                                    message: '해당하는 사물이 없습니다.'
                                }

                            } else {
                                data = {
                                    code: 200,
                                    thing_idx: results[0].idx,
                                    certidx: results[0].certidx
                                }
                            }
                        }
                    })
                    resolve(data)
                }
            })
        } catch (e) {
            console.log('thingCheck catch err : ', e)
        }
    })
}

async function _thingCheck(walletId, serial_number) {
    return new Promise(async (resolve) => {
        try {
            var sql = 'select idx, certidx from thing where thing_serial_number = ? and user_idx = (SELECT idx FROM user where user_email = ?)';
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
                                    thing_idx: '해당하는 시리얼번호의 사물이 없습니다.'
                                }
                            } else {
                                data = {
                                    code: 200,
                                    thing_idx: results[0].idx,
                                    certidx: results[0].certidx
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