//파일관련 모듈
var multer = require('multer');

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

exports.upload = upload;
