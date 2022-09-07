const db = require("../db/mysql");

 exports.insertLog = async (ip , thing_serial_number, userIdx) => {
    return new Promise(async function (resolve, reject) {
        try {
            var status = '0'
            var sql = 'insert into login_log(login_ip, thing_serial_number ,user_idx) values (?, ? , ?) ';

            db.getConn(async (_err, connection) => {
                if (_err) console.log('thingCheck db err = ', _err)
                else {
                    connection.query(sql, [ip, thing_serial_number, userIdx],
                        async function (err, results, fields) {
                            if (err) {
                                console.log('log db err', err);
                            } else {
                                var data = {
                                    code:200,
                                    message:'success'
                                }
                            }
                            resolve(data)
                        }
                    )
                }
            })
        } catch (err) {
            console.log('catch err : ', err)
            reject(err)
        }

    })
}