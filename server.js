if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
require('./db/mongoose')
const User = require('./models/user')

const userRouter = require('./routes/user-route')
const barkRouter = require('./routes/bark-route')
const port = process.env.PORT
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(userRouter)
app.use(barkRouter)

//connect route file to server

app.listen(port)
console.log('Server up on port: ' + port)