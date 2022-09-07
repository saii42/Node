const mysql = require('mysql');
const dbconfig = require("../conf/mysql_config")
// const dbconfig = require("../conf/awsRds_config")
const conn = mysql.createConnection(dbconfig)
var pool = mysql.createPool(dbconfig)



pool.on('acquire', function (connection) {
  // console.log(`Connection ${connection.threadId} acquired`);
});

pool.on('enqueue', function () {
  // console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
  // console.log(`Connection ${connection.threadId} released`);
});

pool.on('connection', function (connection) {
  // connection.query('SET SESSION auto_increment_increment=1')
  // console.log('connection')
});

module.exports = {
  init: () => {
    return mysql.createConnection(dbconfig)
  },
  connect: () => {
    try {
      conn.connect((err) => {
        if (err) {
          console.error('mysql connection error : ' + err)
        } else console.log('DB Connection')
      })
    } catch (e) {
      console.error('mysql connection error : ' + err)
    }
  },
  getConn: async (callback) => {
    pool.getConnection(async (err, connection) => {
      callback(err, connection);
    })
  },
}

function keepAlive(){
   pool.getConnection(function(err, connection){
     if(err) { return; }
     connection.ping();
     connection.release();
   });
 }
//  setInterval(keepAlive, 60*5000);

console.log('Connection pool created.')
console.log('DB Connection')
