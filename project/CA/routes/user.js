const db = require("../db/mysql");
// const db = require("../db/");
const conn = db.init();


exports.userCheck = async function (walletId, walletPwd) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('userCheck func')
            var sql = 'select idx from user where user_email = ? and user_password = ?';
            var data = {}

            db.getConn(async (_err, connection) => {
                if (_err) console.log('usercheck db connection err = ', _err)
                connection.query(sql, [walletId, walletPwd], async function (err, results, fields) {
                    if (err) {
                        console.log('usercheck db ' + err)
                        data = {
                            code: 400,
                            message: err
                        }
                        reject(data)
                    } else {
                        if (Array.isArray(results) && results.length === 0) {
                            data = {
                                code: 401,
                                message: "ID와 PW를 확인해주세요."
                            }
                            resolve(data)
                        } else {
                            data = {
                                code: 200,
                                idx: results[0].idx
                            }
                            resolve(data)
                        }
                    }
                })
            })

            

        } catch (err) {
            console.log('userCheck err : ' + err)
        }

    })
}
exports.cas = async function (req, res) {
    console.log(req.payload)

}