const express = require('express');
const router = express()
const file = require('../file/file.controller');
var multer = require('../multer');
var upload = multer.upload;

router.use(express.json()); 
router.use(express.urlencoded( {extended : false } ));

router.get("/file", file.fileDownload);

router.post("/file", upload.single('attachFile'), file.fileUpload);


module.exports = router;