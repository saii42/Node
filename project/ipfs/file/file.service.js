const path = require('path');
const fs = require('fs');
const ipfsClient = require('../ipfs/ipfs')

module.exports = class FileService {
    constructor() {}

    async addFile(fileBuffer) {
        return new Promise((resolve, reject) => {
            ipfsClient.files.add(fileBuffer, async (err, file) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(file[0].hash)
            })
        })
    }

    async getIPFSDownloadFile(downLoadfilePath, vaildCID) {
        return new Promise((resolve, reject) => {
            ipfsClient.files.get(vaildCID, async function (err, files) {
                files.forEach(async (file) => {
                    const downloadFile = file.content.toString('utf8');
                    fs.writeFileSync(downLoadfilePath, downloadFile, 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        console.log('write end');
                    })

                })
            })
            resolve (downLoadfilePath);
        })
    }
}