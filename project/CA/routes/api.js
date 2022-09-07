'use strict'

const router = require('express').Router();
const ca = require("./ca");
const auth = require("./auth.js");
const httpAuth = require("../auth_protocal/http");
const thing = require("./thing")
const user = require('./user')

router.get('/', (req, res) => {
  console.log("api.js");
  res.send('KIOTCA API')
})

router.post("/thing-delete", thing.thing_delete)
router.post("/thing-create", thing.thing_create)
router.post("/thing-select", thing.thingIdx_Select)
router.post("/thing-session", thing.thingSessionAddress)


router.post("/user", user.cas)

router.post("/blockchain-get", ca.get)
router.post("/blockchain-insert", ca.insert)

router.post("/http-auth", httpAuth.httpAuth); 
router.post("/http-auth1", httpAuth.http1Auth); 
router.post("/http-auth3", httpAuth.http3Auth); 

router.post("/session-get", auth.session_get);

module.exports = router;