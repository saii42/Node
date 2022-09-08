const mysql = require('mysql')
const dbconfig = require('./config/db')
const connection = mysql.createConnection(dbconfig)

const express = require('express')
var bodyParser = require('body-parser')

const login = require('./routes/loginroutes')
const moblielogin = require('./routes/moblieloginroutes')
const userAuth = require('./routes/userAuth')
const listReq = require("./routes/listReq");
const file = require("./routes/fileupload");

const app = express()

app.use("/upload", express.static("uploads"));

// app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})


connection.connect()

app.set('port', process.env.PORT || 8888)

app.get('/', (req, res) => {
  res.send('Root')
})

app.get('/user', (req, res) => {
  if (req.body.index == 'sc') {
    console.log('스마트 컨트랙트' + req.body.smartcontract)
  } else if (req.body.index == 'w') {
    console.log('월렛' + req.body.wallet)
  }
  res.end()
})

const router = express.Router()

// test route
router.get('/', function (req, res) {
  console.log('welcome')
  res.json({ message: 'welcome to our upload module apis', code: 200 })
})

// route to handle user registration
//웹 API
router.post('/register', login.register)
router.post('/login', login.login)

//모바일 API
router.post('/moblie-login', moblielogin.moblieLogin)

router.post('/auto-login', moblielogin.autoLogin)

router.post('/auth', userAuth.authPhone)

router.post('/get', userAuth.testget)
router.post('/put', userAuth.testput)

router.post('/folder-list', listReq.folderListReq)
router.post('/file-list', listReq.fileListReq)

app.use('/file', file)
app.use('/api', router)


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
