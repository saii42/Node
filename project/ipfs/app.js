const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes/api')

app.use("/api", route);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(9091, () => console.log('ICNCAST IPFS Server on port 9091!'))