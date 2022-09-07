const serverConf = require('../conf/server.json');
module.exports = {
  host: serverConf.host,
  user: serverConf.db.user,
  password: serverConf.db.password,
  database: 'kiotca',
  port: serverConf.db.port,
  connectionLimit: 5000,
  multipleStatements: true

}
