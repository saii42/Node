const mysql = require('mysql')
const dbconfig = require('../config/db')
const connection = mysql.createConnection(dbconfig)


exports.folderListReq = async (req, res)=>{
    var deviceId = req.body.deviceId;

    var sql = `select * 
    from folder 
    where useridx in(
    SELECT idx 
    FROM users 
    where deviceid = ?);`;

    connection.query(
        sql,
        deviceId,
        function (error, results, fields) {
          if (error) {
            console.log('error ocurred', error)
            res.send({
              code: 400,
              failed: 'error ocurred',
            })
        }
        else{
          res.send({
            folderlist:results
          })
        }
    })
}
 
exports.fileListReq = async (req, res)=>{
  var deviceId = req.body.deviceId;
  var folderidx = req.body.folderidx;

  var sql = `select *
  from file 
  where folderidx = ? and 
  (SELECT idx 
   FROM users 
   where deviceid = ?);`;

  connection.query(
      sql,
      [folderidx,
      deviceId],
      function (error, results, fields) {
        if (error) {
          console.log('error ocurred', error)
          res.send({
            code: 400,
            failed: 'error ocurred',
          })
      }
      else res.send({filelist:results})
  })
}

exports.fileInfoReq = async (req, res)=>{
  var deviceId = req.body.deviceId;
  var fileidx = req.body.fileidx;

  var sql = `select *
  from file 
  where fileidx = ? and 
  (SELECT idx 
   FROM users 
   where deviceid = ?);`;

  connection.query(
      sql,
      [fileidx,
      deviceId],
      function (error, results, fields) {
        if (error) {
          console.log('error ocurred', error)
          res.send({
            code: 400,
            failed: 'error ocurred',
          })
      }
      else res.send({fileinfo:results})
  })
}