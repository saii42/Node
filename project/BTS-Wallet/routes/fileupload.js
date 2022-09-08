var express = require('express')
var app = express()
var router = express.Router()

const mysql = require('mysql')
const dbconfig = require('../config/db')
const conn = mysql.createConnection(dbconfig)

var fs = require('fs');
var path = require('path');
var mime = require('mime');

var getDownloadFilename = require("./getDownloadFilename").getDownloadFilename

//파일관련 모듈
var multer = require('multer')

//파일 저장위치 설정
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  //파일이름 설정
  filename: function (req, file, cb) {

    var mimetype = mime.getType(file.originalname); // 파일의 타입(형식)을 가져옴
    if (mimetype == "image/png")
      cb(null, Date.now() + "-.png")
    else if ((mimetype == "image/jpeg"))
      cb(null, Date.now() + "-.jpg")
    else
      cb(null, Date.now() + "- " + file.originalname)
  },
})
//파일 업로드 모듈
var upload = multer({
  storage: storage
})



//파일 업로드
router.post('/upload', upload.single('attachFile'), async (req, res) => {
  try {
    var file = {
      filename: req.file.filename,
      originalname: req.body.filename,
      filetype: req.body.filetype,
      useridx: "",
      folderidx: req.body.folderidx,
      created: today,
      modified: today,
    }

    file.useridx = await userCheck(req);

    console.log('req.body.filename :', req.body.filename)
    console.log('req.file :', req.file.originalname)
    console.log('req.file.path :', req.file.path)
    console.log('req.body.type :', req.body.filetype)
    console.log('req.body.deviceid :', req.body.deviceid)
    console.log('upload :', upload)
    console.log('upload.storage.getFilename :', upload.storage.getFilename)

    //파일 위치를 mysql 서버에 저장
    conn.query('insert into file set ?', file, function (err, results, fields) {
      if (err) console.log("err : ", err)
      else res.json({
        code: 200,
        message: "success",
        filename: file.originalname
      })
    })
  } catch (e) {
    console.log("err : ", e);
  }
})

//파일 다운로드 눌렀을 때 작동
router.get('/download/:name', function (req, res) {
  var fileName = req.params.name
  console.log("fileName : ", fileName)

  var filePath = path.join(__dirname, "../uploads/")
  console.log("filePath : ", filePath)

  var file = filePath + fileName;

  // res.download(filePath + fileName) 



  // res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, filename)); // 다운받아질 파일명 설정

  // res.setHeader('Content-type', mimetype); // 파일 형식 지정


  //다운 보내줄 때 쿼리문 조회해서 파일 이름 변경해서 보내주기.!!!


  try {
    if (fs.existsSync(file)) { // 파일이 존재하는지 체크
      var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
      var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴

      res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, filename)); // 다운받아질 파일명 설정
      res.setHeader('Content-type', mimetype); // 파일 형식 지정

      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.send('해당 파일이 없습니다.');
      return;
    }
  } catch (e) { // 에러 발생시
    console.log(e);
    res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    return;
  }
})

function userCheck(deviceid) {

  return new Promise(function (resolve, reject) {
    try {

      conn.query('SELECT idx FROM users WHERE deviceid = ? ', deviceid, function (err, results, fields) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(results[0].idx)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}


module.exports = router