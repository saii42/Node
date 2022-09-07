const serverConf = require('../conf/server.json');

const redis = require('redis'),
    client = redis.createClient(serverConf.redis.port, serverConf.host)
//redis passport 
client.auth(serverConf.redis.requirepass)



module.exports = {
    connect: async () => {
        try {
            client.on('error', function (err) {
                console.log('redis : ' + err);
            });
            console.log('redis connection')
        } catch (e) {
            console.error('redis connection error : ' + err)
        }
    },
    get: async (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('redis key : ' + key)
                client.get(key, async (err, value) => {
                    if (err) console.log('get err : ', err)
                    console.log('redis ramdomkey : ' + value)
                    resolve(value)
                })
            } catch (err) {
                console.log('redis get err : ' + err)
                reject(value)
            }
        })
    },
    set: async (key, value) => {
        client.get(key, (err, _value) => {
            if (_value !== null) {
                console.log('redis key 생성 시 중복 체크 : ', _value + ' << 키를 삭제합니다.')
                client.del(key)
            }
            // client.set(key, value, async () => {
            client.set(key, value, 'EX', 10, async () => {   
                console.log('certid : ' + key + ' 난수값 : ' + value + ' \n난수 값 redis 저장 완료')
            })
            // client.expire(key, 10) //<< set 안에 포함되어 있음
        })
    },
    delete: async (key) => {
        client.del(key)
    }


}