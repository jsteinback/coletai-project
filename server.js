var env = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const coletaiRoutes = require('./src/routes/routes');
const app = express();
const port = process.env.PORT || 3000;


app.get('/api/', (req, res) => {
    res.render('index.html');
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('views', path.join(__dirname, 'src/views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }));

app.use('/api', coletaiRoutes);

app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;