const crypto = require('crypto');


exports.hash = async function (hkey, randomKey) {
    // console.log(crypto.createHmac('sha256', 'aoaskrnoc4').update('1234').digest('base64'))
    try {
        console.log('crypto hash')
        console.log('BC Key : ', hkey)
        console.log('redis random Key : ', randomKey)
        
        return crypto.createHmac('sha256', randomKey).update(hkey).digest('base64');
    } catch (err) {
        console.log('hash 안 ', err)
    }

}