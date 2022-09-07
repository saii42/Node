const IPFS = require('ipfs-api');
const ipfsInfo = require('../conf/IpfsInfo.json')

const ipfsClient = new IPFS({
    host: ipfsInfo.host,
    port: ipfsInfo.port,
    protocol: ipfsInfo.protocol
});

module.exports = ipfsClient;

