const FileDto = require('./fileDto');
const FileService = require('./file.service')
const fs = require('fs');
const class_transformer_1 = require("class-transformer");
const path = require('path');
const filePath = require('../conf/filePath.json');
const fileService = new FileService();


exports.fileUpload = async (req, res) => {

    const filePath = req.file.path;
    const uploadFileData = class_transformer_1.plainToClass(FileDto.FileDto, req.file);

    let uploadFile = fs.readFileSync(filePath, 'utf8')

    let fileBuffer = Buffer.from(uploadFile);

    uploadFileData.hash = await fileService.addFile(fileBuffer)
    res.send(uploadFileData);
}

exports.fileDownload = async (req, res) => {
    const validCID = req.body.CID;
    const fileName = req.body.fileName;
    const uploadFilePath = path.join(filePath.uploadPath + '/' + fileName);
    const downLoadfilePath = path.join(filePath.downloadPath + '/' + fileName);

    //이미지 변환이 제대로 안되고 있음.
    if (req.body.fileType === 'image') {
        res.download(uploadFilePath, fileName);
    } else {
        const downloadFilePath = await fileService.getIPFSDownloadFile(downLoadfilePath, validCID);
        res.download(downloadFilePath, fileName);
    }
}