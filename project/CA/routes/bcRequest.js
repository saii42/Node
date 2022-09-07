const axios = require('axios');
const serverConf = require('../conf/server.json');

exports.certifyAdd = async (certId, certHkey, id, partnerWalletId, partnerWalletPwd) => {
    try {
        const res = await axios.post(`${serverConf.bc}/api/contract/certify/add`, {
            claim: {
                networkId: `${id}`
            },
            partnerWallet: {
                userId: `${partnerWalletId}`,
                walletPwd: `${partnerWalletPwd}`
            },
            cert: {
                certId: `${certId}`,
                certHkey: `${certHkey}`
            }
        })
        return res.status == 200 ? res.data.result : 400;
    } catch (error) {
        return error
    }
}

exports.certifyGet = async (certId, certHkey, id, partnerWalletId, partnerWalletPwd) => {
    try {
        const res = await axios.post(`${serverConf.bc}/api/contract/certify/do`, {
            claim: {
                networkId: `${id}`
            },
            partnerWallet: {
                userId: `${partnerWalletId}`,
                walletPwd: `${partnerWalletPwd}`
            },
            cert: {
                certId: `${certId}`,
                certHkey: `${certHkey}`
            }
        })
        return res.status == 200 ? res.data.result : 400;
    } catch (error) {
        return error
    }


}
//수정된 조회 certId를 보내면 hkey가 나오는 조회
exports.certifyGet1 = async (certId, id, partnerWalletId, partnerWalletPwd) => {
    return new Promise(async (resolve, reject) => {

        try {
            const res = await axios.post(`${serverConf.bc}/api/contract/certify/do`, {
                claim: {
                    networkId: `${id}`
                },
                partnerWallet: {
                    userId: `${partnerWalletId}`,
                    walletPwd: `${partnerWalletPwd}`
                },
                cert: {
                    certId: `${certId}`
                }
            })
            resolve(res.status == 200 ? res.data.result : 400)
        } catch (error) {
            return error
        }
    })



}