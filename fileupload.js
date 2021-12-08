var express = require('express')
var app = express()
var router = express.Router()


//파일관련 모듈
var multer = require('multer')

//파일 저장위치와 파일이름 설정
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  //파일이름 설정
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
//파일 업로드 모듈
var upload = multer({
  storage: storage
})

//파일 업로드
router.post('/upload', upload.single('attachFile'), async (req, res) => {
  try {
    console.log('req.body.filename :', req.body.filename)
    console.log('req.file :', req.file.originalname)
    console.log('req.file.path :', req.file.path)
    console.log('req.file.type :', req.file.mimetype)
    console.log('req.body.deviceid :', req.body.deviceid)
    console.log('upload :', upload)
    console.log('upload.storage.getFilename :', upload.storage.getFilename)
  } catch (e) {
    console.log("err : ", e);
  }
})

//파일 다운로드 눌렀을 때 작동
router.get('/uploads/images/:name', function (req, res) {
  var filename = req.params.name

  var file = __dirname + '/../uploads/images/' + filename
  console.log(__dirname)
  console.log(req.path)
  console.log(file)
  res.download(file) // Set disposition and send it.
})

module.exports = router