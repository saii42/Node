const division = require("./division");
const bcRequest = require("./bcRequest");



exports.get = async (req, res) => {
    try {
        var hkey = req.body.hkey;
        var certId = req.body.certId;
        var partnerWalletId = req.body.partnerWalletId;
        var partnerWalletPwd = req.body.partnerWalletPwd;

        var id0 = "0"
        var id1 = "1"

        var hashdata = await division.division(hkey)
        var hkey0 = hashdata.slice(0, 1).toString()
        var hkey1 = hashdata.slice(1).toString()


        var result0 = await bcRequest.certifyGet(certId, hkey0, id0, partnerWalletId, partnerWalletPwd);
        var result1 = await bcRequest.certifyGet(certId, hkey1, id1, partnerWalletId, partnerWalletPwd);

        if (result0.code == 200 && result1.code == 200) {
            res.json({
                code: 200,
                message: "success"
            })
        } else if (result0.code == 400 && result1.code == 400) {
            res.json({
                code: 400,
                message: "fail"
            })
        }
    } catch (e) {
        console.log(e);
        res.json(e);
    }

}

exports.insert = async (req, res) => {
    try {
        var hkey = req.body.hkey;
        var certId = req.body.certId;
        var partnerWalletId = req.body.partnerWalletId;
        var partnerWalletPwd = req.body.partnerWalletPwd;

        var id0 = "0"
        var id1 = "1"
        var hashdata = await division.division(hkey) // hkey를 나눠서 0,1 네트워크에 블록 저장

        var hkey0 = hashdata.slice(0, 1).toString()
        var hkey1 = hashdata.slice(1).toString()

        var result0 = await bcRequest.certifyAdd(certId, hkey0, id0, partnerWalletId, partnerWalletPwd)
        var result1 = await bcRequest.certifyAdd(certId, hkey1, id1, partnerWalletId, partnerWalletPwd)

        if (result0.code == 200 && result1.code == 200) {
            res.json({
                code: 200,
                message: "success"
            })
        }
    } catch (e) {
        console.log(e);
    }
};

exports._thingInsert = async (partnerWalletId, partnerWalletPwd, certId, hkey) => {
    try {
        var id0 = "0"
        var id1 = "1"
        var hashdata = await division.division(hkey) // hkey를 나눠서 0,1 네트워크에 블록 저장

        var hkey0 = hashdata.slice(0, 1).toString()
        var hkey1 = hashdata.slice(1).toString()

        var result0 = await bcRequest.certifyAdd(certId, hkey0, id0, partnerWalletId, partnerWalletPwd)
        var result1 = await bcRequest.certifyAdd(certId, hkey1, id1, partnerWalletId, partnerWalletPwd)

        if (result0.code == 200 && result1.code == 200) {
            res.json({
                code: 200,
                message: "success"
            })
        }
    } catch (e) {
        console.log(e);
    }
};

